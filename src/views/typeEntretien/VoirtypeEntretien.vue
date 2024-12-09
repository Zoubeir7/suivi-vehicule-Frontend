<template>
  <div class="container mt-5">
    <div class="col-md-8 mx-auto">
      <h1 class="h4 text-primary mb-4 text-center">Détails du Type d'Entretien</h1>
      <form>
        <div class="mb-3">
          <label for="nom" class="form-label">Nom</label>
          <input type="text" class="form-control" id="nom" v-model="nom" disabled />
        </div>
        <div class="mb-3">
          <label for="status" class="form-label">Statut</label>
          <input type="text" class="form-control" id="status" v-model="status" disabled />
        </div>
        <div class="mb-3">
          <label for="utilisateur" class="form-label">Utilisateur</label>
          <input type="text" class="form-control" id="utilisateur" v-model="utilisateur" disabled />
        </div>
        <div class="d-flex justify-content-center">
          <button type="button" class="btn btn-primary" @click="goBack">
            Retour à la liste
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modale de confirmation et message d'erreur/succès -->
  <div v-if="showModal" class="modal-overlay">
    <div class="modal-content">
      <h5>{{ modalTitle }}</h5>
      <p>{{ modalMessage }}</p>
      <div class="modal-buttons">
        <button class="btn btn-secondary" @click="closeModal">Fermer</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useTypeEntretienStore } from "@/store/typeEntretienStore";  // Assurez-vous que ce store existe et est bien configuré.

// Instances de Vue Router et Pinia
const router = useRouter();
const route = useRoute();
const typeEntretienStore = useTypeEntretienStore();

// Données réactives pour le formulaire
const nom = ref("");
const status = ref("");
const utilisateur = ref("");

// Variables pour gérer la modale
const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');

// Charger les données du type d'entretien au montage du composant
onMounted(async () => {
  const typeEntretienId = Number(route.params.id);

  if (isNaN(typeEntretienId) || typeEntretienId <= 0) {
    showModal.value = true;
    modalTitle.value = 'Erreur';
    modalMessage.value = "ID type d'entretien invalide.";
    return router.push({ name: "typesEntretienList" });
  }

  try {
    let typeEntretien = typeEntretienStore.typesEntretien.find((t) => t.id === typeEntretienId);

    if (!typeEntretien) {
      // Récupérer le type d'entretien à partir du store si pas déjà chargé
      const result = await typeEntretienStore.getTypeEntretienById(typeEntretienId);
      if (result.success) {
        typeEntretien = result.data;
      }
    }

    if (typeEntretien) {
      nom.value = typeEntretien.nom;
      status.value = typeEntretien.status ? 'Actif' : 'Inactif';
      utilisateur.value = `${typeEntretien.utilisateur?.prenom || "N/A"} ${typeEntretien.utilisateur?.nom || "N/A"}`;
    } else {
      showModal.value = true;
      modalTitle.value = 'Erreur';
      modalMessage.value = "Type d'entretien introuvable.";
      router.push({ name: "typesEntretienList" });
    }
  } catch (err) {
    console.error("Erreur :", err);
    showModal.value = true;
    modalTitle.value = 'Erreur';
    modalMessage.value = "Une erreur est survenue lors de la récupération du type d'entretien.";
    router.push({ name: "typesEntretienList" });
  }
});

const goBack = () => {
  router.push({ name: "listTypeEntretien" });
};

// Fonction pour fermer la modale
const closeModal = () => {
  showModal.value = false;
};
</script>

<style scoped>
/* Centrer le contenu du formulaire et les éléments */
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  max-width: 400px;
}

.modal-buttons .btn {
  margin: 10px 5px;
}
</style>
