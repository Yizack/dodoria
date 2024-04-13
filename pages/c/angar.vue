<script setup>
import { CONSTANTS } from "~/src/constants.js";
definePageMeta({ layout: "site" });

const angarArray = [];

for (let i = 1; i < CONSTANTS.ANGAR; i++) {
  angarArray.push(`/images/angar_${i}.jpg`);
}

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
      <MasonryWall :items="angarArray" :ssr-columns="1" :gap="10" :max-columns="5" :column-width="150">
        <template #default="{ item: link }">
          <div role="button" @click="open(link)">
            <img class="img-fluid rounded scale-on-hover border border-2 border-dark" :src="link">
          </div>
        </template>
      </MasonryWall>
    </div>
  </div>
</template>
