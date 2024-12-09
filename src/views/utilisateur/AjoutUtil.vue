<template>
    <div class="container mt-5">
        <div class="col-md-8 mx-auto">
            <h1 class="h4 text-primary mb-4 text-center">Ajouter un Utilisateur</h1>
            <form @submit.prevent="ajouterUtilisateur">
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="prenom" class="form-label">Prénom</label>
                        <input type="text" id="prenom" v-model="form.prenom" class="form-control" required />
                    </div>
                    <div class="col-md-6">
                        <label for="nom" class="form-label">Nom</label>
                        <input type="text" id="nom" v-model="form.nom" class="form-control" required />
                    </div>
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" id="email" v-model="form.email" class="form-control" @blur="validateEmail"
                        required />
                    <small v-if="emailError" class="text-danger">{{ emailError }}</small>
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Mot de passe</label>
                    <input type="password" id="password" v-model="form.password" class="form-control" required />
                </div>
                <div class="mb-3">
                    <label for="telephone" class="form-label">Téléphone</label>
                    <input type="text" id="telephone" v-model="form.telephone" class="form-control"
                        @blur="validatePhone" />
                    <small v-if="phoneError" class="text-danger">{{ phoneError }}</small>
                </div>
                <div class="mb-3">
                    <label for="role" class="form-label">Rôle</label>
                    <select id="role" v-model="form.role" class="form-control" required>
                        <option value="ADMIN">ADMIN</option>
                        <option value="GESTIONNAIRE">GESTIONNAIRE</option>
                    </select>
                </div>
                <div class="mb-3 form-check">
                    <input type="checkbox" id="status" v-model="form.status" class="form-check-input" />
                    <label for="status" class="form-check-label">Utilisateur actif</label>
                </div>
                <div class="d-flex justify-content-center">
                    <button type="submit" class="btn btn-primary" :disabled="isLoading">
                        <span v-if="isLoading">Ajout...</span>
                        <span v-else>Ajouter</span>
                    </button>
                    <button type="button" class="btn btn-secondary ms-3" @click="annuler">
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
import { reactive, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/utilStore";

const router = useRouter();
const userStore = useUserStore();

const form = reactive({
    prenom: "",
    nom: "",
    email: "",
    password: "",
    telephone: "",
    role: "ADMIN",
    status: true,
});

const phoneError = ref(null);
const emailError = ref(null);

const isLoading = computed(() => userStore.isLoading);

const showModal = ref(false);
const modalTitle = ref("");
const modalMessage = ref("");

const validatePhone = () => {
    const regex = /^[234]\d{7}$/;
    phoneError.value = !regex.test(form.telephone)
        ? "Le numéro de téléphone doit comporter 8 chiffres et commencer par 2, 3 ou 4."
        : null;
};

const validateEmail = () => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    emailError.value = !regex.test(form.email)
        ? "L'email doit être un format valide (ex: utilisateur@domaine.com)."
        : null;
};

const validerFormulaire = () => {
    validatePhone();
    validateEmail();

    if (!form.prenom || !form.nom || !form.email || !form.password) {
        modalTitle.value = "Erreur";
        modalMessage.value = "Tous les champs obligatoires doivent être remplis.";
        showModal.value = true;
        return false;
    }

    if (phoneError.value || emailError.value) {
        return false;
    }

    return true;
};

const ajouterUtilisateur = async () => {
    if (!validerFormulaire()) return;

    try {
        await userStore.ajouterUtilisateur(form);
        modalTitle.value = "Succès";
        modalMessage.value = "Utilisateur ajouté avec succès.";
        showModal.value = true;
        router.push({ name: "listUtil" });
    } catch (error) {
        modalTitle.value = "Erreur";
        modalMessage.value = "Impossible d'ajouter l'utilisateur.";
        showModal.value = true;
    }
};

const closeModal = () => {
    showModal.value = false;
};

const annuler = () => {
    router.push({ name: "listUtil" });
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
