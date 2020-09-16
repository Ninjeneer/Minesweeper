<template>
  <div class="row">
    <div class="col-6 offset-3 jumbotron align-center">
      <h1 class>Entrez votre pseudo</h1>
      <input class="form-control mb-3" placeholder="Pseudonyme" />
      <button class="w-100 btn btn-success" v-on:click="test">Go</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  methods: {
    test: function () {
      this.$socket.send("aaaaaa");
    },
  },
};
</script>