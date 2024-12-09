<template>
  <div class="container mt-1">
    <div class="col-md-8 mx-auto">
      <h1 class="h4 text-primary mb-4 text-center">Modifier le Type d'Entretien</h1>
      <form v-if="form.nom !== ''" @submit.prevent="submitForm">
        <!-- Nom -->
        <div class="mb-3">
          <label for="nom" class="form-label">Nom</label>
          <input
            type="text"
            id="nom"
            v-model="form.nom"
            class="form-control"
            :class="{ 'is-invalid': errors.nom }"
            required
            placeholder="Entrez le nom du type d'entretien"
          />
          <div class="invalid-feedback" v-if="errors.nom">{{ errors.nom }}</div>
        </div>

        <!-- Statut -->
        <div class="mb-3">
          <label for="statut" class="form-label">Statut</label>
          <select
            id="statut"
            v-model="form.status"
            class="form-select"
            :class="{ 'is-invalid': errors.status }"
            required
          >
            <option value="" disabled>Sélectionnez un statut</option>
            <option value="true">Actif</option>
            <option value="false">Inactif</option>
          </select>
          <div class="invalid-feedback" v-if="errors.status">{{ errors.status }}</div>
        </div>

        <!-- Boutons -->
        <div class="d-flex justify-content-center">
          <button type="submit" class="btn btn-primary" :disabled="isLoading">
            <span v-if="isLoading">Modification...</span>
            <span v-else>Modifier</span>
          </button>
          <button type="button" class="btn btn-secondary ms-3" @click="navigateBack">
            Annuler
          </button>
        </div>
      </form>

      <div v-else class="text-center">
        <p>Chargement des données...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useTypeEntretienStore } from "@/store/typeEntretienStore";
import { useAuthStore } from "../../store/authStore"; // Import du store d'authentification

const router = useRouter();
const route = useRoute();
const toast = useToast();
const store = useTypeEntretienStore();
const authStore = useAuthStore(); // Initialisation du store d'authentification

const form = ref({ nom: "", status: "" });
const errors = ref({});
const isLoading = ref(false);

// Rôle de l'utilisateur depuis le store d'authentification
const role = authStore.userRole;

onMounted(async () => {
  if (role !== "ADMIN") {
    toast.error("Accès refusé : Vous n'avez pas les droits pour modifier ce type d'entretien.");
    navigateBack();
    return;
  }

  const id = route.params.id;
  const { success, data, error } = await store.getTypeEntretienById(parseInt(id));

  if (success) {
    form.value.nom = data.typeEntretien.nom;
    form.value.status = String(data.typeEntretien.status);
  } else {
    toast.error(error || "Erreur lors de la récupération des données.");
    navigateBack();
  }
});

const validateForm = () => {
  errors.value = {};
  if (!form.value.nom) errors.value.nom = "Le nom est obligatoire.";
  if (!form.value.status) errors.value.status = "Le statut est obligatoire.";
  return Object.keys(errors.value).length === 0;
};

const submitForm = async () => {
  if (!validateForm()) {
    toast.error("Veuillez corriger les erreurs.");
    return;
  }

  const id = parseInt(route.params.id);
  isLoading.value = true;

  try {
    const { success, error } = await store.updateTypeEntretien(id, form.value);

    if (success) {
      toast.success("Type d'entretien modifié avec succès !");
      navigateBack();
    } else {
      toast.error(error || "Erreur lors de la modification.");
    }
  } finally {
    isLoading.value = false;
  }
};

const navigateBack = () => {
  router.push({ name: "listTypeEntretien" });
};
</script>

<style scoped>
.container {
  max-width: 700px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

button {
  min-width: 120px;
}
</style>
