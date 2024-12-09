import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";

const BASE_URL = "http://localhost:3005";

export const useIncidentStore = defineStore("incidentStore", () => {
  const incidents = ref([]);
  const incidentSelectionne = ref(null);
  const erreur = ref(null);
  const isLoading = ref(false);

  const incidentsCount = computed(() => incidents.value.length);

  const handleError = (err, customMessage) => {
    console.error(customMessage, err.message);
    erreur.value = err.response?.data?.message || customMessage;
    return { success: false, error: err };
  };

  const fetchIncidents = async () => {
    isLoading.value = true;
    erreur.value = null;
    try {
      const response = await axios.get(`${BASE_URL}/All/incidents`);
      incidents.value = response.data.incidents || [];
    } catch (err) {
      handleError(err, "Erreur lors du chargement des incidents.");
    } finally {
      isLoading.value = false;
    }
  };

  const getIncidentById = async (id) => {
    isLoading.value = true;
    erreur.value = null;
    try {
      const response = await axios.get(`${BASE_URL}/incidents/${id}`);
      incidentSelectionne.value = response.data.incident || response.data;
      return incidentSelectionne.value;
    } catch (err) {
      return handleError(err, "Erreur lors de la récupération de l'incident.");
    } finally {
      isLoading.value = false;
    }
  };

  const ajouterIncident = async (nouvelIncident) => {
    isLoading.value = true;
    erreur.value = null;
    try {
      const response = await axios.post(`${BASE_URL}/incident`, nouvelIncident);
      const incidentAjoute = response.data.incident || response.data;
      incidents.value.push(incidentAjoute);
      return { success: true, incident: incidentAjoute };
    } catch (err) {
      return handleError(err, "Erreur lors de l'ajout de l'incident.");
    } finally {
      isLoading.value = false;
    }
  };

  const modifierIncident = async (id, updatedFields) => {
    isLoading.value = true;
    erreur.value = null;
    try {
      const response = await axios.put(`${BASE_URL}/incident/${id}`, updatedFields);
      return { success: true, incident: response.data };
    } catch (err) {
      return handleError(err, "Erreur lors de la modification de l'incident.");
    } finally {
      isLoading.value = false;
    }
  };
  

  const supprimerIncident = async (id) => {
    try {
      // Appel à l'API pour supprimer l'incident
      await axios.delete(`${BASE_URL}/incident/${id}`);
      // Suppression locale
      incidents.value = incidents.value.filter((incident) => incident.id !== id);
      return { success: true };
    } catch (err) {
      return handleError(err, "Erreur lors de la suppression de l'incident.");
    }
  };
  

  return {
    incidents,
    incidentSelectionne,
    erreur,
    isLoading,
    incidentsCount,
    fetchIncidents,
    getIncidentById,
    ajouterIncident,
    modifierIncident,
    supprimerIncident,
  };
});
