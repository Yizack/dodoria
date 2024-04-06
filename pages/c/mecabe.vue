<script setup>
import { ME_CABE } from "~/src/commands.js";
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
        <code class="bg-dark p-2 rounded-3">/{{ ME_CABE.name }}</code>
      </div>
      <p>{{ ME_CABE.description }}</p>
    </div>
  </div>
</template>
