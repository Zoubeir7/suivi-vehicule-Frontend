<template>
    <div class="d-flex">
        <!-- Sidebar -->
        <aside class="sidebar bg-primary p-3 text-white">
            <!-- Profil utilisateur -->
            <div class="sidebar-header d-flex align-items-center mb-4">
                <i class="fas fa-user-circle fa-2x me-2"></i>
                <div>
                    <h6 class="mb-0">{{ store.userName }} {{ store.userNameG }}</h6>
                </div>
            </div>

            <ul class="nav flex-column text-small">
                <!-- Lien Incident -->
                <li class="nav-item mb-3">
                    <button class="btn btn-outline-light w-100 text-start" :class="isActive('listIncident')"
                        @click="navigate('listIncident')">
                        <i class="fas fa-exclamation-circle fa-lg me-2"></i> Incident
                    </button>
                </li>

                <!-- Lien Véhicule -->
                <li class="nav-item mb-3">
                    <button class="btn btn-outline-light w-100 text-start" :class="isActive('listVehicule')"
                        @click="navigate('listVehicule')">
                        <i class="fas fa-car fa-lg me-2"></i> Véhicule
                    </button>
                </li>

                <!-- Lien Utilisateur -->
                <li class="nav-item mb-3">
                    <button class="btn btn-outline-light w-100 text-start" :class="isActive('listUtil')"
                        @click="navigate('listUtil')">
                        <i class="fas fa-user fa-lg me-2"></i> Utilisateur
                    </button>
                </li>

                <!-- Lien Document -->
                <li class="nav-item mb-3">
                    <button class="btn btn-outline-light w-100 text-start" :class="isActive('listDocument')"
                        @click="navigate('listDocument')">
                        <i class="fas fa-file-alt fa-lg me-2"></i> Document
                    </button>
                </li>

                <!-- Lien Entretien -->
                <li class="nav-item mb-3">
                    <button class="btn btn-outline-light w-100 text-start" :class="isActive('listEntretien')"
                        @click="navigate('listEntretien')">
                        <i class="fas fa-tools fa-lg me-2"></i> Entretien
                    </button>
                </li>

                <!-- Lien Type Entretien -->
                <li class="nav-item mb-3">
                    <button class="btn btn-outline-light w-100 text-start" :class="isActive('listTypeEntretien')"
                        @click="navigate('listTypeEntretien')">
                        <i class="fas fa-cogs fa-lg me-2"></i> Type Entretien
                    </button>
                </li>
            </ul>
        </aside>

        <!-- Main Content -->
        <main class="main-content flex-grow-1 p-4">
            <header class="d-flex justify-content-end align-items-center mb-4">
                <button class="btn btn-primary btn-sm" @click="logout">
                    <i class="fas fa-sign-out-alt me-1"></i> Déconnexion
                </button>
            </header>

            <div class="row mb-4">
                <!-- Exemple de widgets pour le tableau de bord -->
            </div>

            <!-- Le contenu principal change en fonction de la route -->
            <router-view />
        </main>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import Swal from "sweetalert2";
import { useAuthStore } from "./store/authStore";
import { onMounted } from "vue";

const store = useAuthStore();
const router = useRouter();
const route = useRoute();

// Fonction de navigation vers la route
const navigate = (routeName) => {
    router.push({ name: routeName });
};

onMounted(async () => {
    await Promise.all([store.fetchUserName(), store.fetchUserRole()]);
});

// Fonction pour vérifier si la route est active
const isActive = (routeName) => {
    return route.name === routeName ? "active" : "";
};

// Fonction de déconnexion
const logout = () => {
    Swal.fire({
        title: "Déconnexion",
        text: "Êtes-vous sûr de vouloir vous déconnecter ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui",
        cancelButtonText: "Annuler",
        confirmButtonColor: "#dc3545",
        cancelButtonColor: "#6c757d",
    }).then((result) => {
        if (result.isConfirmed) {
            store.logout();
            router.push("/");
        }
    });
};
</script>

<style scoped>
/* Styles de la mise en page */
.d-flex {
    display: flex;
}

.sidebar {
    width: 250px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    font-size: 0.85rem;
}

.sidebar-header {
    font-size: 1.1rem;
    font-weight: bold;
    display: flex;
    align-items: center;
}

.main-content {
    background-color: #f8f9fc;
    min-height: 100vh;
}

.btn-outline-light {
    font-size: 0.85rem;
    color: #ffffff;
    border-color: rgba(255, 255, 255, 0.2);
}

.btn-outline-light:hover {
    background-color: rgba(255, 255, 255, 0.2);
}

.active {
    background-color: rgba(255, 255, 255, 0.2) !important;
    color: #ffffff !important;
}

.btn-primary {
    background-color: transparent;
    border: 2px solid #dc3545;
    color: #dc3545;
}

.btn-primary:hover {
    background-color: rgba(220, 53, 69, 0.1);
    border-color: #c82333;
    color: #c82333;
}

.btn-sm {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
}
</style>
