<template>
  <div>
    <!-- Bouton Ajouter un Type d'Entretien -->
    <h4 class="mb-4">Liste des Types D'Entretiens</h4>

    <div class="text-end mb-4">
      <button v-if="role === 'ADMIN'" class="btn btn-primary btn-sm me-3 fw-bold"
        @click="navigate('ajoutTypeEntretien')">
        <i class="fa fa-plus me-1"></i> Ajouter un Type d'Entretien
      </button>
    </div>

    <!-- Table des types d'entretien -->
    <div class="table-responsive shadow-sm rounded bg-white p-3 mt-3">
      <table class="table table-hover table-borderless align-middle text-center">
        <thead class="table-light small-header">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nom</th>
            <th scope="col" class="responsive-hide">Statut</th>
            <th scope="col" class="responsive-hide">Utilisateur</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="typesEntretien.length === 0">
            <td colspan="5" class="text-danger fw-bold">Aucun type d'entretien trouvé</td>
          </tr>
          <tr v-else v-for="(type, index) in typesEntretien" :key="type.id">
            <td>{{ index + 1 }}</td>
            <td>{{ type.nom }}</td>
            <td class="responsive-hide">{{ type.status ? 'Actif' : 'Inactif' }}</td>
            <td class="responsive-hide">
              {{ type.utilisateur?.prenom || "N/A" }} {{ type.utilisateur?.nom }}
            </td>
            <td>
              <button class="btn btn-sm btn-info me-2" @click="viewType(type)">
                <i class="fa fa-eye"></i>
              </button>
              <button class="btn btn-sm btn-warning me-2" @click="editType(type)">
                <i class="fa fa-edit"></i>
              </button>
              <button v-if="role === 'ADMIN'" class="btn btn-sm btn-danger" @click="confirmDeleteType(type.id)">
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
        <p>Êtes-vous sûr de vouloir supprimer ce type d'entretien ?</p>
        <div class="modal-buttons">
          <button class="btn btn-secondary" @click="closeModal">Annuler</button>
          <button class="btn btn-danger" @click="deleteType">Supprimer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useTypeEntretienStore } from "@/store/typeEntretienStore";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "vue-toastification";

const router = useRouter();
const toast = useToast();

const store = useTypeEntretienStore();
const authStore = useAuthStore();

const showModal = ref(false);
const typeToDelete = ref(null);
const typesEntretien = ref([]);
const role = authStore.userRole; // Récupération du rôle de l'utilisateur

// Charger les types d'entretien
onMounted(async () => {
  try {
    await store.fetchTypesEntretien();
    typesEntretien.value = store.typesEntretien;
  } catch (error) {
    toast.error("Erreur lors de la récupération des types d'entretien.");
  }
});

// Navigation vers une autre page
const navigate = (routeName) => {
  router.push({ name: routeName });
};

// Voir un type d'entretien
const viewType = (type) => {
  router.push({ name: "voirTypeEntretien", params: { id: type.id } });
};

// Modifier un type d'entretien
const editType = (type) => {
  router.push({ name: "modifierTypeEntretien", params: { id: type.id } });
};

// Supprimer un type d'entretien
const confirmDeleteType = (id) => {
  typeToDelete.value = id;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  typeToDelete.value = null;
};

const deleteType = async () => {
  try {
    const response = await store.deleteTypeEntretien(typeToDelete.value);
    if (response.success) {
      toast.success("Type d'entretien supprimé avec succès !");
    } else {
      throw new Error(response.error);
    }
    // Recharger la liste après suppression
    await store.fetchTypesEntretien();
    typesEntretien.value = store.typesEntretien;
  } catch (error) {
    toast.error("Erreur lors de la suppression du type d'entretien.");
  } finally {
    closeModal();
  }
};
</script>

<style scoped>
.table th,
.table td {
  vertical-align: middle;
  text-align: center;
  white-space: nowrap;
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
