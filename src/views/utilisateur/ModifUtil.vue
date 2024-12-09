<template>
    <div class="container mt-5">
        <div class="col-md-8 mx-auto">
            <h1 class="h4 text-primary mb-4 text-center">Modifier un Utilisateur</h1>
            <form @submit.prevent="modifierUtilisateur">
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="prenom" class="form-label">Prénom</label>
                        <input type="text" class="form-control" id="prenom" v-model="prenom" required />
                    </div>
                    <div class="col-md-6">
                        <label for="nom" class="form-label">Nom</label>
                        <input type="text" class="form-control" id="nom" v-model="nom" required />
                    </div>
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="email" v-model="email" required />
                </div>
                <div class="mb-3">
                    <label for="telephone" class="form-label">Téléphone</label>
                    <input type="text" class="form-control" id="telephone" v-model="telephone" />
                </div>
                <div class="mb-3">
                    <label for="role" class="form-label">Rôle</label>
                    <select id="role" class="form-control" v-model="role" required>
                        <option value="ADMIN">ADMIN</option>
                        <option value="GESTIONNAIRE">GESTIONNAIRE</option>
                    </select>
                </div>
                <div class="mb-3 form-check">
                    <input type="checkbox" class="form-check-input" id="status" v-model="status" />
                    <label for="status" class="form-check-label">Utilisateur actif</label>
                </div>
                <div class="d-flex justify-content-center">
                    <button type="submit" class="btn btn-primary" :disabled="isLoading">
                        <span v-if="isLoading">Modification...</span>
                        <span v-else>Modifier</span>
                    </button>
                    <button type="button" class="btn btn-secondary ms-3" @click="router.push({ name: 'listUtil' })">
                        Annuler
                    </button>
                </div>
            </form>
        </div>

        <!-- Modale de confirmation -->
        <div v-if="showModal" class="modal-overlay">
            <div class="modal-content">
                <h5 class="modal-title">{{ modalTitle }}</h5>
                <p>{{ modalMessage }}</p>
                <div class="modal-buttons">
                    <button class="btn btn-primary" @click="closeModal">Fermer</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/store/utilStore";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const isLoading = ref(false);
const prenom = ref("");
const nom = ref("");
const email = ref("");
const telephone = ref("");
const role = ref("");
const status = ref(true);

const showModal = ref(false);
const modalTitle = ref("");
const modalMessage = ref("");

// Charger les données utilisateur
onMounted(async () => {
    const utilisateurId = Number(route.params.id);

    if (isNaN(utilisateurId)) {
        modalTitle.value = "Erreur";
        modalMessage.value = "Identifiant utilisateur invalide.";
        showModal.value = true;
        router.push({ name: "listUtil" });
        return;
    }

    isLoading.value = true;

    try {
        let utilisateur = userStore.utilisateurs.find((u) => u.id === utilisateurId) ||
            await userStore.getUtilisateurById(utilisateurId);

        if (utilisateur) {
            prenom.value = utilisateur.prenom;
            nom.value = utilisateur.nom;
            email.value = utilisateur.email;
            telephone.value = utilisateur.telephone;
            role.value = utilisateur.role;
            status.value = utilisateur.status;
        } else {
            modalTitle.value = "Erreur";
            modalMessage.value = "Utilisateur introuvable.";
            showModal.value = true;
            router.push({ name: "listUtil" });
        }
    } catch (error) {
        modalTitle.value = "Erreur";
        modalMessage.value = "Une erreur est survenue lors du chargement des données.";
        showModal.value = true;
        router.push({ name: "listUtil" });
    } finally {
        isLoading.value = false;
    }
});

// Modifier un utilisateur
const modifierUtilisateur = async () => {
    isLoading.value = true;

    const utilisateurModifie = {
        id: Number(route.params.id),
        prenom: prenom.value,
        nom: nom.value,
        email: email.value,
        telephone: telephone.value,
        role: role.value,
        status: status.value,
    };

    try {
        await userStore.modifierUtilisateur(utilisateurModifie);
        modalTitle.value = "Succès";
        modalMessage.value = "Utilisateur modifié avec succès.";
        showModal.value = true;
        router.push({ name: "listUtil" });
    } catch (error) {
        modalTitle.value = "Erreur";
        modalMessage.value = "Échec de la modification : " + (error.response?.data?.message || error.message);
        showModal.value = true;
    } finally {
        isLoading.value = false;
    }
};

const closeModal = () => {
    showModal.value = false;
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
