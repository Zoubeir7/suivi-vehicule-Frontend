import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";

export const useUserStore = defineStore("UserStore", () => {
  const utilisateurs = ref([]); 
  const utilisateurSelectionne = ref(null); 
  const erreur = ref(null); 
  const isLoading = ref(false); 

  const utilisateursCount = computed(() => utilisateurs.value.length); 

  const chargerUtilisateurs = async () => {
    isLoading.value = true;
    erreur.value = null;

    try {
      const response = await axios.get("http://localhost:3005/");
      utilisateurs.value = response.data.utilisateurs || []; 
    } catch (err) {
      console.error("Erreur lors du chargement des utilisateurs :", err.message);
      erreur.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };

  const getUtilisateurById = async (id) => {
    isLoading.value = true;
    erreur.value = null;

    try {
      if (!id || isNaN(Number(id))) {
        throw new Error("L'ID fourni n'est pas un nombre valide.");
      }

      console.log(`Tentative de récupération de l'utilisateur avec l'ID : ${id}`);
      const response = await axios.get(`http://localhost:3005/${Number(id)}`);
      console.log("Réponse de l'API :", response.data);

      if (response.data) {
        utilisateurSelectionne.value = response.data.utilisateur || response.data;
      } else {
        throw new Error("Utilisateur introuvable dans la réponse de l'API.");
      }

      return utilisateurSelectionne.value;
    } catch (err) {
      console.error("Erreur lors de la récupération de l'utilisateur :", err.message);
      erreur.value = err.response?.data?.message || "Une erreur est survenue.";
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  // Modifier un utilisateur
  const modifierUtilisateur = async (utilisateurModifie) => {
    isLoading.value = true;
    erreur.value = null;

    try {
        const response = await axios.put(
            `http://localhost:3005/${utilisateurModifie.id}`,
            utilisateurModifie
        );
        const index = utilisateurs.value.findIndex((user) => user.id === utilisateurModifie.id);
        if (index !== -1) {
            utilisateurs.value[index] = response.data.utilisateur || response.data;
        }
    } catch (err) {
        console.error("Erreur lors de la modification de l'utilisateur :", err.message);
        erreur.value = err.response?.data?.message || "Une erreur est survenue.";
        throw err;
    } finally {
        isLoading.value = false;
    }
};

  // Supprimer un utilisateur
  const supprimerUtilisateur = async (id) => {
    isLoading.value = true;
    erreur.value = null;

    try {
      const response = await axios.delete(`http://localhost:3005/${id}`);
      const index = utilisateurs.value.findIndex((user) => user.id === id);
      if (index !== -1) {
        utilisateurs.value.splice(index, 1); // Supprimer de la liste locale
      }
      return response.data; // Retourner la réponse de l'API
    } catch (err) {
      console.error("Erreur lors de la suppression de l'utilisateur :", err.message);
      erreur.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };
// Ajouter un utilisateur
const ajouterUtilisateur = async (nouvelUtilisateur) => {
  isLoading.value = true;
  erreur.value = null;

  try {
    const response = await axios.post("http://localhost:3005/", nouvelUtilisateur);

    utilisateurs.value.push(response.data.utilisateur || response.data);
  } catch (err) {
    console.error("Erreur lors de l'ajout de l'utilisateur :", err.message);
    erreur.value = err.response?.data?.message || "Une erreur est survenue.";
    throw err; 
  } finally {
    isLoading.value = false;
  }
};

  return {
    utilisateurs,
    utilisateurSelectionne,
    erreur,
    isLoading,
    utilisateursCount,
    chargerUtilisateurs,
    getUtilisateurById,
    modifierUtilisateur,
    supprimerUtilisateur,
    ajouterUtilisateur 
  };
});
