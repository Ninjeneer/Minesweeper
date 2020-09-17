<template>
  <div id="game" class="container border">
    <div class="row">
      <div class="col-12">
        <h1>Jeu du démineur - {{ pseudo }}</h1>
      </div>
    </div>

    <div class="row">
      <div class="col-12 col-sm-3 border text-left">
        <p>Joueurs connectés :</p>
        <ul>
          <li>loan</li>
        </ul>
      </div>
      <div class="col-12 col-sm-9 border">
        <div class="row">
          <div class="col-12">
            <p>Bombes restantes : {{ grid.length + grid[0].length }}</p>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="grid mx-auto">
              <div 
              class="cell" 
              v-for="(cell, index) in [].concat(...grid)" 
              :key="cell" 
              v-on:click="pickCell(index)"
              v-bind:id="'cell-' + index"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Game",
  props: {
    pseudo: String,
  },
  data: function() {
      return {
          grid: [
              [0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0],
          ]
      }
  },
  methods: {
      pickCell: function(cellNumber) {
          const row = Math.floor(cellNumber / this.grid.length);
          const col = cellNumber % this.grid.length;

          document.getElementById('cell-' + cellNumber).innerText = this.grid[row][col];
      }
  }
};
</script>

<style scoped>
#game .container {
  width: 90% !important;
}

.grid {
  display: grid;
  grid-template-columns: repeat(8, 40px);
  grid-template-rows: repeat(8, 40px);
  width: 80%;
  border: 1xp solid red;
}

.cell {
  border: 1px solid grey;
  background-color: lightgray;
  transition-duration: 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cell:hover {
    background-color: darkgray;
    transition-duration: 0.2s;
}

.cell:active {
    box-shadow: inset 0px 0px 5px black;
}
</style>