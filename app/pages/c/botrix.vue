<script setup lang="ts">
definePageMeta({ layout: "site" });
const { data: leaderboard } = await useFetch("/api/botrix/leaderboard");
const formatDate = (date: string) => new Date(date).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });

const loading = ref(false);
const sort = ref("points");
const sortSelect = [
  { value: "points", label: "Puntos" },
  { value: "watchtime", label: "Watchtime" }
];

const fetchLeaderboard = async () => {
  loading.value = true;
  const newLeaderboard = await $fetch("/api/botrix/leaderboard", {
    query: { sort: sort.value }
  });
  leaderboard.value = newLeaderboard;
  loading.value = false;
};
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
        <p>Leaderboard de BotRix en el canal de Kick de angar</p>
      </div>
      <div class="mb-2 d-flex justify-content-end align-items-center gap-2">
        <label for="sort" class="form-label m-0">Ordenar por:</label>
        <select v-model="sort" class="form-select w-auto" @change="fetchLeaderboard">
          <option v-for="s in sortSelect" :key="s.value" :value="s.value">{{ s.label }}</option>
        </select>
      </div>
      <div v-if="!loading && leaderboard" class="overflow-x-auto rounded-3 mb-4">
        <table class="table table-dark m-0">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Usuario</th>
              <th scope="col" :class="{ 'leaderboard-highlight-head': sort === 'points' }">Puntos</th>
              <th scope="col" :class="{ 'leaderboard-highlight-head': sort === 'watchtime' }">Watchtime</th>
              <th scope="col">Seguidor desde</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(user, i) of leaderboard" :key="i">
              <tr>
                <th scope="row">{{ i + 1 }}</th>
                <td><NuxtLink :to="`https://kick.com/${user.name}`" external target="_blank">{{ user.name }}</NuxtLink></td>
                <td :class="{ 'leaderboard-highlight': sort === 'points' }">{{ user.points.toLocaleString() }}</td>
                <td :class="{ 'leaderboard-highlight': sort === 'watchtime' }">{{ formatWatchtime(user.watchtime) }}</td>
                <td>{{ user.followage?.date ? formatDate(user.followage.date) : '' }}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <SpinnerLoading v-else class="my-5" />
    </div>
  </main>
</template>

<style scoped>
.leaderboard-highlight {
  background-color: #612142;
}

.leaderboard-highlight-head {
  background-color: #4e0a2d;
}
</style>
