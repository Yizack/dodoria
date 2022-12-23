<script setup>
import { buenogente } from "~/src/images.js";
definePageMeta({ layout: "site" });
</script>


<template>
  <div class="container text-white text-center">
    <div class="py-4">
      <img class="img-fluid rounded-circle mb-2" src="/images/dodoria.png">  
      <h1>Dodoria</h1>
      <code>/buenogente</code>
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
