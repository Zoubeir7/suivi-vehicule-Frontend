<template>
    <div class="container mt-5">
        <div class="col-md-8 mx-auto">
            <h1 class="h4 text-primary mb-4 text-center">Détails de l'Incident</h1>
            <form>
                <div class="mb-3">
                    <label for="dateIncident" class="form-label">Date de l'incident</label>
                    <input type="text" class="form-control" id="dateIncident" v-model="dateIncident" disabled />
                </div>
                <div class="mb-3">
                    <label for="description" class="form-label">Description</label>
                    <textarea class="form-control" id="description" v-model="description" disabled></textarea>
                </div>
                <div class="mb-3">
                    <label for="gravite" class="form-label">Gravité</label>
                    <input type="text" class="form-control" id="gravite" v-model="gravite" disabled />
                </div>
                <div class="mb-3">
                    <label for="entretienRequis" class="form-label">Entretien Requis</label>
                    <input type="text" class="form-control" id="entretienRequis" v-model="entretienRequis" disabled />
                </div>
                <div class="mb-3">
                    <label for="statut" class="form-label">Statut</label>
                    <input type="text" class="form-control" id="statut" v-model="statut" disabled />
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
import { useIncidentStore } from "@/store/incidentStore";  // Assurez-vous que ce store existe et est bien configuré.

// Instances de Vue Router et Pinia
const router = useRouter();
const route = useRoute();
const incidentStore = useIncidentStore();

// Données réactives pour le formulaire
const dateIncident = ref("");
const description = ref("");
const gravite = ref("");
const entretienRequis = ref("");
const statut = ref("");
const utilisateur = ref("");
const vehicule = ref("");

// Variables pour gérer la modale
const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');

// Charger les données de l'incident au montage du composant
onMounted(async () => {
    const incidentId = Number(route.params.id);

    if (isNaN(incidentId) || incidentId <= 0) {
        showModal.value = true;
        modalTitle.value = 'Erreur';
        modalMessage.value = "ID incident invalide.";
        return router.push({ name: "incidentList" });
    }

    try {
        let incident = incidentStore.incidents.find((i) => i.id === incidentId);

        if (!incident) {
            incident = await incidentStore.getIncidentById(incidentId);
        }

        if (incident) {
            dateIncident.value = incident.date_incident;
            description.value = incident.description;
            gravite.value = incident.gravite;
            entretienRequis.value = incident.entretien_requis ? "Oui" : "Non";
            statut.value = incident.statut;
            utilisateur.value = `${incident.utilisateur?.prenom || "N/A"} ${incident.utilisateur?.nom || "N/A"}`;
            vehicule.value = `${incident.vehicule?.marque || "N/A"} - ${incident.vehicule?.modele || "N/A"}`;
        } else {
            showModal.value = true;
            modalTitle.value = 'Erreur';
            modalMessage.value = "Incident introuvable.";
            router.push({ name: "incidentList" });
        }
    } catch (err) {
        console.error("Erreur :", err);
        showModal.value = true;
        modalTitle.value = 'Erreur';
        modalMessage.value = "Une erreur est survenue lors de la récupération de l'incident.";
        router.push({ name: "incidentList" });
    }
});

const goBack = () => {
    router.push({ name: "listIncident" });
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
