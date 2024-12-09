import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";

const BASE_URL = "http://localhost:3005";

export const useVehiculeStore = defineStore("VehiculeStore", () => {
    // États
    const vehicules = ref([]);
    const vehiculeSelectionne = ref(null);
    const erreur = ref(null);
    const isLoading = ref(false);

    // Getters
    const vehiculesCount = computed(() => vehicules.value.length);

    // Gestion des erreurs
    const handleError = (err, customMessage) => {
        console.error(customMessage, err.message);
        erreur.value = err.response?.data?.message || customMessage;
        return { success: false, error: err };
    };

    // Actions
    const chargerVehicules = async () => {
        isLoading.value = true;
        erreur.value = null;
        try {
            const response = await axios.get(`${BASE_URL}/All/vehicules`);
            vehicules.value = response.data.vehicules || [];
        } catch (err) {
            handleError(err, "Erreur lors du chargement des véhicules.");
        } finally {
            isLoading.value = false;
        }
    };
    

    const getVehiculeById = async (id) => {
        isLoading.value = true;
        erreur.value = null;
        try {
            const response = await axios.get(`${BASE_URL}/vehicule/${id}`);
            vehiculeSelectionne.value = response.data.vehicule || response.data;
            return vehiculeSelectionne.value;
        } catch (err) {
            return handleError(err, "Erreur lors de la récupération du véhicule.");
        } finally {
            isLoading.value = false;
        }
    };

    const ajouterVehicule = async (nouveauVehicule) => {
        isLoading.value = true;
        erreur.value = null;
        try {
            const response = await axios.post(`${BASE_URL}/vehicule`, nouveauVehicule);
            const vehiculeAjoute = response.data.vehicule || response.data;
            vehicules.value.push(vehiculeAjoute);
            return { success: true, vehicule: vehiculeAjoute };
        } catch (err) {
            if (err.response?.data?.erreurs) {
                // Gestion des erreurs spécifiques au validateur (express-validator)
                return {
                    success: false,
                    validationErrors: err.response.data.erreurs, // Renvoie les erreurs sous forme de tableau
                };
            }
            return handleError(err, "Erreur lors de l'ajout du véhicule.");
        } finally {
            isLoading.value = false;
        }
    };

    const modifierVehicule = async (vehiculeModifie) => {
        isLoading.value = true;
        erreur.value = null;
        try {
            const response = await axios.put(`${BASE_URL}/vehicule/${vehiculeModifie.id}`, vehiculeModifie);
            const updatedVehicule = response.data.vehicule || response.data;
            const index = vehicules.value.findIndex((veh) => veh.id === updatedVehicule.id);
            if (index !== -1) {
                vehicules.value[index] = updatedVehicule;
            } else {
                throw new Error("Véhicule non trouvé dans la liste locale.");
            }
        } catch (err) {
            return handleError(err, "Erreur lors de la modification du véhicule.");
        } finally {
            isLoading.value = false;
        }
    };

    const supprimerVehicule = async (id) => {
        isLoading.value = true;
        erreur.value = null;
        try {
            await axios.delete(`${BASE_URL}/vehicule/${id}`);
            vehicules.value = vehicules.value.filter((veh) => veh.id !== id);
        } catch (err) {
            handleError(err, "Erreur lors de la suppression du véhicule.");
        } finally {
            isLoading.value = false;
        }
    };

    return {
        vehicules,
        vehiculeSelectionne,
        erreur,
        isLoading,
        vehiculesCount,
        chargerVehicules,
        getVehiculeById,
        ajouterVehicule,
        modifierVehicule,
        supprimerVehicule,
    };
});
