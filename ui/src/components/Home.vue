<template>
  <div id="home" class="row">
    <div class="col-6 offset-3 jumbotron align-center">
      <h1 class>Entrez votre pseudo</h1>
      <input class="form-control mb-3" placeholder="Pseudonyme" v-model="pseudo"/>
      <button class="w-100 btn btn-success" v-on:click="register">Go</button>
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
    register: function () {
      this.$emit('register', this.pseudo);
      console.log('emit ' + this.pseudo);
    },
  },
};
</script>

<style>
  #home {
    margin-top: 60px;
  }
</style>