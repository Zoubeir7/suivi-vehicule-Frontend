<template>
  <div class="reset-password">
    <form @submit.prevent="handleResetPassword">
      <input type="password" v-model="newPassword" placeholder="Nouveau mot de passe" required />
      <input type="password" v-model="confirmPassword" placeholder="Confirmez le mot de passe" required />
      <button type="submit">Confirmer</button>
    </form>
    <p v-if="message" class="message">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useToast } from "vue-toastification";

const newPassword = ref('');
const confirmPassword = ref('');
const message = ref('');
const route = useRoute();
const router = useRouter();
const toast = useToast();

async function handleResetPassword() {
  if (newPassword.value !== confirmPassword.value) {
    message.value = "Les mots de passe ne correspondent pas.";
    toast.error("Les mots de passe ne correspondent pas.");
    return;
  }

  try {
    const token = route.query.token;
    const response = await axios.post('http://localhost:3005/reset-password', {
      token,
      newPassword: newPassword.value,
    });
    message.value = response.data.message || "Mot de passe réinitialisé avec succès.";
    toast.success("Mot de passe réinitialisé avec succès !");
    router.push("/");
  } catch (error) {
    message.value = error.response.data.message || "Erreur de réinitialisation.";
    toast.error("Erreur de réinitialisation.");
  }
}
</script>

<style scoped>
.reset-password {
  color: #fff;
  padding: 2rem;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
  margin: 70px auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}


form {
  display: flex;
  flex-direction: column;
}

input[type="password"] {
  padding: 10px;
  margin-bottom: 1rem;
  /* border: 2px solid #26a49c; */
  border: 2px solid #137dbb;
  border-radius: 5px;
  font-size: 1rem;
  color: #242d32;
  background-color: #fff;
  outline: none;
}

input[type="password"]::placeholder {
  color: #aaa;
}

input[type="password"]:focus {
  border-color: #137dbb;
  /* border-color: #26a49c; */
  box-shadow: 0 0 5px rgba(38, 164, 156, 0.5);
}

button {
  /* background-color: #26a49c; */
  background: linear-gradient(45deg, #242d32, #137dbb);
  color: #fff;
  padding: 10px;
  border: none;
  font-weight: bold;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.message {
  margin-top: 1rem;
  text-align: center;
  color: red;
}
</style>