<template>
    <div>
        <!-- Bouton Ajouter un Entretien -->
        <h4 class="mb-4">Liste des Entretiens</h4>

        <div class="text-end mb-4">
            <button class="btn btn-primary btn-sm me-3 fw-bold" @click="navigate('ajoutEntretien')">
                <i class="fa fa-plus me-1"></i> Ajouter un Entretien
            </button>
        </div>

        <!-- Table des entretiens -->
        <div class="table-responsive shadow-sm rounded bg-white p-3 mt-3">
            <table class="table table-hover table-borderless align-middle text-center">
                <thead class="table-light small-header">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Date</th>
                        <th scope="col">Coût</th>
                        <th scope="col" class="responsive-hide">Type</th>
                        <th scope="col" class="responsive-hide">Utilisateur</th>
                        <th scope="col" class="responsive-hide">Véhicule</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="entretiens.length === 0">
                        <td colspan="7" class="text-danger fw-bold">Aucun entretien trouvé</td>
                    </tr>
                    <tr v-else v-for="(entretien, index) in entretiens" :key="entretien.id + entretien.modifiedAt">
                        <td>{{ index + 1 }}</td>
                        <td>{{ formatDate(entretien.date) }}</td>
                        <td>{{ formatCout(entretien.cout) }}</td>
                        <td class="responsive-hide">{{ entretien.typeEntretien?.nom || "N/A" }}</td>
                        <td class="responsive-hide">
                            {{ entretien.utilisateur?.prenom || "N/A" }} {{ entretien.utilisateur?.nom || "" }}
                        </td>
                        <td class="responsive-hide">{{ entretien.vehicule?.marque || "N/A" }} -{{
                            entretien.vehicule?.modele || "N/A" }}</td>
                        <td>
                            <button class="btn btn-sm btn-info me-2" @click="viewEntretien(entretien)">
                                <i class="fa fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-warning me-2" @click="editEntretien(entretien, index)">
                                <i class="fa fa-edit"></i>
                            </button>
                            <button v-if="role === 'ADMIN'" class="btn btn-sm btn-danger"
                                @click="confirmDeleteEntretien(entretien.id)">
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
                <p>Êtes-vous sûr de vouloir supprimer cet entretien ?</p>
                <div class="modal-buttons">
                    <button class="btn btn-secondary" @click="closeModal">Annuler</button>
                    <button class="btn btn-danger" @click="deleteEntretien">Supprimer</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useEntretienStore } from "@/store/entretienStore";
import { useToast } from "vue-toastification";
import { useAuthStore } from "@/store/authStore";

const router = useRouter();
const store = useEntretienStore();
const toast = useToast();
const authStore = useAuthStore();

const showModal = ref(false);
const entretienToDelete = ref(null);
const entretiens = ref([]);
const role = authStore.userRole;

// Charger les entretiens
onMounted(async () => {
    try {
        await store.fetchEntretiens();
        entretiens.value = store.entretiens;
    } catch (error) {
        toast.error("Erreur lors de la récupération des entretiens.");
    }
});

// Navigation
const navigate = (routeName) => {
    router.push({ name: routeName });
};

// Voir un entretien
const viewEntretien = (entretien) => {
    router.push({ name: "voirEntretien", params: { id: entretien.id } });
};

// Modifier un entretien
const editEntretien = (entretien, index) => {
    router.push({ name: "modifierEntretien", params: { id: entretien.id } });

    store.modifierEntretien(entretien.id, entretien).then(() => {
        // Mise à jour réactive du tableau après modification
        entretien.modifiedAt = Date.now();  // Ajout d'un timestamp pour forcer le ré-rendu

        // Remplacer l'élément modifié dans le tableau `entretiens`
        entretiens.value[index] = { ...entretien };

        // Forcer le recalcul du DOM après la mise à jour
        nextTick(() => {
            // Vous pouvez effectuer d'autres ajustements ici si nécessaire
        });
    }).catch(() => {
        toast.error("Erreur lors de la modification de l'entretien.");
    });
};

// Supprimer un entretien
const confirmDeleteEntretien = (id) => {
    entretienToDelete.value = id;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    entretienToDelete.value = null;
};

const deleteEntretien = async () => {
    try {
        // Suppression de l'entretien via l'API
        await store.supprimerEntretien(entretienToDelete.value);

        // Retirer localement l'entretien de la liste
        const index = entretiens.value.findIndex(e => e.id === entretienToDelete.value);
        if (index !== -1) {
            entretiens.value.splice(index, 1); 
        }

        toast.success("Entretien supprimé avec succès !");
    } catch (error) {
        toast.error("Erreur lors de la suppression de l'entretien.");
    } finally {
        closeModal();
    }
};

// Formatage des données
const formatDate = (date) => (date ? new Date(date).toLocaleDateString("fr-FR") : "N/A");
const formatCout = (cout) => {
    return cout && !isNaN(cout)
        ? `${cout.toLocaleString('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MRU`
        : "N/A";
};
</script>

<style scoped>
.table th,
.table td {
    vertical-align: middle;
    text-align: center;
    white-space: nowrap;
    min-width: 100px; /* Ajout d'une largeur minimale pour éviter le réagencement */
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
