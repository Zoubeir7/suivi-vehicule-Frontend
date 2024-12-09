<template>
    <div class="container mt-5">
        <div class="col-md-8 mx-auto">
            <h1 class="h4 text-primary mb-4 text-center">Détails de l'Entretien</h1>
            <form>
                <div class="mb-3">
                    <label for="dateEntretien" class="form-label">Date de l'entretien</label>
                    <input type="text" class="form-control" id="dateEntretien" v-model="dateEntretien" disabled />
                </div>
                <div class="mb-3">
                    <label for="cout" class="form-label">Coût</label>
                    <input type="text" class="form-control" id="cout" v-model="cout" disabled />
                </div>
                <div class="mb-3">
                    <label for="type" class="form-label">Type d'entretien</label>
                    <input type="text" class="form-control" id="type" v-model="type" disabled />
                </div>
                <div class="mb-3">
                    <label for="utilisateur" class="form-label">Utilisateur</label>
                    <input type="text" class="form-control" id="utilisateur" v-model="utilisateur" disabled />
                </div>
                <div class="mb-3">
                    <label for="vehicule" class="form-label">Véhicule</label>
                    <input type="text" class="form-control" id="vehicule" v-model="vehicule" disabled />
                </div>
                <div class="d-flex justify-content-center">
                    <button type="button" class="btn btn-primary" @click="goBack">
                        Retour à la liste
                    </button>
                </div>
            </form>
        </div>

        <!-- Modale de confirmation ou d'erreur -->
        <div v-if="showModal" class="modal-overlay">
            <div class="modal-content">
                <h5>{{ modalTitle }}</h5>
                <p>{{ modalMessage }}</p>
                <div class="modal-buttons">
                    <button class="btn btn-secondary" @click="closeModal">Fermer</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useEntretienStore } from "@/store/entretienStore"; // Import du store

// Instances Vue Router et Pinia
const router = useRouter();
const route = useRoute();
const entretienStore = useEntretienStore();

// Données réactives pour le formulaire
const dateEntretien = ref("");
const cout = ref("");
const type = ref("");
const utilisateur = ref("");
const vehicule = ref("");

// Variables pour la gestion de la modale
const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');

// Charger les données de l'entretien lors du montage du composant
onMounted(async () => {
    const entretienId = Number(route.params.id);

    if (isNaN(entretienId) || entretienId <= 0) {
        showModal.value = true;
        modalTitle.value = 'Erreur';
        modalMessage.value = "ID entretien invalide.";
        return router.push({ name: "listEntretiens" });
    }

    try {
        // Récupérer l'entretien à partir du store
        const entretien = await entretienStore.getEntretienById(entretienId);

        if (entretien) {
            dateEntretien.value = new Date(entretien.date).toLocaleDateString("fr-FR");
            cout.value = `${entretien.cout.toLocaleString('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MRU`;
            type.value = entretien.typeEntretien?.nom || "N/A";
            utilisateur.value = `${entretien.utilisateur?.prenom || "N/A"} ${entretien.utilisateur?.nom || "N/A"}`;
            vehicule.value = `${entretien.vehicule?.marque || "N/A"} - ${entretien.vehicule?.modele || "N/A"}`;
        } else {
            showModal.value = true;
            modalTitle.value = 'Erreur';
            modalMessage.value = "Entretien introuvable.";
            router.push({ name: "listEntretien" });
        }
    } catch (err) {
        console.error("Erreur :", err);
        showModal.value = true;
        modalTitle.value = 'Erreur';
        modalMessage.value = "Une erreur est survenue lors de la récupération de l'entretien.";
        router.push({ name: "listEntretien" });
    }
});

// Retour à la liste des entretiens
const goBack = () => {
    router.push({ name: "listEntretien" });
};

// Fermer la modale
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
 