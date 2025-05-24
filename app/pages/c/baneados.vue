<script setup lang="ts">
definePageMeta({ layout: "site" });

interface BanEntry {
  id: number;
  username: string;
  action: "ban" | "unban";
  timestamp: number;
  timeoutUntil: number | null;
}

const { data: entries } = await useFetch<BanEntry[]>("/api/baneados/kick");
const formatDateTime = (date: number) => new Date(date).toLocaleTimeString("es-MX", {
  hour: "2-digit",
  minute: "2-digit",
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
}).replace(/(\d{2})\/(\d{2})\/(\d{4}), (\d{2}:\d{2}:\d{2})/, "$3-$2-$1 $4");

const entryMessage = (entry: BanEntry) => {
  if (entry.action === "ban") {
    if (entry.timeoutUntil) {
      return `timeout hasta ${formatDateTime(entry.timeoutUntil)}`;
    }
    return "baneado";
  }
  return "desbaneado";
};

const rankingByBansAndTimeouts = computed(() => {
  const ranking = (entries.value ?? []).reduce((acc: {
    [username: string]: {
      bans: number;
      timeouts: number;
      unbans: number;
    };
  }, entry) => {
    const key = entry.action === "ban" ? !entry.timeoutUntil ? "bans" : "timeouts" : "unbans";
    if (!acc[entry.username]) {
      acc[entry.username] = { bans: 0, timeouts: 0, unbans: 0 };
    }
    acc[entry.username]![key]++;
    return acc;
  }, {});
  const sortedRanking = Object.entries(ranking).sort((a, b) => {
    const aTotal = a[1].bans + a[1].timeouts;
    const bTotal = b[1].bans + b[1].timeouts;
    if (aTotal === bTotal) {
      return b[1].bans - a[1].bans;
    }
    return bTotal - aTotal;
  });
  return sortedRanking.filter(entry => entry[1].bans || entry[1].timeouts);
});
</script>

<template>
  <main>
    <div class="container-lg text-white text-center">
      <div class="py-4">
        <NuxtLink class="text-white text-decoration-none" to="/">
          <img class="img-fluid rounded-circle mb-2" src="/images/dodoria.png">
          <h1>Dodoria</h1>
        </NuxtLink>
        <div class="mb-3">
          <code class="bg-dark p-2 rounded-3">/baneados</code>
        </div>
        <p>Baneados en el canal de Kick de angar</p>
      </div>
      <div class="mb-2 row justify-content-end align-items-start gy-5">
        <div class="col-12 col-xl-5 overflow-hidden">
          <p>Top usuarios más baneados (a partir del 14 mayo 2025)</p>
          <div class="overflow-auto">
            <table class="table table-dark m-0 text-center">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Usuario</th>
                  <th scope="col">Baneos</th>
                  <th scope="col">Timeouts</th>
                  <th scope="col" class="leaderboard-highlight-head">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(entry, index) in rankingByBansAndTimeouts" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ entry[0] }}</td>
                  <td>{{ entry[1].bans }}</td>
                  <td>{{ entry[1].timeouts }}</td>
                  <td class="leaderboard-highlight">{{ entry[1].bans + entry[1].timeouts }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="col-12 col-xl-7 overflow-hidden">
          <p>Historial de baneos</p>
          <div class="overflow-auto">
            <table class="table table-dark m-0 text-start overflow-auto">
              <tbody>
                <tr v-for="(entry, index) in entries" :key="index" :class="entry.action === 'ban' ? entry.timeoutUntil ? 'timeout' : 'ban' : 'unban'">
                  <td>
                    <p class="m-0">{{ entry.username }}</p>
                    <span style="color: #cdcdcd; font-size: 12px;">{{ formatDateTime(entry.timestamp) }}</span>
                  </td>
                  <td class="align-content-center">{{ entryMessage(entry) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.timeout td {
  background-color: #776f44;
}

.ban td {
  background-color: #70323c;
}

.unban td {
  background-color: #316952;
}

.leaderboard-highlight {
  background-color: #612142;
}

.leaderboard-highlight-head {
  background-color: #4e0a2d;
}

table a {
  &:hover {
    text-decoration: underline!important;
  }
}
</style>
