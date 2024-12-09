<template>
    <div class="login-background d-flex justify-content-center align-items-center">
        <div class="login-container">
            <img src="/public/favicon.ico" alt="Logo" class="logo" />
            <h2 class="text-center">Connexion</h2>
            <form @submit.prevent="login">
                <!-- Champ Email -->
                <div class="form-group">
                    <label for="email">Adresse email</label>
                    <div class="input-group">
                        <input
                            v-model="email"
                            type="email"
                            id="email"
                            class="form-control input-field"
                            placeholder="Entrez votre adresse email"
                            required
                            :class="{ 'is-invalid': emailError }"
                        />
                    </div>
                    <div v-if="emailError" class="invalid-feedback">Veuillez entrer un email valide.</div>
                </div>

                <!-- Champ Mot de Passe -->
                <div class="form-group">
                    <label for="password">Mot de passe</label>
                    <div class="input-group">
                        <input
                            v-model="password"
                            :type="isPasswordVisible ? 'text' : 'password'"
                            id="password"
                            class="form-control input-field"
                            placeholder="Entrez votre mot de passe"
                            required
                            :class="{ 'is-invalid': passwordError }"
                        />
                        <span class="input-group-text toggle-password" @click="togglePasswordVisibility">
                            <i :class="isPasswordVisible ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
                        </span>
                    </div>
                    <div v-if="passwordError" class="invalid-feedback">Le mot de passe est requis.</div>
                </div>

                <!-- Bouton Se Connecter -->
                <button type="submit" class="login-button btn btn-primary w-100" :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm"></span>
                    Se connecter
                </button>
            </form>
            <div class="text-center mt-3">
                <a href="/forgot-password" class="forgot-password-link">Mot de passe oublié ?</a>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import Swal from 'sweetalert2';

const email = ref('');
const password = ref('');
const isPasswordVisible = ref(false);
const loading = ref(false); // Indicateur de chargement
const emailError = ref(false); // Erreur de validation de l'email
const passwordError = ref(false); // Erreur de validation du mot de passe

const authStore = useAuthStore();
const router = useRouter();

const togglePasswordVisibility = () => {
    isPasswordVisible.value = !isPasswordVisible.value;
};

// Validation basique du formulaire
const validateForm = () => {
    emailError.value = !email.value || !/\S+@\S+\.\S+/.test(email.value);
    passwordError.value = !password.value;
    return !emailError.value && !passwordError.value;
};

const login = async () => {
    if (!validateForm()) return; // Si la validation échoue, on ne fait rien

    loading.value = true; // Démarre le chargement

    try {
        await authStore.login(email.value, password.value);
        Swal.fire({
            title: 'Connexion réussie',
            text: 'Bienvenue sur le tableau de bord !',
            icon: 'success',
            confirmButtonText: 'OK',
        });
        router.push('/home');
    } catch (err) {
        Swal.fire({
            title: 'Erreur de connexion',
            text: err.message || 'Connexion échouée. Veuillez réessayer.',
            icon: 'error',
            confirmButtonText: 'OK',
        });
    } finally {
        loading.value = false; // Arrête le chargement
    }
};
</script>

<style scoped>
.login-background {
    background-color: #f0f8ff;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.login-container {
    width: 100%;
    max-width: 400px;
    padding: 2rem;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

h2 {
    color: #333;
    margin-bottom: 1.5rem;
    font-weight: bold;
}

.form-group {
    margin-bottom: 1.25rem; /* Adds spacing between fields */
    text-align: left;
}

label {
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #555;
}

.input-group {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
}

.input-group-text {
    background-color: #f8f9fa;
    border: 1px solid #ccc;
    padding: 0.5rem 0.75rem;
    border-radius: 0 4px 4px 0;
    color: #555;
    display: flex;
    align-items: center;
    justify-content: center;
}

.input-group input {
    flex: 1;
    padding-right: 2rem; /* Adds space for the icon */
    border-radius: 4px 0 0 4px;
    border-right: 0;
}

input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
}

.input-field {
    height: 48px; /* Uniformise la hauteur des champs de saisie */
}

input.is-invalid {
    border-color: #dc3545;
}

.invalid-feedback {
    color: #dc3545;
    font-size: 0.875rem;
}

.login-button {
    margin-top: 1rem;
}

.logo {
    display: block;
    margin: 0 auto 1rem;
    width: 100px;
    height: 100px;
}

.forgot-password-link {
    color: #007bff;
    text-decoration: none;
    font-size: 0.9rem;
}

.forgot-password-link:hover {
    text-decoration: underline;
}

.toggle-password {
    cursor: pointer;
    color: #555;
}

.toggle-password i {
    display: block;
    width: 24px;
    height: 24px;
}

/* Focus styles for inputs */
input:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

input.is-invalid:focus {
    border-color: #dc3545;
    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}
</style>
