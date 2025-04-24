<script setup lang="ts">
definePageMeta({ layout: "site" });

useHead({
  title: SITE.name,
  meta: [
    { name: "description", content: SITE.meta_description }
  ],
  script: [],
  link: [
    { rel: "canonical", href: `${SITE.host}` }
  ]
});
</script>

<template>
  <Dodoria />
</template>
