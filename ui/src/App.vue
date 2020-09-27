<template>
  <div id="app" class="container-fluid">
    <Home v-on:register="register" v-if="this.pseudo === ''" />
    <Game v-else :pseudo="this.pseudo" />
  </div>
</template>

<script>
import Game from "./components/game/Game";
import Home from "./components/Home";

export default {
  name: "App",
  components: {
    Home,
    Game,
  },
  data: function () {
    return {
      pseudo: "",
    };
  },
  methods: {
    register: function (pseudo) {
      this.pseudo = pseudo;
      this.$socket.emit("register", pseudo);
    },
  },
};
</script>

<style scoped>
#app {
  margin: 0 !important;
  padding: 0 !important;
}
</style>
