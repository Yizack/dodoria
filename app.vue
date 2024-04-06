<script setup>
const nuxtApp = useNuxtApp();
nuxtApp.$router.options.scrollBehavior = (to) => {
  if (to.hash === "") {
    return { left: 0, top: 0 };
  }
  else {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ el: to.hash, top: 48, left: 0, behavior: "smooth" });
      }, 500);
    });
  }
};
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtLoadingIndicator />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style scoped>
.nuxt-loading-indicator {
  background: repeating-linear-gradient(to right,#f697c8 0%,#f1e0e9 50%,#f697c8 100%)!important;
}
</style>
