import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "./assets/css/style.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "@router";
import App from "./App.vue";
// import CustomButton from "@/components/CustomButton.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { dom } from "@fortawesome/fontawesome-svg-core";
import Toast from "vue-toastification"; // Importation du plugin Toast
import "vue-toastification/dist/index.css"; // Importation des styles de Toastification

dom.watch();

// Ajouter les bibliothèques FontAwesome à la bibliothèque globale
library.add(fas, fab, far);

const toastOptions = {
  position: "top-right", // Position des notifications
  timeout: 5000, // Durée avant disparition (ms)
  closeOnClick: true, // Fermer en cliquant dessus
  pauseOnHover: true, // Pause si la souris survole la notification
};

const pinia = createPinia();
const app = createApp(App);

// Enregistrement des composants globaux
app.component("font-awesome-icon", FontAwesomeIcon);
// app.component("CustomBtn", CustomButton);

// Utilisation des plugins
app.use(pinia);
app.use(router);
app.use(Toast, toastOptions); // Ajout du plugin Toast avec les options

// Montage de l'application
app.mount("#app");
