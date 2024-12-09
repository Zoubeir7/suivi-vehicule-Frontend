<template>
    <div class="container mt-1">
        <div class="col-md-8 mx-auto">
            <h1 class="h4 text-primary mb-4 text-center">Ajouter un Véhicule</h1>
            <form @submit.prevent="submitForm">
                <!-- Marque -->
                <div class="mb-3">
                    <label for="marque" class="form-label">Marque</label>
                    <input type="text" id="marque" v-model="form.marque" class="form-control"
                        :class="{ 'is-invalid': errors.marque }" required />
                    <!-- <div v-if="errors.marque" class="invalid-feedback">{{ errors.marque }}</div> -->
                </div>

                <!-- Modèle -->
                <div class="mb-3">
                    <label for="modele" class="form-label">Modèle</label>
                    <input type="text" id="modele" v-model="form.modele" class="form-control"
                        :class="{ 'is-invalid': errors.modele }" required />
                    <div v-if="errors.modele" class="invalid-feedback">{{ errors.modele }}</div>
                </div>

                <!-- Immatriculation -->
                <div class="mb-3">
                    <label for="immatriculation" class="form-label">Immatriculation</label>
                    <input type="text" id="immatriculation" v-model="form.immatriculation" class="form-control"
                        :class="{ 'is-invalid': errors.immatriculation }" required />
                    <!-- <div v-if="errors.immatriculation" class="invalid-feedback">{{ errors.immatriculation }}</div> -->
                </div>

                <!-- Année de Fabrication -->
                <div class="mb-3">
                    <label for="annee_de_fabrication" class="form-label">Année de Fabrication</label>
                    <input type="number" id="annee_de_fabrication" v-model="form.annee_de_fabrication"
                        class="form-control" required />
                    <div v-if="errors.annee_de_fabrication" class="invalid-feedback">{{ errors.annee_de_fabrication}}
                    </div>
                </div>

                <!-- Type de Carburant -->
                <div class="mb-3">
                    <label for="type_de_carburant" class="form-label">Type de Carburant</label>
                    <select id="type_de_carburant" v-model="form.type_de_carburant" class="form-select"
                        :class="{ 'is-invalid': errors.type_de_carburant }" required>
                        <option value="Essence">Essence</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Electrique">Electrique</option>
                        <option value="Hybride">Hybride</option>
                    </select>
                    <!-- <div v-if="errors.type_de_carburant" class="invalid-feedback">{{ errors.type_de_carburant }}</div> -->
                </div>

                <!-- Kilométrage -->
                <div class="mb-3">
                    <label for="kilometrage" class="form-label">Kilométrage</label>
                    <input type="number" id="kilometrage" v-model="form.kilometrage" class="form-control"
                        :class="{ 'is-invalid': errors.kilometrage }" />
                    <!-- <div v-if="errors.kilometrage" class="invalid-feedback">{{ errors.kilometrage }}</div> -->
                </div>

                <!-- Statut -->
                <div class="mb-3">
                    <label for="statut" class="form-label">Statut</label>
                    <select id="statut" v-model="form.statut" class="form-select"
                        :class="{ 'is-invalid': errors.statut }" required>
                        <option value="Disponible">Disponible</option>
                        <option value="Indisponible">Indisponible</option>
                    </select>
                    <!-- <div v-if="errors.statut" class="invalid-feedback">{{ errors.statut }}</div> -->
                </div>

                <!-- Boutons -->
                <div class="d-flex justify-content-center">
                    <button type="submit" class="btn btn-primary" :disabled="isLoading">
                        <span v-if="isLoading">Ajout...</span>
                        <span v-else>Ajouter</span>
                    </button>
                    <button type="button" class="btn btn-secondary ms-3" @click="navigateBack">
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useVehiculeStore } from "@/store/vehiculeStore";
import { useToast } from "vue-toastification";

// Dépendances
const router = useRouter();
const vehiculeStore = useVehiculeStore();
const toast = useToast();

// État local pour le formulaire
const form = ref({
    marque: "",
    modele: "",
    immatriculation: "",
    annee_de_fabrication: "",
    type_de_carburant: "Essence", // Valeur par défaut
    kilometrage: "",
    statut: "Disponible", // Valeur par défaut
});

const errors = reactive({
    marque: "",
    modele: "",
    immatriculation: "",
    annee_de_fabrication: "",
    kilometrage: ""
})

// États pour la gestion des erreurs
// const errors = ref({});
const isLoading = ref(false);

// Retour à la liste des véhicules
const navigateBack = () => router.push({ name: "listVehicule" });

// Soumission du formulaire d'ajout
const submitForm = async () => {
    try {
        isLoading.value = true;
        // errors.value = {};

        // Ajout du véhicule
        const reponse = await vehiculeStore.ajouterVehicule(form.value);

        if (reponse.success) {
            toast.success("Véhicule ajouté avec succès !");
            router.push({ name: "listVehicule" });
        } else {
            toast.error("Erreur lors de l'ajout du véhicule.");
        }
    } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
            error.response.data.errors.forEach(err => {
                if (err.path in errors) {
                    errors[err.path] = err.msg;
                }
            });
        } else {
            toast.error("Erreur lors de l'ajout du véhicule.");
        }
    } finally {
        isLoading.value = false;
    }
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

.is-invalid {
    border-color: #dc3545;
}

.invalid-feedback {
    color: #dc3545;
    font-size: 0.875em;
}
</style>
