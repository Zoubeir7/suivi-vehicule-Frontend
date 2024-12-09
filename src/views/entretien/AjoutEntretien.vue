<template>
    <div class="container mt-5">
        <div class="col-md-8 mx-auto">
            <h1 class="h4 text-primary mb-4 text-center">Ajouter un Entretien</h1>
            <form @submit.prevent="submitForm">
                <!-- Date -->
                <div class="mb-3">
                    <label for="date" class="form-label">Date</label>
                    <input type="date" id="date" v-model="formData.date" class="form-control"
                        :class="{ 'is-invalid': errors.date }" required />
                    <div v-if="errors.date" class="invalid-feedback">{{ errors.date }}</div>
                </div>

                <!-- Coût -->
                <div class="mb-3">
                    <label for="cout" class="form-label">Coût</label>
                    <input type="number" id="cout" v-model.number="formData.cout" class="form-control"
                        :class="{ 'is-invalid': errors.cout }" required />
                    <div v-if="errors.cout" class="invalid-feedback">{{ errors.cout }}</div>
                </div>

                <!-- Type d'Entretien -->
                <div class="mb-3">
                    <label for="typeEntretien" class="form-label">Type d'Entretien</label>
                    <select id="typeEntretien" v-model.number="formData.typeEntretienId" class="form-select"
                        :class="{ 'is-invalid': errors.typeEntretienId }" required>
                        <option value="" disabled>Sélectionner un type</option>
                        <option v-for="type in typeEntretienStore.typesEntretien" :key="type.id" :value="type.id">
                            {{ type.nom }}
                        </option>
                    </select>
                    <div v-if="errors.typeEntretienId" class="invalid-feedback">{{ errors.typeEntretienId }}</div>
                </div>

                <!-- Véhicule -->
                <div class="mb-3">
                    <label for="vehicule" class="form-label">Véhicule</label>
                    <select id="vehicule" v-model.number="formData.vehiculeId" class="form-select"
                        :class="{ 'is-invalid': errors.vehiculeId }" required>
                        <option value="" disabled>Sélectionner un véhicule</option>
                        <option v-for="vehicule in vehiculeStore.vehicules" :key="vehicule.id" :value="vehicule.id">
                            {{ vehicule.marque }} - {{ vehicule.modele }}
                        </option>
                    </select>
                    <div v-if="errors.vehiculeId" class="invalid-feedback">{{ errors.vehiculeId }}</div>
                </div>

                <!-- Boutons -->
                <div class="d-flex justify-content-center">
                    <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                        <span v-if="isSubmitting">Ajout...</span>
                        <span v-else>Ajouter</span>
                    </button>
                    <button type="button" class="btn btn-secondary ms-3" @click="cancel">
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useTypeEntretienStore } from '@/store/typeEntretienStore';
import { useVehiculeStore } from '@/store/vehiculeStore';
import { useEntretienStore } from '@/store/entretienStore';

const router = useRouter();
const toast = useToast();

const typeEntretienStore = useTypeEntretienStore();
const vehiculeStore = useVehiculeStore();
const entretienStore = useEntretienStore();

const formData = reactive({
    date: '',
    cout: null,
    typeEntretienId: '',
    vehiculeId: '',
});

const errors = reactive({
    date: '',
    cout: '',
    typeEntretienId: '',
    vehiculeId: '',
});

const isSubmitting = ref(false);

onMounted(async () => {
    try {
        await Promise.all([typeEntretienStore.fetchTypesEntretien(), vehiculeStore.chargerVehicules()]);
    } catch (error) {
        toast.error('Erreur lors du chargement des données.');
    }
});

const validateForm = () => {
    let isValid = true;
    errors.date = !formData.date ? 'La date est obligatoire.' : '';
    errors.cout = formData.cout === null || formData.cout < 0 ? 'Le coût doit être positif.' : '';
    errors.typeEntretienId = !formData.typeEntretienId ? 'Le type d’entretien est obligatoire.' : '';
    errors.vehiculeId = !formData.vehiculeId ? 'Le véhicule est obligatoire.' : '';

    Object.values(errors).forEach((error) => {
        if (error) isValid = false;
    });

    return isValid;
};

const submitForm = async () => {
    if (!validateForm()) return;
    isSubmitting.value = true;

    try {
        const result = await entretienStore.ajouterEntretien(formData);
        if (result.success) {
            toast.success('Entretien ajouté avec succès.');
            router.push('listEntretien');
        } else if (result.validationErrors) {
            toast.error('Veuillez corriger les erreurs.');
            Object.entries(result.validationErrors).forEach(([field, message]) => {
                errors[field] = message;
            });
        }
    } catch (error) {
        toast.error('Erreur lors de l’ajout de l’entretien.');
    } finally {
        isSubmitting.value = false;
    }
};

const cancel = () => {
    router.push('listEntretien');
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
</style>
