<script setup lang="ts">
definePageMeta({ layout: "site" });

const { command } = useRoute("c-command").params;
const currentCommand = COMMANDS[command.toUpperCase() as keyof typeof COMMANDS];

if (!currentCommand) {
  throw createError({
    statusCode: 404,
    message: "Command not found",
    fatal: true
  });
}
</script>

<template>
  <div class="container text-white text-center">
    <div class="py-4">
      <NuxtLink class="text-white text-decoration-none" to="/">
        <img class="img-fluid rounded-circle mb-2" src="/images/dodoria.png">
        <h1>Dodoria</h1>
      </NuxtLink>
      <div class="mb-3">
        <code class="bg-dark p-2 rounded-3">/{{ currentCommand.name }}</code>
      </div>
      <p>{{ currentCommand.description }}</p>
    </div>
  </div>
</template>
