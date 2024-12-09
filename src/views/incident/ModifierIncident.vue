<template>
  <div class="container mt-5">
    <div class="col-md-8 mx-auto">
      <h1 class="h4 text-primary mb-4 text-center">Modifier un Incident</h1>
      <form @submit.prevent="validateAndSubmit">
        <!-- Date de l'Incident -->
        <div class="mb-3">
          <label for="date_incident" class="form-label">Date de l'Incident</label>
          <input
            type="date"
            class="form-control"
            id="date_incident"
            v-model="incident.date_incident"
            :class="{ 'is-invalid': errors.date_incident }"
            required
          />
          <small v-if="errors.date_incident" class="text-danger">{{ errors.date_incident }}</small>
        </div>

        <!-- Description -->
        <div class="mb-3">
          <label for="description" class="form-label">Description</label>
          <textarea
            class="form-control"
            id="description"
            v-model="incident.description"
            :class="{ 'is-invalid': errors.description }"
            required
          ></textarea>
          <small v-if="errors.description" class="text-danger">{{ errors.description }}</small>
        </div>

        <!-- Gravité -->
        <div class="mb-3">
          <label for="gravite" class="form-label">Gravité</label>
          <select
            class="form-select"
            id="gravite"
            v-model="incident.gravite"
            :class="{ 'is-invalid': errors.gravite }"
            required
          >
            <option value="">-- Sélectionner --</option>
            <option value="mineure">Mineure</option>
            <option value="critique">Critique</option>
            <option value="majeure">Majeure</option>
          </select>
          <small v-if="errors.gravite" class="text-danger">{{ errors.gravite }}</small>
        </div>

        <!-- Entretien Requis -->
        <div class="mb-3">
          <label for="entretien_requis" class="form-label">Entretien Requis</label>
          <div>
            <input type="checkbox" id="entretien_requis" v-model="incident.entretien_requis" />
            <label for="entretien_requis" class="ms-2">Oui</label>
          </div>
        </div>

        <!-- Statut -->
        <div class="mb-3">
          <label for="statut" class="form-label">Statut</label>
          <select
            class="form-select"
            id="statut"
            v-model="incident.statut"
            :class="{ 'is-invalid': errors.statut }"
            required
          >
            <option value="">-- Sélectionner --</option>
            <option value="ouvert">Ouvert</option>
            <option value="en cours">En cours</option>
            <option value="fermé">Fermé</option>
          </select>
          <small v-if="errors.statut" class="text-danger">{{ errors.statut }}</small>
        </div>

        <!-- Véhicule -->
        <div class="mb-3">
          <label for="vehicule" class="form-label">Véhicule</label>
          <select
            class="form-select"
            id="vehicule"
            v-model="incident.vehiculeId"
            :class="{ 'is-invalid': errors.vehiculeId }"
            required
          >
            <option value="">-- Sélectionner --</option>
            <option v-for="vehicule in vehicules" :key="vehicule.id" :value="vehicule.id">
              {{ vehicule.marque }} - {{ vehicule.modele }}
            </option>
          </select>
          <small v-if="errors.vehiculeId" class="text-danger">{{ errors.vehiculeId }}</small>
        </div>

        <!-- Boutons -->
        <div class="d-flex justify-content-center">
          <button type="submit" class="btn btn-primary btn-equal-width" :disabled="isLoading">
            <span v-if="isLoading">Modification...</span>
            <span v-else>Modifier</span>
          </button>
          <button type="button" class="btn btn-secondary btn-equal-width ms-3" @click="cancel">
            Annuler
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useIncidentStore } from "@/store/incidentStore";
import { useVehiculeStore } from "@/store/vehiculeStore";
import { useToast } from "vue-toastification";

const router = useRouter();
const route = useRoute();
const incidentStore = useIncidentStore();
const vehiculeStore = useVehiculeStore();
const toast = useToast();

const incident = ref({
  date_incident: "",
  description: "",
  gravite: "",
  entretien_requis: false,
  statut: "",
  vehiculeId: null,
});

const vehicules = ref([]);
const errors = ref({});
const isLoading = computed(() => incidentStore.isLoading);

const validateForm = () => {
  errors.value = {};

  // Vérifier la date de l'incident
  const today = new Date().toISOString().split("T")[0];
  if (!incident.value.date_incident) {
    errors.value.date_incident = "La date de l'incident est requise.";
  } else if (incident.value.date_incident < today) {
    errors.value.date_incident = "La date de l'incident ne peut pas être antérieure à aujourd'hui.";
  }

  // Vérifier la description
  if (!incident.value.description.trim()) {
    errors.value.description = "La description ne peut pas être vide ou contenir uniquement des espaces.";
  }

  // Vérifier la gravité
  if (!incident.value.gravite) {
    errors.value.gravite = "La gravité est requise.";
  }

  // Vérifier le véhicule
  if (!incident.value.vehiculeId) {
    errors.value.vehiculeId = "Veuillez sélectionner un véhicule.";
  }

  // Vérifier le statut
  if (!incident.value.statut) {
    errors.value.statut = "Le statut est requis.";
  }

  return Object.keys(errors.value).length === 0;
};

onMounted(async () => {
  const incidentId = route.params.id;

  try {
    const fetchedIncident = await incidentStore.getIncidentById(incidentId);
    if (fetchedIncident) {
      incident.value = {
        ...fetchedIncident,
        date_incident: new Date(fetchedIncident.date_incident).toISOString().split("T")[0],
      };
    }
    await vehiculeStore.chargerVehicules();
    vehicules.value = vehiculeStore.vehicules;
  } catch (error) {
    toast.error("Erreur lors du chargement des données.");
    router.push({ name: "listIncident" });
  }
});

const validateAndSubmit = async () => {
  if (!validateForm()) return;

  try {
    await incidentStore.modifierIncident(route.params.id, {
      ...incident.value,
      vehiculeId: parseInt(incident.value.vehiculeId, 10),
    });
    toast.success("Incident mis à jour avec succès !");
    router.push({ name: "listIncident" });
  } catch (error) {
    toast.error("Erreur lors de la mise à jour de l'incident.");
  }
};

const cancel = () => {
  router.push({ name: "listIncident" });
};
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

.btn-equal-width {
  width: 150px;
  text-align: center;
}

.mb-3 {
  margin-bottom: 1rem;
}

.form-label {
  font-weight: bold;
}

.text-center {
  text-align: center;
}

h1 {
  font-size: 1.5rem;
}
</style>
