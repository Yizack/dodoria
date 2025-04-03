<script setup lang="ts">
definePageMeta({ layout: "site" });
const { data: leaderboard } = await useFetch("/api/botrix");
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
      <div class="overflow-x-auto rounded-3 mb-4">
        <table class="table table-dark table-hover m-0">
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
            <template v-for="(user, i) of leaderboard" :key="i">
              <tr>
                <th scope="row">{{ i + 1 }}</th>
                <td><NuxtLink :to="`https://kick.com/${user.name}`" external target="_blank">{{ user.name }}</NuxtLink></td>
                <td>{{ user.points }}</td>
                <td>{{ user.watchtime }}</td>
                <td>{{ user.followage?.date ? formatDate(user.followage.date) : '' }}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>
