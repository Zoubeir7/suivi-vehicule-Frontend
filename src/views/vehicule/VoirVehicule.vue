<template>
    <div class="container mt-5">
        <div class="col-md-8 mx-auto">
            <h1 class="h4 text-primary mb-4 text-center">Détails du Véhicule</h1>
            <form>
                <!-- Marque -->
                <div class="mb-3">
                    <label for="marque" class="form-label">Marque</label>
                    <input type="text" class="form-control" id="marque" v-model="marque" disabled />
                </div>

                <!-- Modèle -->
                <div class="mb-3">
                    <label for="modele" class="form-label">Modèle</label>
                    <input type="text" class="form-control" id="modele" v-model="modele" disabled />
                </div>

                <!-- Immatriculation -->
                <div class="mb-3">
                    <label for="immatriculation" class="form-label">Immatriculation</label>
                    <input type="text" class="form-control" id="immatriculation" v-model="immatriculation" disabled />
                </div>

                <!-- Année de fabrication -->
                <div class="mb-3">
                    <label for="annee_de_fabrication" class="form-label">Année de fabrication</label>
                    <input type="text" class="form-control" id="annee_de_fabrication" v-model="anneeDeFabrication"
                        disabled />
                </div>

                <!-- Statut -->
                <div class="mb-3">
                    <label for="statut" class="form-label">Statut</label>
                    <input type="text" class="form-control" id="statut" v-model="statut" disabled />
                </div>

                <!-- Utilisateur -->
                <div class="mb-3">
                    <label for="utilisateur" class="form-label">Utilisateur</label>
                    <input type="text" class="form-control" id="utilisateur" v-model="utilisateur" disabled />
                </div>


                <!-- Retour à la liste -->
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
import { useVehiculeStore } from "@/store/vehiculeStore";  // Assurez-vous que ce store existe et est bien configuré.

// Instances de Vue Router et Pinia
const router = useRouter();
const route = useRoute();
const vehiculeStore = useVehiculeStore();

// Données réactives pour le formulaire
const marque = ref("");
const modele = ref("");
const immatriculation = ref("");
const anneeDeFabrication = ref("");
const statut = ref("");
const utilisateur = ref("");
const vehicule = ref("");

// Variables pour gérer la modale
const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');

// Charger les données du véhicule au montage du composant
onMounted(async () => {
    const vehiculeId = route.params.id;

    if (isNaN(vehiculeId) || vehiculeId <= 0) {
        showModal.value = true;
        modalTitle.value = 'Erreur';
        modalMessage.value = "ID véhicule invalide.";
        return router.push({ name: "listVehicule" });
    }

    try {
        // Rechercher d'abord dans le store (si les véhicules sont déjà chargés)
        let vehiculeData = vehiculeStore.vehicules.find((v) => v.id === vehiculeId);

        // Si le véhicule n'est pas trouvé, récupérer via une action
        if (!vehiculeData) {
            vehiculeData = await vehiculeStore.getVehiculeById(vehiculeId);
        }

        // Remplir le formulaire si le véhicule est trouvé
        if (vehiculeData) {
            marque.value = vehiculeData.marque;
            modele.value = vehiculeData.modele;
            immatriculation.value = vehiculeData.immatriculation;
            anneeDeFabrication.value = vehiculeData.annee_de_fabrication;
            statut.value = vehiculeData.statut;
            utilisateur.value = `${vehiculeData.utilisateur?.prenom || "N/A"} ${vehiculeData.utilisateur?.nom || "N/A"}`;
        } else {
            showModal.value = true;
            modalTitle.value = 'Erreur';
            modalMessage.value = "Véhicule introuvable.";
            router.push({ name: "listVehicule" });
        }
    } catch (err) {
        console.error("Erreur :", err);
        showModal.value = true;
        modalTitle.value = 'Erreur';
        modalMessage.value = "Une erreur est survenue lors de la récupération du véhicule.";
        router.push({ name: "listVehicule" });
    }
});

// Fonction pour revenir à la liste des véhicules
const goBack = () => {
    router.push({ name: "listVehicule" });
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
