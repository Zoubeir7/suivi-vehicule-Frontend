import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/store/authStore";
import Login from "../Login.vue";
import Dashboard from "../Dashbord.vue";
import ListUtil from "@/views/utilisateur/ListUtil.vue";
import ListIncident from "@/views/incident/ListIncident.vue";
import ListVehicule from "@/views/vehicule/ListVehicule.vue";
import ListDocument from "@/views/document/ListDocument.vue";
import ListTypeEntretien from "@/views/typeEntretien/ListTypeEntretien.vue";
import ListEntretien from "@/views/entretien/ListEntretien.vue";
import AjoutUtil from "@/views/utilisateur/AjoutUtil.vue";
import ModifUtil from "@/views/utilisateur/ModifUtil.vue";
import VoirUtil from "@/views/utilisateur/VoirUtil.vue";
import AjoutDocument from "@/views/document/AjoutDocument.vue";
import AjoutVehicule from "@/views/vehicule/AjoutVehicule.vue";
import AjoutIncident from "@/views/incident/AjoutIncident.vue";
import ModifierIncident from "@/views/incident/ModifierIncident.vue";
import VoirIncident from "@/views/incident/VoirIncident.vue";
import ModifierVehicule from "@/views/vehicule/ModifierVehicule.vue";
import VoirVehicule from "@/views/vehicule/VoirVehicule.vue";
import ModifDocument from "@/views/document/ModifDocument.vue";
import ForgotPassword from "../components/ForgotPassword.vue";
import ResetPassword from "../components/ResetPassword.vue";
import VoirDocument from "@/views/document/VoirDocument.vue";
import AjouttypeEntretien from "@/views/typeEntretien/AjouttypeEntretien.vue";
import ModifiertypeEntretien from "@/views/typeEntretien/ModifiertypeEntretien.vue";
import VoirtypeEntretien from "@/views/typeEntretien/VoirtypeEntretien.vue";
import AjoutEntretien from "@/views/entretien/AjoutEntretien.vue";
import ModifierEntretien from "@/views/entretien/ModifierEntretien.vue";
import VoirEntretien from "@/views/entretien/VoirEntretien.vue";



const routes = [
    {
        path: "/",
        name: "login",
        component: Login,
    },
    {
        path: "/home",
        name: "home",
        component: Dashboard,
        meta: { requiresAuth: true },
        children: [
            { path: "listUser", name: "listUtil", component: ListUtil, meta: { requiresAuth: true } },
            { path: "list-incident", name: "listIncident", component: ListIncident, meta: { requiresAuth: true } },
            { path: "list-vehicule", name: "listVehicule", component: ListVehicule, meta: { requiresAuth: true } },
            { path: "list-document", name: "listDocument", component: ListDocument, meta: { requiresAuth: true } },
            { path: "list-type-entretien", name: "listTypeEntretien", component: ListTypeEntretien, meta: { requiresAuth: true } },
            { path: "listentretien", name: "listEntretien", component: ListEntretien, meta: { requiresAuth: true } },
            { path: "ajout-utilisateur", name: "ajoutUtil", component: AjoutUtil, meta: { requiresAuth: true } },
            { path: "modifier-utilisateur/:id", name: "modifierUtil", component: ModifUtil, meta: { requiresAuth: true } },
            { path: "apercie-utilisateur/:id", name: "voirUtil", component: VoirUtil, meta: { requiresAuth: true } },
            { path: "ajout-document", name: "ajoutDocument", component: AjoutDocument, meta: { requiresAuth: true } },
            { path: "ajout-vehicule", name: "ajoutVehicule", component: AjoutVehicule, meta: { requiresAuth: true } },
            { path: "ajout-incident", name: "ajoutIncident", component: AjoutIncident, meta: { requiresAuth: true } },
            { path: "modifier-incident/:id", name: "modifierIncident", component: ModifierIncident, meta: { requiresAuth: true } },
            { path: "appercie-incident/:id", name: "voirIncident", component: VoirIncident, meta: { requiresAuth: true } },
            { path: "modifier-vehicule/:id", name: "modifierVehicule", component: ModifierVehicule, meta: { requiresAuth: true } },
            { path: "appercie-vehicule/:id", name: "voirVehicule", component: VoirVehicule, meta: { requiresAuth: true } },
            { path: "modifierDocument/:id", name: "modifierDocument", component: ModifDocument, meta: { requiresAuth: true } },
            { path: "voirDocument/:id", name: "voirDocument", component: VoirDocument, meta: { requiresAuth: true } },
            { path: "ajoutTypeEntretien", name: "ajoutTypeEntretien", component: AjouttypeEntretien, meta: { requiresAuth: true } },
            { path: "modifierTypeEntretien/:id", name: "modifierTypeEntretien", component: ModifiertypeEntretien, meta: { requiresAuth: true } },
            { path: "voirTypeEntretien/:id", name: "voirTypeEntretien", component: VoirtypeEntretien, meta: { requiresAuth: true } },
            { path: "ajoutEntretien", name: "ajoutEntretien", component: AjoutEntretien, meta: { requiresAuth: true } },
            { path: "modifierEntretien/:id", name: "modifierEntretien", component: ModifierEntretien, meta: { requiresAuth: true } },
            { path: "voirEntretien/:id", name: "voirEntretien", component: VoirEntretien, meta: { requiresAuth: true } },

          
        ],
    },
    {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: ForgotPassword
      },
      {
        path: '/reset-password',
        name: 'ResetPassword',
        component: ResetPassword
      },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    authStore.checkAuth();

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next({ name: "login" }); 
    } else {
        next(); 
    }
});

export default router;

