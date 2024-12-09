<template>
  <div>
    <!-- Bouton Ajouter un Document -->
    <h4 class="mb-4">Liste des Documents</h4>
    <div class="text-end mb-4">
      <button class="btn btn-primary btn-sm me-3 fw-bold" @click="navigate('ajoutDocument')">
        <i class="fa fa-plus me-1"></i> Ajouter un Document
      </button>
    </div>

    <!-- Table des documents -->
    <div class="table-responsive shadow-sm rounded bg-white p-3 mt-3">
      <table class="table table-hover table-borderless align-middle text-center">
        <thead class="table-light small-header">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nom</th>
            <th scope="col">Début Validité</th>
            <th scope="col">Fin Validité</th>
            <th scope="col" class="responsive-hide">Coût</th>
            <th scope="col" class="responsive-hide">Renouvellement</th>
            <th scope="col" class="responsive-hide">Véhicule</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="documents.length === 0">
            <td colspan="8" class="text-danger fw-bold">Aucun document trouvé</td>
          </tr>
          <tr v-for="(document, index) in documents" :key="document.id">
            <td>{{ index + 1 }}</td>
            <td>{{ document.nom }}</td>
            <td>{{ formatDate(document.debut_validite) }}</td>
            <td>{{ formatDate(document.fin_validite) }}</td>
            <td class="responsive-hide">{{ formatCout(document.cout) }}</td>
            <td class="responsive-hide">{{ formatDate(document.renouvellement) }}</td>
            <td class="responsive-hide">
              {{ document.vehicule?.marque || "N/A" }} - {{ document.vehicule?.modele || "N/A" }}
            </td>
            <td>
              <button class="btn btn-sm btn-info me-2" @click="viewDocument(document)">
                <i class="fa fa-eye"></i>
              </button>
              <button class="btn btn-sm btn-warning me-2" @click="editDocument(document, index)">
                <i class="fa fa-edit"></i>
              </button>
              <button v-if="role === 'ADMIN'" class="btn btn-sm btn-danger" @click="confirmDeleteDocument(document.id)">
                <i class="fa fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modale de confirmation -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h5>Confirmation</h5>
        <p>Êtes-vous sûr de vouloir supprimer ce document ?</p>
        <div class="modal-buttons">
          <button class="btn btn-secondary" @click="closeModal">Annuler</button>
          <button class="btn btn-danger" @click="deleteDocument">Supprimer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useDocumentStore } from "@/store/docStore";
import { useToast } from "vue-toastification";
import { useAuthStore } from "@/store/authStore";

const router = useRouter();
const store = useDocumentStore();
const toast = useToast();
const authStore = useAuthStore();

const showModal = ref(false);
const documentToDelete = ref(null);
const documents = ref([]);
const role = authStore.userRole;

// Charger les documents
onMounted(async () => {
  try {
    await store.fetchDocuments();
    documents.value = store.documents;
  } catch (error) {
    toast.error("Erreur lors de la récupération des documents.");
  }
});

// Navigation
const navigate = (routeName) => {
  router.push({ name: routeName });
};

// Voir un document
const viewDocument = (document) => {
  router.push({ name: "voirDocument", params: { id: document.id } });
};

// Modifier un document
const editDocument = (document, index) => {
  router.push({ name: "modifierDocument", params: { id: document.id } });
};

// Supprimer un document
const confirmDeleteDocument = (id) => {
  documentToDelete.value = id;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  documentToDelete.value = null;
};

const deleteDocument = async () => {
  try {
    // Suppression du document via l'API
    await store.deleteDocument(documentToDelete.value);

    // Mettre à jour localement la liste des documents
    documents.value = documents.value.filter((doc) => doc.id !== documentToDelete.value);

    toast.success("Document supprimé avec succès !");
  } catch (error) {
    toast.error("Erreur lors de la suppression du document.");
  } finally {
    closeModal(); // Fermer la modale dans tous les cas
  }
};

// Formatage des données
const formatDate = (date) => (date ? new Date(date).toLocaleDateString("fr-FR") : "N/A");
const formatCout = (cout) =>
  cout && !isNaN(cout)
    ? `${cout.toLocaleString("fr-MA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MRU`
    : "N/A";
</script>

<style scoped>
.table th,
.table td {
  vertical-align: middle;
  text-align: center;
  white-space: nowrap;
  min-width: 100px;
}

@media (max-width: 768px) {
  .responsive-hide {
    display: none;
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.modal-buttons .btn {
  margin: 0 10px;
}
</style>
