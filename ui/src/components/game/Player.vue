<template>
  <div class="row mt-5">
    <div class="col-12">
      <p><b>Joueurs connectés :</b></p>
      <ul>
        <li
          v-for="(player, index) in this.players"
          :key="index"
          :style="{ color: player.color }"
        >
          {{ player.pseudo }} - {{ player.score }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "Player",
  props: {
    players: {
      type: Array,
    },
  },
};
</script>