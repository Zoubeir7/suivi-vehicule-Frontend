<template>
    <div class="container mt-5">
        <div class="col-md-8 mx-auto">
            <h1 class="h4 text-primary mb-4 text-center">Modifier un Véhicule</h1>
            <form @submit.prevent="modifierVehicule">
                <!-- Modèle -->
                <div class="mb-3">
                    <label for="modele" class="form-label">Modèle</label>
                    <input type="text" id="modele" v-model="vehicule.modele" class="form-control"
                        :class="{ 'is-invalid': errors.modele }" required />
                    <div v-if="errors.modele" class="invalid-feedback">
                        {{ errors.modele }}
                    </div>
                </div>

                <!-- Marque -->
                <div class="mb-3">
                    <label for="marque" class="form-label">Marque</label>
                    <input type="text" id="marque" v-model="vehicule.marque" class="form-control"
                        :class="{ 'is-invalid': errors.marque }" required />
                    <div v-if="errors.marque" class="invalid-feedback">
                        {{ errors.marque }}
                    </div>
                </div>

                <!-- Année de fabrication -->
                <div class="mb-3">
                    <label for="annee_de_fabrication" class="form-label">Année de fabrication</label>
                    <input type="number" id="annee_de_fabrication" v-model="vehicule.annee_de_fabrication"
                        class="form-control" :class="{ 'is-invalid': errors.annee_de_fabrication }" required />
                    <div v-if="errors.annee_de_fabrication" class="invalid-feedback">
                        {{ errors.annee_de_fabrication }}
                    </div>
                </div>

                <!-- Immatriculation -->
                <div class="mb-3">
                    <label for="immatriculation" class="form-label">Immatriculation</label>
                    <input type="text" id="immatriculation" v-model="vehicule.immatriculation" class="form-control"
                        :class="{ 'is-invalid': errors.immatriculation }" required />
                    <div v-if="errors.immatriculation" class="invalid-feedback">
                        {{ errors.immatriculation }}
                    </div>
                </div>

                <!-- Type de carburant -->
                <div class="mb-3">
                    <label for="type_de_carburant" class="form-label">Type de carburant</label>
                    <select id="type_de_carburant" v-model="vehicule.type_de_carburant" class="form-select"
                        :class="{ 'is-invalid': errors.type_de_carburant }" required>
                        <option value="">-- Sélectionner --</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Essence">Essence</option>
                        <option value="Electrique">Electrique</option>
                        <option value="Hybride">Hybride</option>
                    </select>
                    <div v-if="errors.type_de_carburant" class="invalid-feedback">
                        {{ errors.type_de_carburant }}
                    </div>
                </div>

                <!-- Kilométrage -->
                <div class="mb-3">
                    <label for="kilometrage" class="form-label">Kilométrage (en km)</label>
                    <input type="number" id="kilometrage" v-model="vehicule.kilometrage" class="form-control"
                        :class="{ 'is-invalid': errors.kilometrage }" required />
                    <div v-if="errors.kilometrage" class="invalid-feedback">
                        {{ errors.kilometrage }}
                    </div>
                </div>

                <!-- Statut -->
                <div class="mb-3">
                    <label for="statut" class="form-label">Statut</label>
                    <select id="statut" v-model="vehicule.statut" class="form-select"
                        :class="{ 'is-invalid': errors.statut }" required>
                        <option value="">-- Sélectionner --</option>
                        <option value="Disponible">Disponible</option>
                        <option value="Indisponible">Indisponible</option>
                    </select>
                    <div v-if="errors.statut" class="invalid-feedback">
                        {{ errors.statut }}
                    </div>
                </div>

                <!-- Boutons -->
                <div class="d-flex justify-content-center">
                    <button type="submit" class="btn btn-primary btn-equal-width" :disabled="isLoading">
                        <span v-if="isLoading">Modification...</span>
                        <span v-else>Modifier</span>
                    </button>
                    <router-link :to="{ name: 'listVehicule' }" class="btn btn-secondary btn-equal-width ms-3">Annuler</router-link>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useVehiculeStore } from "@/store/vehiculeStore";
import { useToast } from "vue-toastification";

const router = useRouter();
const route = useRoute();
const toast = useToast();
const vehiculeStore = useVehiculeStore();

const vehicule = ref({});
const errors = ref({});
const isLoading = computed(() => vehiculeStore.isLoading);

const validateForm = () => {
    errors.value = {};

    if (!vehicule.value.modele) {
        errors.value.modele = "Le modèle est requis.";
    }
    if (!vehicule.value.marque) {
        errors.value.marque = "La marque est requise.";
    }
    if (!vehicule.value.annee_de_fabrication) {
        errors.value.annee_de_fabrication = "L'année de fabrication est requise.";
    }
    if (!vehicule.value.immatriculation) {
        errors.value.immatriculation = "L'immatriculation est requise.";
    }
    if (!vehicule.value.type_de_carburant) {
        errors.value.type_de_carburant = "Le type de carburant est requis.";
    }
    if (!vehicule.value.kilometrage) {
        errors.value.kilometrage = "Le kilométrage est requis.";
    }
    if (!vehicule.value.statut) {
        errors.value.statut = "Le statut est requis.";
    }

    return Object.keys(errors.value).length === 0;
};

const modifierVehicule = async () => {
    if (!validateForm()) return;

    try {
        await vehiculeStore.modifierVehicule({
            ...vehicule.value,
        });
        toast.success("Véhicule modifié avec succès !");
        router.push({ name: "listVehicule" });
    } catch (error) {
        toast.error("Erreur lors de la modification du véhicule.");
    }
};

onMounted(async () => {
    const vehiculeId = route.params.id;
    const fetchedVehicule = await vehiculeStore.getVehiculeById(vehiculeId);

    if (fetchedVehicule && fetchedVehicule.annee_de_fabrication) {
        fetchedVehicule.annee_de_fabrication = typeof fetchedVehicule.annee_de_fabrication === "number"
            ? fetchedVehicule.annee_de_fabrication
            : Number(fetchedVehicule.annee_de_fabrication);
    }

    vehicule.value = { ...fetchedVehicule };
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

button,
.router-link {
    min-width: 120px;
}

.btn-equal-width {
    width: 150px;
    text-align: center;
}
</style>
