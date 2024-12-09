<template>
  <div class="container mt-1">
    <div class="col-md-8 mx-auto">
      <h1 class="h4 text-primary mb-4 text-center">Ajouter un Incident</h1>
      <form @submit.prevent="ajouterIncident">
        <!-- Date de l'incident -->
        <div class="mb-3">
          <label for="dateIncident" class="form-label">Date de l'incident</label>
          <input type="date" id="dateIncident"
            :value="nouvelIncident.date_incident ? formatToDateInput(nouvelIncident.date_incident) : ''"
            @input="nouvelIncident.date_incident = $event.target.value" class="form-control"
            :class="{ 'is-invalid': errors.date_incident }" required />
          <div v-if="errors.date_incident" class="invalid-feedback">
            {{ errors.date_incident }}
          </div>
        </div>

        <!-- Description -->
        <div class="mb-3">
          <label for="description" class="form-label">Description</label>
          <textarea id="description" v-model="nouvelIncident.description" class="form-control" rows="3"
            :class="{ 'is-invalid': errors.description }" required
            placeholder="Entrez la description de l'incident"></textarea>
          <div v-if="errors.description" class="invalid-feedback">
            {{ errors.description }}
          </div>
        </div>

        <!-- Gravité -->
        <div class="mb-3">
          <label for="gravite" class="form-label">Gravité</label>
          <select id="gravite" v-model="nouvelIncident.gravite" class="form-select"
            :class="{ 'is-invalid': errors.gravite }" required>
            <option value="">-- Sélectionner --</option>
            <option value="mineure">Mineure</option>
            <option value="majeure">Majeure</option>
            <option value="critique">Critique</option>
          </select>
          <div v-if="errors.gravite" class="invalid-feedback">
            {{ errors.gravite }}
          </div>
        </div>

        <!-- Entretien requis -->
        <div class="mb-3 form-check">
          <input type="checkbox" id="entretienRequis" v-model="nouvelIncident.entretien_requis"
            class="form-check-input" />
          <label for="entretienRequis" class="form-check-label">Entretien requis</label>
        </div>

        <!-- Statut -->
        <div class="mb-3">
          <label for="statut" class="form-label">Statut</label>
          <select id="statut" v-model="nouvelIncident.statut" class="form-select"
            :class="{ 'is-invalid': errors.statut }" required>
            <option value="">-- Sélectionner --</option>
            <option value="ouvert">Ouvert</option>
            <option value="en cours">En cours</option>
            <option value="fermé">Fermé</option>
          </select>
          <div v-if="errors.statut" class="invalid-feedback">
            {{ errors.statut }}
          </div>
        </div>

        <!-- Véhicule -->
        <div class="mb-3">
          <label for="vehicule" class="form-label">Véhicule</label>
          <select id="vehicule" v-model="nouvelIncident.vehiculeId" class="form-select"
            :class="{ 'is-invalid': errors.vehiculeId }" required>
            <option value="">-- Sélectionner --</option>
            <option v-for="vehicule in vehicules" :key="vehicule.id" :value="vehicule.id">
              {{ vehicule.marque }} - {{ vehicule.modele }}
            </option>
          </select>
          <div v-if="errors.vehiculeId" class="invalid-feedback">
            {{ errors.vehiculeId }}
          </div>
        </div>

        <!-- Boutons -->
        <div class="d-flex justify-content-center">
          <button type="submit" class="btn btn-primary" :disabled="isLoading">
            <span v-if="isLoading">Ajout...</span>
            <span v-else>Ajouter</span>
          </button>
          <button type="button" class="btn btn-secondary ms-3" @click="annuler" :disabled="isLoading">
            Annuler
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useIncidentStore } from "@/store/incidentStore";
import { useVehiculeStore } from "@/store/vehiculeStore";
import { useToast } from "vue-toastification";

const router = useRouter();
const toast = useToast();
const incidentStore = useIncidentStore();
const vehiculeStore = useVehiculeStore();

const nouvelIncident = ref({
  date_incident: "",
  description: "",
  gravite: "",
  entretien_requis: false,
  statut: "",
  vehiculeId: "",
});

const errors = ref({});
const isLoading = computed(() => incidentStore.isLoading);
const vehicules = computed(() => vehiculeStore.vehicules);

const formatToDateInput = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};

const validateForm = () => {
  errors.value = {};

  // Vérifier la date de l'incident
  const today = new Date().toISOString().split("T")[0];
  if (!nouvelIncident.value.date_incident) {
    errors.value.date_incident = "La date de l'incident est requise.";
  } else if (nouvelIncident.value.date_incident < today) {
    errors.value.date_incident = "La date de l'incident ne peut pas être antérieure à aujourd'hui.";
  }

  // Vérifier la description
  if (!nouvelIncident.value.description.trim()) {
    errors.value.description = "La description ne peut pas être vide ou contenir uniquement des espaces.";
  }

  // Vérifier la gravité
  if (!nouvelIncident.value.gravite) {
    errors.value.gravite = "La gravité est requise.";
  }

  // Vérifier le véhicule
  if (!nouvelIncident.value.vehiculeId) {
    errors.value.vehiculeId = "Veuillez sélectionner un véhicule.";
  }

  // Vérifier le statut
  if (!nouvelIncident.value.statut) {
    errors.value.statut = "Le statut est requis.";
  }

  return Object.keys(errors.value).length === 0;
};


const ajouterIncident = async () => {
  if (!validateForm()) return;

  try {
    await incidentStore.ajouterIncident({
      ...nouvelIncident.value,
      vehiculeId: parseInt(nouvelIncident.value.vehiculeId, 10),
    });
    toast.success("Incident ajouté avec succès !");
    router.push({ name: "listIncident" });
  } catch (error) {
    toast.error("Erreur lors de l'ajout de l'incident.");
  }
};

const annuler = () => {
  router.push({ name: "listIncident" });
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

button {
  min-width: 120px;
}
</style>