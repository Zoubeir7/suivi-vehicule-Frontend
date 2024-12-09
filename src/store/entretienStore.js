import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";

const BASE_URL = "http://localhost:3005";

export const useEntretienStore = defineStore("EntretienStore", () => {
  const entretiens = ref([]);
  const entretienSelectionne = ref(null);
  const erreur = ref(null);
  const isLoading = ref(false);

  const entretiensCount = computed(() => entretiens.value.length);

  const formatCout = (cout) => {
    const coutNumber = typeof cout === "string" ? parseFloat(cout) : cout;
    return !isNaN(coutNumber) ? coutNumber : null;
  };

  const handleError = (err, customMessage) => {
    console.error(customMessage, err.message);
    erreur.value = err.response?.data?.message || customMessage;
    return { success: false, error: err };
  };

  const fetchEntretiens = async () => {
    isLoading.value = true;
    erreur.value = null;
    try {
      const response = await axios.get(`${BASE_URL}/All/entretiens`);
      entretiens.value =
        response.data.entretiens?.map((entretien) => ({
          ...entretien,
          cout: formatCout(entretien.cout),
        })) || [];
    } catch (err) {
      handleError(err, "Erreur lors du chargement des entretiens.");
    } finally {
      isLoading.value = false;
    }
  };

  const getEntretienById = async (id) => {
    isLoading.value = true;
    erreur.value = null;
    try {
      const response = await axios.get(`${BASE_URL}/entretien/${id}`);
      entretienSelectionne.value = response.data.entretien || response.data;
      entretienSelectionne.value.cout = formatCout(entretienSelectionne.value.cout);
      return entretienSelectionne.value;
    } catch (err) {
      return handleError(err, "Erreur lors de la récupération de l'entretien.");
    } finally {
      isLoading.value = false;
    }
  };

  const ajouterEntretien = async (nouvelEntretien) => {
    isLoading.value = true;
    erreur.value = null;
    try {
      const entretienData = {
        ...nouvelEntretien,
        cout: formatCout(nouvelEntretien.cout),
      };
      const response = await axios.post(`${BASE_URL}/entretien`, entretienData);
      const entretienAjoute = response.data.entretien || response.data;
      entretiens.value.push(entretienAjoute);
      return { success: true, entretien: entretienAjoute };
    } catch (err) {
      if (err.response?.data?.erreurs) {
        return {
          success: false,
          validationErrors: err.response.data.erreurs,
        };
      }
      return handleError(err, "Erreur lors de l'ajout de l'entretien.");
    } finally {
      isLoading.value = false;
    }
  };

  const modifierEntretien = async (id, updatedFields) => {
    isLoading.value = true;
    erreur.value = null;
    try {
      const response = await axios.put(`${BASE_URL}/entretien/${id}`, updatedFields);
      const entretienMisAJour = response.data.entretien || response.data;

      const index = entretiens.value.findIndex((ent) => ent.id === id);
      if (index !== -1) {
        entretiens.value[index] = { ...entretiens.value[index], ...entretienMisAJour };
      }

      return { success: true, entretien: entretienMisAJour };
    } catch (err) {
      if (err.response?.status === 422) {
        return {
          success: false,
          validationErrors: err.response.data.erreurs || {},
        };
      }
      return handleError(err, "Erreur lors de la modification de l'entretien.");
    } finally {
      isLoading.value = false;
    }
  };

  const supprimerEntretien = async (id) => {
    isLoading.value = true;
    erreur.value = null;
    try {
      await axios.delete(`${BASE_URL}/entretien/${id}`);
      entretiens.value = entretiens.value.filter((ent) => ent.id !== id);
      return { success: true };
    } catch (err) {
      return handleError(err, "Erreur lors de la suppression de l'entretien.");
    } finally {
      isLoading.value = false;
    }
  };

  return {
    entretiens,
    entretienSelectionne,
    erreur,
    isLoading,
    entretiensCount,
    fetchEntretiens,
    getEntretienById,
    ajouterEntretien,
    modifierEntretien,
    supprimerEntretien,
  };
});
