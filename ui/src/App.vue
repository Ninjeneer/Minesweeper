<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>-->
    <Home v-on:register="register" v-if="this.pseudo === ''" />
    <Game v-else :pseudo="this.pseudo" />
  </div>
</template>

<script>
import Game from "./components/Game";
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
    register: function(pseudo) {
      this.pseudo = pseudo;
      this.$socket.emit('register', pseudo);
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0 !important;
  padding: 0 !important;
}
</style>
