<template>
    <div class="container mt-5">
        <div class="col-md-8 mx-auto">
            <h1 class="h4 text-primary mb-4 text-center">Détails de l'Utilisateur</h1>
            <form>
                <div class="mb-3">
                    <label for="prenom" class="form-label">Prénom</label>
                    <input type="text" class="form-control" id="prenom" v-model="prenom" disabled />
                </div>
                <div class="mb-3">
                    <label for="nom" class="form-label">Nom</label>
                    <input type="text" class="form-control" id="nom" v-model="nom" disabled />
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="email" v-model="email" disabled />
                </div>
                <div class="mb-3">
                    <label for="telephone" class="form-label">Numéro de téléphone</label>
                    <input type="text" class="form-control" id="telephone" v-model="telephone" disabled />
                </div>
                <div class="mb-3">
                    <label for="role" class="form-label">Rôle</label>
                    <select id="role" class="form-control" v-model="role" disabled>
                        <option value="ADMIN">ADMIN</option>
                        <option value="GESTIONNAIRE">GESTIONNAIRE</option>
                    </select>
                </div>
                <div class="mb-3 form-check">
                    <input type="checkbox" class="form-check-input" id="status" v-model="status" disabled />
                    <label class="form-check-label" for="status">Utilisateur actif</label>
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
import { useUserStore } from "@/store/utilStore";  // Assurez-vous que ce store existe et est bien configuré.

// Instances de Vue Router et Pinia
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

// Données réactives pour le formulaire
const prenom = ref("");
const nom = ref("");
const email = ref("");
const telephone = ref("");
const role = ref("");
const status = ref(true);

// Variables pour gérer la modale
const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');

// Charger les données de l'utilisateur au montage du composant
onMounted(async () => {
    const utilisateurId = Number(route.params.id);

    if (isNaN(utilisateurId) || utilisateurId <= 0) {
        showModal.value = true;
        modalTitle.value = 'Erreur';
        modalMessage.value = "ID utilisateur invalide.";
        return router.push({ name: "listUtil" });
    }

    try {
        // Rechercher d'abord dans le store (si les utilisateurs sont déjà chargés)
        let utilisateur = userStore.utilisateurs.find((u) => u.id === utilisateurId);

        // Si l'utilisateur n'est pas trouvé, récupérer via une action
        if (!utilisateur) {
            utilisateur = await userStore.getUtilisateurById(utilisateurId);
        }

        // Remplir le formulaire si l'utilisateur est trouvé
        if (utilisateur) {
            prenom.value = utilisateur.prenom;
            nom.value = utilisateur.nom;
            email.value = utilisateur.email;
            telephone.value = utilisateur.telephone;
            role.value = utilisateur.role;
            status.value = utilisateur.status;
        } else {
            showModal.value = true;
            modalTitle.value = 'Erreur';
            modalMessage.value = "Utilisateur introuvable.";
            router.push({ name: "listUtil" });
        }
    } catch (err) {
        console.error("Erreur :", err);
        showModal.value = true;
        modalTitle.value = 'Erreur';
        modalMessage.value = "Une erreur est survenue lors de la récupération de l'utilisateur.";
        router.push({ name: "listUtil" });
    }
});

// Fonction pour revenir à la liste des utilisateurs
const goBack = () => {
    router.push({ name: "listUtil" });
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
