<script setup lang="ts">
definePageMeta({ layout: "site" });
const { data: data } = useFetch("/api/botrix");
const formatDate = (date: string) => new Date(date).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });
</script>

<template>
  <main>
    <div class="container text-white text-center">
      <div class="py-4">
        <NuxtLink class="text-white text-decoration-none" to="/">
          <img class="img-fluid rounded-circle mb-2" src="/images/dodoria.png">
          <h1>Dodoria</h1>
        </NuxtLink>
        <div class="mb-3">
          <code class="bg-dark p-2 rounded-3">/botrix</code>
        </div>
        <p>Leaderboard de Botrix en el canal de Kick de angar</p>
      </div>
      <table class="table table-dark table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Usuario</th>
            <th scope="col">Puntos</th>
            <th scope="col">Watchtime</th>
            <th scope="col">Seguidor desde</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(u, i) of data" :key="i">
            <tr>
              <th scope="row">{{ i + 1 }}</th>
              <td><NuxtLink :to="`https://kick.com/${u.name}`" external target="_blank">{{ u.name }}</NuxtLink></td>
              <td>{{ u.points }}</td>
              <td>{{ u.watchtime }}</td>
              <td>{{ u.followage?.date ? formatDate(u.followage.date) : '' }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </main>
</template>
