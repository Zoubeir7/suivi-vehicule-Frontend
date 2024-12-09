<template>
    <div>
        <!-- Title for the vehicle list -->
        <h4 class="mb-4">Liste des Véhicules</h4>

        <!-- Bouton Ajouter un Véhicule -->
        <div class="text-end mb-4">
            <button class="btn btn-primary btn-sm me-3 fw-bold" @click="navigateToAdd">
                <i class="fa fa-plus me-1"></i> Ajouter un Véhicule
            </button>
        </div>

        <!-- Table des véhicules -->
        <div class="table-responsive shadow-sm rounded bg-white p-3 mt-3">
            <table class="table table-hover table-borderless align-middle text-center">
                <thead class="table-light small-header">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Marque</th>
                        <th scope="col">Modèle</th>
                        <th scope="col" class="responsive-hide">Immatriculation</th>
                        <th scope="col" class="responsive-hide">Année</th>
                        <th scope="col" class="responsive-hide">Type de Carburant</th>
                        <th scope="col" class="responsive-hide">Statut</th>
                        <th scope="col" class="responsive-hide">Utilisateur</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="isLoading">
                        <td colspan="9" class="text-primary fw-bold">Chargement en cours...</td>
                    </tr>
                    <tr v-else-if="vehicules.length === 0">
                        <td colspan="9" class="text-danger fw-bold">Aucun véhicule trouvé</td>
                    </tr>
                    <tr v-else v-for="(vehicule, index) in vehicules" :key="vehicule.id">
                        <td>{{ index + 1 }}</td>
                        <td>{{ vehicule.marque }}</td>
                        <td>{{ vehicule.modele }}</td>
                        <td class="responsive-hide">{{ vehicule.immatriculation }}</td>
                        <td class="responsive-hide">{{ vehicule.annee_de_fabrication }}</td>
                        <td class="responsive-hide">{{ vehicule.type_de_carburant }}</td>
                        <td class="responsive-hide">{{ vehicule.statut }}</td>
                        <td class="responsive-hide">{{ vehicule.utilisateur?.prenom || "N/A" }} {{
                            vehicule.utilisateur?.nom }}</td>
                        <td>
                            <button class="btn btn-sm btn-info me-2" @click="viewVehicule(vehicule)">
                                <i class="fa fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-warning me-2" @click="editVehicule(vehicule)">
                                <i class="fa fa-edit"></i>
                            </button>
                            <button v-if="role === 'ADMIN'" class="btn btn-sm btn-danger"
                                @click="confirmDeleteVehicule(vehicule.id)">
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
                <p>Êtes-vous sûr de vouloir supprimer ce véhicule ?</p>
                <div class="modal-buttons">
                    <button class="btn btn-secondary" @click="closeModal">Annuler</button>
                    <button class="btn btn-danger" @click="deleteVehicule">
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useVehiculeStore } from "@/store/vehiculeStore";
import { useToast } from "vue-toastification";
import { useAuthStore } from "../../store/authStore";

// Dépendances
const router = useRouter();
const vehiculeStore = useVehiculeStore();
const toast = useToast();

// États locaux
const showModal = ref(false);
const vehiculeToDelete = ref(null);
const autStore = useAuthStore()

// Accéder aux données du store
const vehicules = computed(() => vehiculeStore.vehicules);
const isLoading = computed(() => vehiculeStore.isLoading);

const role = autStore.userRole

// Charger les véhicules au montage
onMounted(async () => {
    await vehiculeStore.chargerVehicules();
});

const navigateToAdd = () => router.push({ name: "ajoutVehicule" });
const viewVehicule = (vehicule) => router.push({ name: "voirVehicule", params: { id: vehicule.id } });
const editVehicule = (vehicule) => router.push({ name: "modifierVehicule", params: { id: vehicule.id } });

const confirmDeleteVehicule = (id) => {
    vehiculeToDelete.value = id;
    showModal.value = true;
};
const closeModal = () => {
    showModal.value = false;
    vehiculeToDelete.value = null;
};
const deleteVehicule = async () => {
    try {
        await vehiculeStore.supprimerVehicule(vehiculeToDelete.value);
        toast.success("Véhicule supprimé avec succès !");
    } catch (error) {
        toast.error("Erreur lors de la suppression du véhicule.");
    } finally {
        closeModal();
    }
};

const formatDate = (date) => (date ? new Date(date).getFullYear() : "N/A");
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
