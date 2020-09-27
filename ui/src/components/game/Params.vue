<template>
  <div id="params">
    <div class="row">
      <div class="col-12">
        <p><b>Paramètres :</b></p>
      </div>
    </div>
    <div class="form-row">
      <div class="col-12">
        <label for="nbBombForm">Taille de grille à la prochaine partie</label>
        <input
          type="number"
          class="form-control"
          id="gridSizeForm"
          placeholder="Taille de côté"
          v-model="nextGridSize"
          v-bind:min="Math.ceil(Math.sqrt(this.nextBombAmount))"
        />
      </div>
    </div>

    <div class="form-row mb-2">
      <div class="col-12">
        <label for="nbBombForm">Nombre de bombes à la prochaine partie</label>
        <input
          type="number"
          class="form-control"
          id="nbBombForm"
          placeholder="Nombre de bombes"
          v-model="nextBombAmount"
          v-bind:max="this.nextGridSize * this.nextGridSize"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-12 text-right">
        <button class="btn btn-danger" v-on:click="resetGame()">
          Réinitialiser la partie
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import MessageBoxManager from "../../utils/MessageBoxManager";

export default {
  name: "Params",
  props: {
    nextGridSize: Number,
    nextBombAmount: Number,
  },
  methods: {
    resetGame: function () {
      const answer = confirm("Voulez-vous vraiment réinitialiser la partie ?");
      if (answer) {
        console.log(this.nextGridSize + " : " + this.nbBombs);
        this.$socket.emit("reset", {
          size: this.nextGridSize,
          nbBombs: this.nextBombAmount,
        });
        this.canPlay = true;
        MessageBoxManager.hide();
      }
    },
  },
};
</script>

<style>
#params {
  padding-top: 30px;
}
</style>