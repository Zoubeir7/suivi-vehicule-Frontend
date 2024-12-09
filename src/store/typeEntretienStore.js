import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";

const BASE_URL = "http://localhost:3005";

export const useTypeEntretienStore = defineStore("TypeEntretienStore", () => {
  // State
  const typesEntretien = ref([]);
  const erreur = ref(null);
  const isLoading = ref(false);

  // Computed
  const typesCount = computed(() => typesEntretien.value.length);

  // Helper pour gérer les erreurs
  const handleError = (err, customMessage) => {
    console.error(customMessage, err.message);
    erreur.value = err.response?.data?.message || customMessage;
    return { success: false, error: erreur.value };
  };

  // Actions

  // Récupérer tous les types d'entretien
  const fetchTypesEntretien = async () => {
    isLoading.value = true;
    erreur.value = null;

    try {
      const response = await axios.get(`${BASE_URL}/All/type-entretiens`);
      typesEntretien.value = response.data.typesEntretien || [];
      return { success: true };
    } catch (err) {
      return handleError(err, "Impossible de récupérer les types d'entretien.");
    } finally {
      isLoading.value = false;
    }
  };

  // Récupérer un type d'entretien par ID
  const getTypeEntretienById = async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/type-entretien/${id}`);
      return { success: true, data: response.data };
    } catch (err) {
      return handleError(err, "Impossible de récupérer le type d'entretien.");
    }
  };

  // Ajouter un nouveau type d'entretien
  const ajouterTypeEntretien = async (nouveauType) => {
    isLoading.value = true;
    erreur.value = null;

    try {
      const response = await axios.post(`${BASE_URL}/type-entretien`, nouveauType);
      typesEntretien.value.push(response.data.data);
      return { success: true };
    } catch (err) {
      return handleError(err, "Impossible d'ajouter le type d'entretien.");
    } finally {
      isLoading.value = false;
    }
  };

  // Mettre à jour un type d'entretien existant
  const updateTypeEntretien = async (id, updatedType) => {
    isLoading.value = true;
    erreur.value = null;

    try {
      const response = await axios.put(`${BASE_URL}/type-entretien/${id}`, updatedType);
      const index = typesEntretien.value.findIndex((type) => type.id === id);
      if (index !== -1) {
        typesEntretien.value[index] = response.data; // Mise à jour locale
      }
      return { success: true };
    } catch (err) {
      return handleError(err, "Impossible de modifier le type d'entretien.");
    } finally {
      isLoading.value = false;
    }
  };

  // Supprimer un type d'entretien
  const deleteTypeEntretien = async (id) => {
    isLoading.value = true;
    erreur.value = null;

    try {
      await axios.delete(`${BASE_URL}/type-entretien/${id}`);
      typesEntretien.value = typesEntretien.value.filter((type) => type.id !== id);
      return { success: true };
    } catch (err) {
      return handleError(err, "Impossible de supprimer le type d'entretien.");
    } finally {
      isLoading.value = false;
    }
  };

  // Retourner les propriétés et méthodes
  return {
    typesEntretien,
    erreur,
    isLoading,
    typesCount,
    fetchTypesEntretien,
    getTypeEntretienById,
    ajouterTypeEntretien,
    updateTypeEntretien,
    deleteTypeEntretien,
  };
});
