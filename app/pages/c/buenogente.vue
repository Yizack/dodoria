<script setup lang="ts">
definePageMeta({ layout: "site" });
</script>

<template>
  <div class="container text-white text-center">
    <div class="py-4">
      <NuxtLink class="text-white text-decoration-none" to="/">
        <img class="img-fluid rounded-circle mb-2" src="/images/dodoria.png">
        <h1>Dodoria</h1>
      </NuxtLink>
      <div class="mb-3">
        <code class="bg-dark p-2 rounded-3">/buenogente</code>
      </div>
      <p>Colección de fotos de angar "BUENO GENTE".</p>
    </div>
    <div class="row">
      <div v-for="(n) in CONSTANTS.BUENOGENTE" :key="n" class="col-lg-4 mb-4" role="button" @click="open(`/images/buenogente/${n}.jpg`)">
        <img class="img-fluid rounded scale-on-hover" :src="`/images/buenogente/${n}.jpg`">
      </div>
    </div>
  </div>
</template>
