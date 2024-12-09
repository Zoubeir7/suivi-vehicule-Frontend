import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";

export const useDocumentStore = defineStore("DocumentStore", () => {
  // État
  const documents = ref([]);
  const selectedDocument = ref(null);
  const error = ref(null);
  const isLoading = ref(false);

  const documentsCount = computed(() => documents.value.length);

  // Formatage du cout
  const formatCout = (cout) => {
    const coutNumber = typeof cout === "string" ? parseFloat(cout) : cout;
    return !isNaN(coutNumber) ? coutNumber : null;
  };

  // Récupérer tous les documents
  const fetchDocuments = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await axios.get("http://localhost:3005/All/documents");
      documents.value = response.data.documents?.map(doc => ({
        ...doc,
        cout: formatCout(doc.cout),  // Appliquer le formatage du cout
      })) || [];
    } catch (err) {
      handleError(err, "Erreur lors de la récupération des documents.");
    } finally {
      isLoading.value = false;
    }
  };

  // Récupérer un document par ID
  const fetchDocumentById = async (id) => {
    isLoading.value = true;
    error.value = null;

    try {
      if (!id || isNaN(Number(id))) {
        throw new Error("L'ID fourni n'est pas un nombre valide.");
      }
      const response = await axios.get(`http://localhost:3005/documents/${id}`);
      selectedDocument.value = response.data.document || response.data;
    } catch (err) {
      handleError(err, "Erreur lors de la récupération du document.");
    } finally {
      isLoading.value = false;
    }
  };

  // Créer un document
  const createDocument = async (data) => {
    isLoading.value = true;
    error.value = null;

    try {
      const documentData = {
        ...data,
        vehiculeId: Number(data.vehiculeId),
        cout: formatCout(data.cout),  // Appliquer le formatage du cout
      };

      const response = await axios.post("http://localhost:3005/document", documentData);
      documents.value.push(response.data.document || response.data);
    } catch (err) {
      handleError(err, "Erreur lors de la création du document.");
    } finally {
      isLoading.value = false;
    }
  };

  // Mettre à jour un document
  const updateDocument = async (id, data) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await axios.put(`http://localhost:3005/document/${id}`, {
        ...data,
        cout: formatCout(data.cout),  // Appliquer le formatage du cout
      });
      const index = documents.value.findIndex((doc) => doc.id === id);
      if (index !== -1) {
        documents.value[index] = response.data.document || response.data;
      }
    } catch (err) {
      handleError(err, "Erreur lors de la mise à jour du document.");
    } finally {
      isLoading.value = false;
    }
  };

  // Supprimer un document
  const deleteDocument = async (id) => {
    isLoading.value = true;
    error.value = null;

    try {
      await axios.delete(`http://localhost:3005/document/${id}`);
      documents.value = documents.value.filter((doc) => doc.id !== id);
    } catch (err) {
      handleError(err, "Erreur lors de la suppression du document.");
    } finally {
      isLoading.value = false;
    }
  };

  // Gestion des erreurs
  const handleError = (err, message) => {
    console.error(err);
    if (err.response) {
      error.value = `${message} - ${err.response.status}: ${err.response.data.message || err.response.statusText}`;
    } else if (err.request) {
      error.value = `${message} - Pas de réponse du serveur.`;
    } else {
      error.value = `${message} - ${err.message}`;
    }
  };

  return {
    documents,
    selectedDocument,
    error,
    isLoading,
    documentsCount,
    fetchDocuments,
    fetchDocumentById,
    createDocument,
    updateDocument,
    deleteDocument,
  };
});
