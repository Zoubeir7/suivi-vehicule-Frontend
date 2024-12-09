<template>
    <div>
        <!-- Title for the user list -->
        <h4 class="mb-4">Liste des Utilisateurs</h4>

        <div class="text-end mb-4">
            <button class="btn btn-primary btn-sm me-3 fw-bold" @click="navigate('ajoutUtil')">
                <i class="fa fa-plus me-1"></i> Ajouter un Utilisateur
            </button>
        </div>

        <!-- Table des utilisateurs -->
        <div class="table-responsive shadow-sm rounded bg-white p-3 mt-3">
            <table class="table table-hover table-borderless align-middle text-center">
                <thead class="table-light small-header">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Nom</th>
                        <th scope="col">Prénom</th>
                        <th scope="col" class="responsive-hide">Téléphone</th>
                        <th scope="col" class="responsive-hide">Email</th>
                        <th scope="col" class="responsive-hide">Rôle</th>
                        <th scope="col" class="responsive-hide">Statut</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="userStore.utilisateurs.length === 0">
                        <td colspan="8" class="text-danger fw-bold">Aucun utilisateur trouvé</td>
                    </tr>
                    <tr v-else v-for="(utilisateur, index) in userStore.utilisateurs" :key="utilisateur.id">
                        <td>{{ index + 1 }}</td>
                        <td>{{ utilisateur.nom }}</td>
                        <td>{{ utilisateur.prenom }}</td>
                        <td class="responsive-hide">{{ utilisateur.telephone }}</td>
                        <td class="responsive-hide">{{ utilisateur.email }}</td>
                        <td class="responsive-hide">{{ utilisateur.role }}</td>
                        <td class="responsive-hide">{{ utilisateur.status ? 'Actif' : 'Inactif' }}</td>
                        <td>
                            <button class="btn btn-sm btn-info me-2" @click="viewUser(utilisateur)">
                                <i class="fa fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-warning me-2" @click="editUser(utilisateur)">
                                <i class="fa fa-edit"></i>
                            </button>
                            <button v-if="role === 'ADMIN'" class="btn btn-sm btn-danger"
                                @click="confirmDeleteUser(utilisateur.id)">
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
                <p>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</p>
                <div class="modal-buttons">
                    <button class="btn btn-secondary" @click="closeModal">Annuler</button>
                    <button class="btn btn-danger" @click="deleteUser">Supprimer</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/utilStore";
import { useToast } from "vue-toastification";
import { useAuthStore } from "../../store/authStore";

const router = useRouter();
const userStore = useUserStore();
const toast = useToast();
const showModal = ref(false);
const userToDelete = ref(null);
const autStore = useAuthStore();

const role = autStore.userRole;

onMounted(async () => {
    await userStore.chargerUtilisateurs();
});

const navigate = (routeName) => {
    router.push({ name: routeName });
};

const viewUser = (user) => {
    router.push({ name: "voirUtil", params: { id: user.id } });
};

const editUser = (user) => {
    router.push({ name: "modifierUtil", params: { id: user.id } });
};

// Ouvrir la modale de confirmation de suppression
const confirmDeleteUser = (id) => {
    userToDelete.value = id;
    showModal.value = true;
};

// Fermer la modale
const closeModal = () => {
    showModal.value = false;
    userToDelete.value = null;
};

// Supprimer l'utilisateur
const deleteUser = async () => {
    try {
        // Appel à la méthode supprimerUtilisateur du store
        await userStore.supprimerUtilisateur(userToDelete.value);
        showModal.value = false;
        userToDelete.value = null;

        // Afficher un toast de succès
        toast.success("Utilisateur supprimé avec succès !");
    } catch (error) {
        toast.error("Erreur lors de la suppression de l'utilisateur : " + error.message);
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

/* Styles pour la modale */
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

.modal-buttons {
    margin-top: 20px;
}

.modal-buttons .btn {
    margin: 0 10px;
}
</style>
