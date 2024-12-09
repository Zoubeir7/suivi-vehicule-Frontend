<template>
    <div class="container mt-5">
        <div class="col-md-8 mx-auto">
            <h1 class="h4 text-primary mb-4 text-center">Détails du Document</h1>
            <form>
                <!-- Nom -->
                <div class="mb-3">
                    <label for="nom" class="form-label">Nom</label>
                    <input type="text" class="form-control" id="nom" v-model="document.nom" disabled />
                </div>

                <!-- Début Validité -->
                <div class="mb-3">
                    <label for="debut_validite" class="form-label">Début Validité</label>
                    <input type="text" class="form-control" id="debut_validite" v-model="document.debut_validite" disabled />
                </div>

                <!-- Fin Validité -->
                <div class="mb-3">
                    <label for="fin_validite" class="form-label">Fin Validité</label>
                    <input type="text" class="form-control" id="fin_validite" v-model="document.fin_validite" disabled />
                </div>

                <!-- Coût -->
                <div class="mb-3">
                    <label for="cout" class="form-label">Coût</label>
                    <input type="text" class="form-control" id="cout" :value="cout" disabled />
                </div>

                <!-- Renouvellement -->
                <div class="mb-3">
                    <label for="renouvellement" class="form-label">Renouvellement</label>
                    <input type="text" class="form-control" id="renouvellement" v-model="document.renouvellement" disabled />
                </div>

                <!-- Utilisateur -->
                <div class="mb-3">
                    <label for="utilisateur" class="form-label">Utilisateur</label>
                    <input type="text" class="form-control" id="utilisateur" :value="utilisateur" disabled />
                </div>

                <!-- Véhicule -->
                <div class="mb-3">
                    <label for="vehicule" class="form-label">Véhicule</label>
                    <input type="text" class="form-control" id="vehicule" :value="vehicule" disabled />
                </div>

                <!-- Retour à la liste -->
                <div class="d-flex justify-content-center">
                    <button type="button" class="btn btn-primary" @click="goBack">
                        Retour à la liste
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useDocumentStore } from "@/store/docStore";
import { useAuthStore } from "@/store/authStore";

const router = useRouter();
const route = useRoute();
const documentStore = useDocumentStore();
const authStore = useAuthStore();

const document = ref({
    nom: "",
    debut_validite: "",
    fin_validite: "",
    cout: "",
    renouvellement: "",
    utilisateur: "",
    vehicule: "",
});

const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');

// Données calculées pour afficher les informations utilisateur et véhicule
const utilisateur = computed(() => `${authStore.userName || "Prénom inconnu"} ${authStore.userNameG || "Nom inconnu"}`);
const vehicule = computed(() => `${document.value.vehicule.marque} ${document.value.vehicule.modele}`);

// Formatage du coût en MRU avec conversion en décimal
const cout = computed(() => {
    return document.value.cout
        ? `${parseFloat(document.value.cout).toFixed(2)} MRU` // Conversion en décimal avec 2 décimales
        : "Coût non défini";
});

onMounted(async () => {
    const documentId = route.params.id;

    if (isNaN(documentId) || documentId <= 0) {
        showModal.value = true;
        modalTitle.value = 'Erreur';
        modalMessage.value = "ID du document invalide.";
        return router.push({ name: "listDocument" });
    }

    try {
        // Récupérer les données du document
        let documentData = documentStore.documents.find((doc) => doc.id === parseInt(documentId));
        if (!documentData) {
            documentData = await documentStore.fetchDocumentById(documentId);
        }
        if (documentData) {
            document.value = documentData;
        } else {
            showModal.value = true;
            modalTitle.value = 'Erreur';
            modalMessage.value = "Document introuvable.";
            router.push({ name: "listDocument" });
        }
    } catch (err) {
        console.error("Erreur :", err);
        showModal.value = true;
        modalTitle.value = 'Erreur';
        modalMessage.value = "Une erreur est survenue lors de la récupération du document.";
        router.push({ name: "listDocument" });
    }
});

const goBack = () => {
    router.push({ name: "listDocument" });
};

const closeModal = () => {
    showModal.value = false;
};
</script>

<style scoped>
.container {
    max-width: 800px;
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
