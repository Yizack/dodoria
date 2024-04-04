<script setup>
import { LOLMMR } from "~/src/commands.js";
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
        <code class="bg-dark p-2 rounded-3">/{{ LOLMMR.name }}</code>
      </div>
      <p>{{ LOLMMR.description }}</p>
    </div>
  </div>
</template>
