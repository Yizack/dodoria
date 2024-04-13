<script setup>
import { CONSTANTS } from "~/src/constants.js";
definePageMeta({ layout: "site" });

const open = (link) => {
  window.open(link, "_blank");
};
</script>

<template>
  <div class="container text-white text-center">
    <div class="py-4">
      <NuxtLink class="text-white text-decoration-none" to="/">
        <img class="img-fluid rounded-circle mb-2" src="/images/dodoria.png">
        <h1>Dodoria</h1>
      </NuxtLink>
      <div class="mb-3">
        <code class="bg-dark p-2 rounded-3">/angar</code>
      </div>
      <p>Colección de fotos de ANGAR.</p>
    </div>
    <div class="row">
      <div v-for="(n) in CONSTANTS.ANGAR" :key="n" class="col-lg-4 mb-4" role="button" @click="open(`/images/angar_${n}.jpg`)">
        <img class="img-fluid rounded scale-on-hover" :src="`/images/angar_${n}.jpg`">
        <p>angar_{{ n }}.jpg</p>
      </div>
    </div>
  </div>
</template>
