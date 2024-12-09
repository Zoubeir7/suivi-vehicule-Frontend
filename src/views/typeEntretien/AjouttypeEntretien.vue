<template>
  <div class="container mt-1">
    <div class="col-md-8 mx-auto">
      <h1 class="h4 text-primary mb-4 text-center">Ajouter un Type d'Entretien</h1>
      <form @submit.prevent="submitForm">
        <!-- Nom -->
        <div class="mb-3">
          <label for="nom" class="form-label">Nom</label>
          <input
            type="text"
            id="nom"
            v-model="form.nom"
            class="form-control"
            :class="{ 'is-invalid': errors.nom }"
            :disabled="isLoading"
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
            :disabled="isLoading"
            required
          >
            <option value="" disabled>Sélectionnez un statut</option>
            <option :value="true">Actif</option>
            <option :value="false">Inactif</option>
          </select>
          <div class="invalid-feedback" v-if="errors.status">{{ errors.status }}</div>
        </div>

        <!-- Boutons -->
        <div class="d-flex justify-content-center">
          <button type="submit" class="btn btn-primary" :disabled="isLoading">
            <span v-if="isLoading">Ajout...</span>
            <span v-else>Ajouter</span>
          </button>
          <button type="button" class="btn btn-secondary ms-3" @click="navigateBack" :disabled="isLoading">
            Annuler
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useTypeEntretienStore } from "@/store/typeEntretienStore";
import { useToast } from "vue-toastification";

const router = useRouter();
const store = useTypeEntretienStore();
const toast = useToast();

const form = ref({
  nom: "",
  status: "",
});

const isLoading = ref(false);
const errors = ref({});

const navigateBack = () => router.push({ name: "listTypeEntretien" });

const validateForm = () => {
  errors.value = {};
  if (!form.value.nom) errors.value.nom = "Le nom est obligatoire.";
  if (form.value.status === "") errors.value.status = "Le statut est obligatoire.";
  return Object.keys(errors.value).length === 0;
};

const submitForm = async () => {
  if (!validateForm()) {
    toast.error("Veuillez corriger les erreurs dans le formulaire.");
    return;
  }

  try {
    isLoading.value = true;
    const response = await store.ajouterTypeEntretien(form.value);
    if (response.success) {
      toast.success("Type d'entretien ajouté avec succès !");
     navigateBack();
    } else {
      toast.error(response.error || "Erreur lors de l'ajout.");
    }
  } catch (error) {
    toast.error("Erreur inconnue lors de l'ajout.");
  } finally {
    isLoading.value = false;
  }
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
