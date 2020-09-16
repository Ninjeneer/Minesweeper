<template>
  <div class="row">
    <div class="col-6 offset-3 jumbotron align-center">
      <h1 class>Entrez votre pseudo</h1>
      <input class="form-control mb-3" placeholder="Pseudonyme" v-model="pseudo"/>
      <button class="w-100 btn btn-success" v-on:click="test">Go</button>
      {{ pseudo }}
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data: function() {
    return {
      pseudo: ''
    }
  },
  methods: {
    test: function () {
      this.$socket.send({ pseudo: this.pseudo });
    },
  },
};
</script>