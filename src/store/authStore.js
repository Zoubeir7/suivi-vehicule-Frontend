import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        isAuthenticated: false,
        user: null,
        token: null,
        userName:'',
        userNameG:'',
        userRole:'',
        user:{}
    }),
    actions: {
        async login(email, password) {
            try {
                const response = await axios.post("http://localhost:3005/login", { email, password });
                const { accessToken, user } = response.data;
            
                this.isAuthenticated = true;
                this.token = accessToken;
                this.user = user;
                localStorage.setItem("authToken", accessToken);

                axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
                // console.log(localStorage)
               await this.fetchUserName()
               await this.fetchUserRole()
               
            } catch (error) {
                this.isAuthenticated = false;
                this.token = null;
                this.user = null;
                throw new Error(error.response?.data?.error || "Login failed");
            }
        },

        logout() {
            this.isAuthenticated = false;
            this.user = null;
            this.token = null;
            localStorage.removeItem("authToken");
            delete axios.defaults.headers.common["Authorization"];
            console.log(localStorage)

        },

        async fetchUserName() {
            try {
              const resp = await axios.get("http://localhost:3005/utilisateur");
              this.userName = resp.data.user.prenom || 'Utilisateur inconnu';
              this.userNameG = resp.data.user.nom || 'Utilisateur inconnu';
              this.userRole = resp.data.user.role || 'Utilisateur inconnu';

              this.user = resp.data.user;

              console.log(this.userName && this.userNameG);
              
            } catch (error) {
              console.error("Erreur lors de la récupération du nom d'utilisateur connecté :", error.response ? error.response.data : error);
            }
          },
        async setUserInfo(userName, userRole) {
            this.userName = userName;
            this.userRole = userRole;
            // Persister dans le localStorage
            localStorage.setItem("userName", userName);
            localStorage.setItem("userRole", userRole);
        },
        async fetchUserRole() {
            try {
              const resp = await axios.get("http://localhost:3005/role");
              this.userRole = resp.data.user.role || 'Utilisateur inconnu';
              this.user = resp.data.user;
              console.log(this.userRole);
              
            } catch (error) {
              console.error("Erreur lors de la récupération du nom d'utilisateur connecté :", error.response ? error.response.data : error);
            }
          },

        checkAuth() {
            const token = localStorage.getItem("authToken");
            if (token) {
                this.isAuthenticated = true;
                this.token = token;
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            } else {
                this.isAuthenticated = false;
            }
        },
    },
});
