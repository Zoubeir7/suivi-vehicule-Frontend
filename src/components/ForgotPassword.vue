<template>
  <div class="forgot-password">
    <h4>Réinitialiser le mot de passe</h4>
    <form @submit.prevent="handleForgotPassword">
      <input
        type="email"
        v-model="email"
        placeholder="Entrez votre email"
        required
      />
      <button class="btn" type="submit">Envoyer</button>
    </form>
    <p v-if="message" class="message">{{ message }}</p>
  </div>
</template>
  
  <script setup>
import { ref } from "vue";
import axios from "axios";
import { useToast } from "vue-toastification";

const email = ref("");
const message = ref("");
const toast = useToast();
async function handleForgotPassword() {
  try {
    const response = await axios.post(
      "http://localhost:3005/request-password-reset",
      { email: email.value }
    );
    message.value = response.data.message || "Lien de réinitialisation envoyé.";
    toast.success("Lien de réinitialisation envoyé !");
  } catch (error) {
    message.value = error.response.data.message || "Erreur lors de l'envoi.";
    toast.error("Erreur lors de l'envoi.");
  }
  console.log("Valeur de l'email :", email.value);
}
</script>
  
  <style scoped>
.forgot-password {
  color: #fff;
  padding: 2rem;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
  margin: 70px auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h4 {
  color: black; 
  text-align: center;
  margin-bottom: 2rem;
}

form {
  display: flex;
  flex-direction: column;
}

input[type="email"] {
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

input[type="email"]::placeholder {
  color: #aaa;
}

input[type="email"]:focus {
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
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.btn:active {
  background: linear-gradient(45deg, #137dbb, #242d32);
}

.message {
  margin-top: 1rem;
  text-align: center;
  color: black;
}
</style>
  