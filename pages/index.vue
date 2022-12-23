<script setup>
import { SITE } from "~/site-info.js";
definePageMeta({ layout: "site" });
</script>

<template>
  <Dodoria/>
</template>

<script>
export default {
  name: "IndexPage",
  created() {
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
  }
};
</script>
