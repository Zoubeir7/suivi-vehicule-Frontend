<template>
    <div class="container mt-5">
        <div class="col-md-8 mx-auto">
            <h1 class="h4 text-primary mb-4 text-center">Ajouter un Document</h1>
            <form @submit.prevent="ajouterDocument">
                <!-- Nom du Document -->
                <div class="mb-3">
                    <label for="nom" class="form-label">Nom du Document</label>
                    <input type="text" id="nom" v-model="nouveauDocument.nom" class="form-control"
                        :class="{ 'is-invalid': errors.nom }" placeholder="Entrez le nom du document" required />
                    <div v-if="errors.nom" class="invalid-feedback">{{ errors.nom }}</div>
                </div>

                <!-- Dates Validité -->
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="debut_validite" class="form-label">Début Validité</label>
                        <input type="date" id="debut_validite"
                            :value="nouveauDocument.debut_validite ? formatToDateInput(nouveauDocument.debut_validite) : ''"
                            @input="nouveauDocument.debut_validite = $event.target.value" class="form-control"
                            :class="{ 'is-invalid': errors.debut_validite }" required />
                        <div v-if="errors.debut_validite" class="invalid-feedback">{{ errors.debut_validite }}</div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="fin_validite" class="form-label">Fin Validité</label>
                        <input type="date" id="fin_validite"
                            :value="nouveauDocument.fin_validite ? formatToDateInput(nouveauDocument.fin_validite) : ''"
                            @input="nouveauDocument.fin_validite = $event.target.value" class="form-control"
                            :class="{ 'is-invalid': errors.fin_validite }" required />
                        <div v-if="errors.fin_validite" class="invalid-feedback">{{ errors.fin_validite }}</div>
                    </div>
                </div>

                <!-- Autres Champs -->
                <div class="mb-3">
                    <label for="cout" class="form-label">Coût</label>
                    <input type="number" id="cout" v-model="nouveauDocument.cout" class="form-control"
                        :class="{ 'is-invalid': errors.cout }" placeholder="Entrez le coût" step="0.01" min="0" />
                    <div v-if="errors.cout" class="invalid-feedback">{{ errors.cout }}</div>
                </div>
                <div class="mb-3">
                    <label for="renouvellement" class="form-label">Renouvellement</label>
                    <input type="date" id="renouvellement" v-model="nouveauDocument.renouvellement" class="form-control"
                        :min="today" :class="{ 'is-invalid': errors.renouvellement }" />
                    <div v-if="errors.renouvellement" class="invalid-feedback">{{ errors.renouvellement }}</div>
                </div>

                <div class="mb-3">
                    <label for="vehicule" class="form-label">Véhicule</label>
                    <select id="vehicule" v-model="nouveauDocument.vehiculeId" class="form-select"
                        :class="{ 'is-invalid': errors.vehiculeId }" required>
                        <option value="">-- Sélectionner --</option>
                        <option v-for="vehicule in vehicules" :key="vehicule.id" :value="vehicule.id">
                            {{ vehicule.marque }} - {{ vehicule.modele }}
                        </option>
                    </select>
                    <div v-if="errors.vehiculeId" class="invalid-feedback">{{ errors.vehiculeId }}</div>
                </div>

                <!-- Boutons -->
                <div class="d-flex justify-content-center">
                    <button type="submit" class="btn btn-primary" :disabled="isLoading">
                        <span v-if="isLoading">Ajout...</span>
                        <span v-else>Ajouter</span>
                    </button>
                    <button type="button" class="btn btn-secondary ms-3" @click="annuler">Annuler</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useDocumentStore } from "@/store/docStore";
import { useVehiculeStore } from "@/store/vehiculeStore";
import { useToast } from "vue-toastification";

// Date d'aujourd'hui
const today = new Date().toISOString().split("T")[0];

const router = useRouter();
const toast = useToast();
const documentStore = useDocumentStore();
const vehiculeStore = useVehiculeStore();

const nouveauDocument = ref({
    nom: "",
    debut_validite: "",
    fin_validite: "",
    cout: null,
    renouvellement: today, // Initialise avec la date d'aujourd'hui
    vehiculeId: "",
});

const errors = ref({});
const isLoading = computed(() => documentStore.isLoading);
const vehicules = computed(() => vehiculeStore.vehicules);

const formatToDateInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
};

const validateForm = () => {
    errors.value = {};
    const onlyLettersRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/; // Autorise les lettres avec accents et les espaces

    if (!nouveauDocument.value.nom) {
        errors.value.nom = "Nom requis.";
    } else if (!onlyLettersRegex.test(nouveauDocument.value.nom)) {
        errors.value.nom = "Le nom ne doit contenir que des lettres.";
    }

    if (!nouveauDocument.value.debut_validite) {
        errors.value.debut_validite = "Début validité requis.";
    }

    if (!nouveauDocument.value.fin_validite) {
        errors.value.fin_validite = "Fin validité requis.";
    } else if (
        nouveauDocument.value.debut_validite &&
        nouveauDocument.value.fin_validite < nouveauDocument.value.debut_validite
    ) {
        errors.value.fin_validite = "La date de fin doit être postérieure à la date de début.";
    }

    if (!nouveauDocument.value.vehiculeId) {
        errors.value.vehiculeId = "Sélectionnez un véhicule.";
    }

    // Validation du coût
    if (nouveauDocument.value.cout !== null && nouveauDocument.value.cout < 0) {
        errors.value.cout = "Le coût ne peut pas être négatif.";
    }

    // Nouvelle condition pour la date de renouvellement
    if (nouveauDocument.value.renouvellement && nouveauDocument.value.fin_validite) {
        if (nouveauDocument.value.fin_validite > nouveauDocument.value.renouvellement) {
            errors.value.renouvellement = "La date de fin doit être inférieure à la date de renouvellement.";
        }
    }

    return Object.keys(errors.value).length === 0;
};

const ajouterDocument = async () => {
    if (!validateForm()) return;
    try {
        await documentStore.createDocument(nouveauDocument.value);
        toast.success("Document ajouté !");
        router.push({ name: "listDocument" });
    } catch (error) {
        toast.error("Erreur à l'ajout !");
    }
};

const annuler = () => {
    router.push({ name: "listDocument" });
};

onMounted(async () => {
    await vehiculeStore.chargerVehicules();
});
</script>

<style scoped>
.container {
    max-width: 700px;
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
