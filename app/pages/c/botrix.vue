<script setup lang="ts">
definePageMeta({ layout: "site" });
const router = useRouter();
const { sort }: { sort?: "points" | "watchtime" } = useRoute().query;
const sortType = ref(sort || "points");

const { data: leaderboard } = await useFetch("/api/botrix/leaderboard", {
  query: { sort: sortType.value }
});
const formatDate = (date: string) => new Date(date).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });

const loading = ref(false);
const sortSelect = [
  { value: "points", label: "Puntos" },
  { value: "watchtime", label: "Watchtime" }
];

const fetchLeaderboard = async () => {
  loading.value = true;
  const newLeaderboard = await $fetch("/api/botrix/leaderboard", {
    query: { sort: sortType.value }
  });
  router.push({
    query: {
      ...sortType.value !== "points" && { sort: sortType.value }
    }
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
        <select v-model="sortType" class="form-select w-auto" @change="fetchLeaderboard">
          <option v-for="s in sortSelect" :key="s.value" :value="s.value">{{ s.label }}</option>
        </select>
      </div>
      <div v-if="!loading && leaderboard" class="overflow-x-auto rounded-3 mb-4">
        <table class="table table-dark m-0">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Usuario</th>
              <th scope="col" :class="{ 'leaderboard-highlight-head': sortType === 'points' }">Puntos</th>
              <th scope="col" :class="{ 'leaderboard-highlight-head': sortType === 'watchtime' }">Watchtime</th>
              <th scope="col">Seguidor desde</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(user, i) of leaderboard" :key="i">
              <tr>
                <th scope="row">
                  <div class="d-flex justify-content-center align-items-center gap-1">
                    <span>{{ i + 1 }}</span>
                    <Twemoji v-if="i + 1 === 1" emoji="🥇" size="26px" />
                    <Twemoji v-else-if="i + 1 === 2" emoji="🥈" size="26px" />
                    <Twemoji v-else-if="i + 1 === 3" emoji="🥉" size="26px" />
                    <Twemoji v-else emoji="🎖️" />
                  </div>
                </th>
                <td><NuxtLink :to="`https://kick.com/${user.name}`" external target="_blank" class="text-decoration-none">{{ user.name }}</NuxtLink></td>
                <td :class="{ 'leaderboard-highlight': sortType === 'points' }">{{ user.points.toLocaleString() }}</td>
                <td :class="{ 'leaderboard-highlight': sortType === 'watchtime' }">{{ formatWatchtime(user.watchtime) }}</td>
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

a {
  &:hover {
    text-decoration: underline!important;
  }
}
</style>
