<template>
    <div>
        <!-- Bouton Ajouter un Incident -->
        <h4 class="mb-4">Liste des Incidents</h4>

        <div class="text-end mb-4">
            <button class="btn btn-primary btn-sm me-3 fw-bold" @click="navigate('ajoutIncident')">
                <i class="fa fa-plus me-1"></i> Ajouter un Incident
            </button>
        </div>

        <!-- Table des incidents -->
        <div class="table-responsive shadow-sm rounded bg-white p-3 mt-3">
            <table class="table table-hover table-borderless align-middle text-center">
                <thead class="table-light small-header">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Date</th>
                        <th scope="col" class="responsive-hide">Description</th>
                        <th scope="col" class="responsive-hide">Gravité</th>
                        <th scope="col" class="responsive-hide">Entretien Requis</th>
                        <th scope="col" class="responsive-hide">Statut</th>
                        <th scope="col" class="responsive-hide">Utilisateur</th>
                        <th scope="col" class="responsive-hide">Véhicule</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="incidents.length === 0">
                        <td colspan="9" class="text-danger fw-bold">Aucun incident trouvé</td>
                    </tr>
                    <tr v-else v-for="(incident, index) in incidents" :key="incident.id">
                        <td>{{ index + 1 }}</td>
                        <td>{{ formatDate(incident.date_incident) }}</td>
                        <td class="responsive-hide">{{ incident.description }}</td>
                        <td class="responsive-hide">{{ incident.gravite }}</td>
                        <td class="responsive-hide">
                            {{ incident.entretien_requis ? "Oui" : "Non" }}
                        </td>
                        <td class="responsive-hide">{{ incident.statut }}</td>
                        <td class="responsive-hide">{{ incident.utilisateur?.prenom || "N/A" }} {{
                            incident.utilisateur?.nom }}</td>
                        <td class="responsive-hide">{{ incident.vehicule?.marque || "N/A" }}- {{ incident.vehicule?.modele || "N/A" }}</td>
                        <td>
                            <button class="btn btn-sm btn-info me-2" @click="viewIncident(incident)">
                                <i class="fa fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-warning me-2" @click="editIncident(incident)">
                                <i class="fa fa-edit"></i>
                            </button>
                            <button v-if="role === 'ADMIN'" class="btn btn-sm btn-danger"
                                @click="confirmDeleteIncident(incident.id)">
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
                <p>Êtes-vous sûr de vouloir supprimer cet incident ?</p>
                <div class="modal-buttons">
                    <button class="btn btn-secondary" @click="closeModal">Annuler</button>
                    <button class="btn btn-danger" @click="deleteIncident">Supprimer</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useIncidentStore } from "@/store/incidentStore";
import { useToast } from "vue-toastification";
import { useAuthStore } from "../../store/authStore";

const router = useRouter();
const store = useIncidentStore();
const autStore = useAuthStore()
const toast = useToast();

const showModal = ref(false);
const incidentToDelete = ref(null);
const incidents = ref([]);

// Charger les incidents
onMounted(async () => {
    try {
        await store.fetchIncidents();
        incidents.value = store.incidents;
    } catch (error) {
        toast.error("Erreur lors de la récupération des incidents.");
    }
});

const role = autStore.userRole
// Navigation
const navigate = (routeName) => {
    router.push({ name: routeName });
};

// Voir un incident
const viewIncident = (incident) => {
    router.push({ name: "voirIncident", params: { id: incident.id } });
};

// Modifier un incident
const editIncident = (incident) => {
    router.push({ name: "modifierIncident", params: { id: incident.id } });
};


// Supprimer un incident
const confirmDeleteIncident = (id) => {
    incidentToDelete.value = id;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    incidentToDelete.value = null;
};

const deleteIncident = async () => {
  try {
    // Appeler le store pour supprimer l'incident
    const result = await store.supprimerIncident(incidentToDelete.value);
    if (result.success) {
      // Supprimer localement après succès
      incidents.value = incidents.value.filter(
        (incident) => incident.id !== incidentToDelete.value
      );
      toast.success("Incident supprimé avec succès !");
    } else {
      toast.error("Erreur lors de la suppression de l'incident.");
    }
  } catch (error) {
    toast.error("Erreur lors de la suppression de l'incident.");
  } finally {
    closeModal(); // Fermer la modale
  }
};



// Formatage des données
const formatDate = (date) => (date ? new Date(date).toLocaleDateString("fr-FR") : "N/A");
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
.highlighted-row {
    background-color: #d1e7dd;
    animation: fadeOut 3s forwards;
}

@keyframes fadeOut {
    to {
        background-color: transparent;
    }
}

</style>