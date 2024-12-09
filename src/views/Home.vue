<script setup>
import { useI18n } from "vue-i18n";
const { locale } = useI18n();
const t = useI18n();
</script>

<template>
  <div class="container">
    <div class="container text-center mt-5">
      <h1 class="display-4 fw-bold mb-4">jsdjsjsddjj</h1>
      <p class="lead mb-4">
        {{ $t('recipes.home_page.paragraphe') }}
      </p>
      <h2 class="h4 text-secondary fst-italic"></h2>

      <!-- Ajout des images en colonnes -->
      <div class="row mt-5">
        <!-- Colonne 1 -->
        <div class="col-md-4 mb-4">
          <img src="../assets/i.png" class="img-fluid rounded" alt="Image 1">
        </div>
        <!-- Colonne 2 -->
        <div class="col-md-4 mb-4">
          <img src="../assets/i2.jpg" class="img-fluid rounded" alt="Image 2">
        </div>
        <!-- Colonne 3 -->
        <div class="col-md-4 mb-4">
          <img src="../assets/rr.jpg" class="img-fluid rounded" alt="Image 3">
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
