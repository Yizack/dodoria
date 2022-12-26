<script setup>
import { buenogente } from "~/src/images.js";
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
      <div class="col-lg-4 mb-4" v-for="link in buenogente.slice().reverse()" role="button" @click="open(link)">
        <img class="img-fluid rounded scale-on-hover" :src="link">
        <p>{{ link.split("/")[4] }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    open(link) {
      window.open(link, "_blank");
    }
  }
};
</script>
