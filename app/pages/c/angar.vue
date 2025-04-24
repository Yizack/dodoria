<script setup lang="ts">
definePageMeta({ layout: "site" });

const { data: images } = await useFetch("/api/angar/images", {
  getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key]
});
</script>

<template>
  <div v-if="images" class="container text-white text-center">
    <div class="py-4">
      <NuxtLink class="text-white text-decoration-none" to="/">
        <img class="img-fluid rounded-circle mb-2" src="/images/dodoria.png">
        <h1>Dodoria</h1>
      </NuxtLink>
      <div class="mb-3">
        <code class="bg-dark p-2 rounded-3">/angar</code>
      </div>
      <p>Colección de imágenes y memes de ANGAR. (Total: {{ images.length }})</p>
      <div class="py-2">
        <MasonryWall :items="images" :ssr-columns="5" :gap="10" :max-columns="5" :column-width="0">
          <template #default="{ item: link }">
            <img class="img-fluid rounded scale-on-hover border border-2 border-dark" :src="`${SITE.cdnUrl}/${link}`" role="button" @click="open(`${SITE.cdnUrl}/${link}`)">
          </template>
        </MasonryWall>
      </div>
    </div>
  </div>
</template>
