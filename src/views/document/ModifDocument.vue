<template>
  <div class="container mt-5">
    <div class="col-md-8 mx-auto">
      <h1 class="h4 text-primary mb-4 text-center">Modifier le Document</h1>
      <form @submit.prevent="submitForm">
        <!-- Nom -->
        <div class="mb-3">
          <label for="nom" class="form-label">Nom</label>
          <input type="text" id="nom" v-model="document.nom" class="form-control" :class="{ 'is-invalid': errors.nom }"
            required />
          <div v-if="errors.nom" class="invalid-feedback">{{ errors.nom }}</div>
        </div>

        <!-- Début Validité -->
        <div class="mb-3">
          <label for="debut_validite" class="form-label">Début Validité</label>
          <input type="date" id="debut_validite" v-model="document.debut_validite" class="form-control"
            :class="{ 'is-invalid': errors.debut_validite }" required />
          <div v-if="errors.debut_validite" class="invalid-feedback">{{ errors.debut_validite }}</div>
        </div>

        <!-- Fin Validité -->
        <div class="mb-3">
          <label for="fin_validite" class="form-label">Fin Validité</label>
          <input type="date" id="fin_validite" v-model="document.fin_validite" class="form-control"
            :class="{ 'is-invalid': errors.fin_validite }" required />
          <div v-if="errors.fin_validite" class="invalid-feedback">{{ errors.fin_validite }}</div>
        </div>

        <!-- Coût -->
        <div class="mb-3">
          <label for="cout" class="form-label">Coût</label>
          <input type="number" id="cout" v-model.number="document.cout" class="form-control"
            :class="{ 'is-invalid': errors.cout }" step="0.01" required />
          <div v-if="errors.cout" class="invalid-feedback">{{ errors.cout }}</div>
        </div>

        <!-- Renouvellement -->
        <div class="mb-3">
          <label for="renouvellement" class="form-label">Renouvellement</label>
          <input type="date" id="renouvellement" v-model="document.renouvellement" class="form-control"
            :class="{ 'is-invalid': errors.renouvellement }" />
          <div v-if="errors.renouvellement" class="invalid-feedback">{{ errors.renouvellement }}</div>
        </div>

        <!-- Véhicule -->
        <div class="mb-3">
          <label for="vehicule" class="form-label">Véhicule</label>
          <input type="text" id="vehicule" v-model="document.vehicule.marque" class="form-control"
            :class="{ 'is-invalid': errors.vehicule }" required />
          <div v-if="errors.vehicule" class="invalid-feedback">{{ errors.vehicule }}</div>
        </div>

        <!-- Boutons -->
        <!-- Boutons -->
        <div class="d-flex justify-content-between">
          <button type="submit" class="btn btn-primary" :disabled="isLoading">
            <span v-if="isLoading">Modification...</span>
            <span v-else>Modifier</span>
          </button>
          <button type="button" class="btn btn-secondary" @click="cancelEdit">Annuler</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useDocumentStore } from "@/store/docStore";
import { useToast } from "vue-toastification";

const router = useRouter();
const route = useRoute();
const toast = useToast();
const documentStore = useDocumentStore();

const document = ref({
  nom: "",
  debut_validite: "",
  fin_validite: "",
  cout: "",
  renouvellement: "",
  vehicule: { marque: "" },
});
const errors = ref({});
const isLoading = computed(() => documentStore.isLoading);

const documentId = route.params.id;

// Valider le formulaire
const validateForm = () => {
  errors.value = {};

  if (!document.value.nom) {
    errors.value.nom = "Le nom est requis.";
  }
  if (!document.value.debut_validite) {
    errors.value.debut_validite = "La date de début de validité est requise.";
  }
  if (!document.value.fin_validite) {
    errors.value.fin_validite = "La date de fin de validité est requise.";
  }
  if (!document.value.cout) {
    errors.value.cout = "Le coût est requis.";
  }
  if (!document.value.vehicule.marque) {
    errors.value.vehicule = "Le véhicule est requis.";
  }

  return Object.keys(errors.value).length === 0;
};

// Charger les données du document
onMounted(async () => {
  try {
    await documentStore.fetchDocumentById(documentId);
    if (!documentStore.selectedDocument) {
      toast.error("Document non trouvé.");
      router.push({ name: "listDocument" });
    } else {
      document.value = {
        ...documentStore.selectedDocument,
        // Assurez-vous que les dates sont formatées pour le formulaire
        debut_validite: new Date(documentStore.selectedDocument.debut_validite).toISOString().split('T')[0],
        fin_validite: new Date(documentStore.selectedDocument.fin_validite).toISOString().split('T')[0],
        renouvellement: documentStore.selectedDocument.renouvellement ? new Date(documentStore.selectedDocument.renouvellement).toISOString().split('T')[0] : ''
      };
    }
  } catch (error) {
    toast.error("Erreur lors du chargement du document.");
    router.push({ name: "listDocument" });
  }
});

// Soumettre le formulaire
const submitForm = async () => {
  if (!validateForm()) return;

  try {
    const updatedDocument = {
      ...document.value,
      // Convertir les dates en ISO pour l'envoi
      debut_validite: new Date(document.value.debut_validite).toISOString(),
      fin_validite: new Date(document.value.fin_validite).toISOString(),
      renouvellement: document.value.renouvellement ? new Date(document.value.renouvellement).toISOString() : null,
      cout: parseFloat(document.value.cout),  // Assurez-vous que le coût est un nombre
    };

    await documentStore.updateDocument(documentId, updatedDocument);
    toast.success("Document mis à jour avec succès !");
    router.push({ name: "listDocument" });
  } catch (error) {
    toast.error("Erreur lors de la mise à jour du document.");
  }
};

// Annuler la modification
const cancelEdit = () => {
  router.push({ name: "listDocument" });
};
</script>

<style scoped>
.container {
  max-width: 800px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

button {
  min-width: 120px;
}

input,
select {
  margin-bottom: 10px;
}
</style>
