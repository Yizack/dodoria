<script setup>
import { SITE } from "~/site-info.js";
definePageMeta({ layout: "site" });

useHead({
  title: SITE.name,
  meta: [
    { name: "keywords", content: SITE.keywords },
    { name: "description", content: SITE.meta_description },
  ],
  script: [],
  link: [
    { rel: "canonical", href: `${SITE.url}/` }
  ]
});
</script>

<template>
  <Dodoria />
</template>
