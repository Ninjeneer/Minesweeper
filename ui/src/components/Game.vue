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
      <div class="col-12 col-sm-9 border p-3">
        <div class="row">
          <div class="col-12">
            <div class="alert alert-success">Partie gagnée</div>
            <p>Bombes restantes : {{ grid.length + grid[0].length }}</p>
          </div>
        </div>
        <div class="row mb-5">
          <div class="col-12 mx-auto text-center">
            <div id="grid" class="grid mx-auto">
              <div
                class="cell"
                v-for="(cell, index) in [].concat(...grid)"
                :key="cell"
                v-on:click="pickCell(index)"
                v-bind:id="'cell-' + index"
              ></div>
            </div>
          </div>
        </div>
        <div class="row mt-5">
          <div class="col-12 text-right">
            <button class="btn btn-danger" v-on:click="resetGame()">Réinitialiser la partie</button>
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
  data: function () {
    return {
      cellSize: 40,
      grid: [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
      ],
    };
  },
  mounted: function() {
    const grid = document.getElementById('grid');
    grid.style.gridTemplateColumns = `repeat(${this.grid.length}, ${this.cellSize}px)`;
    grid.style.gridTemplateRows = `repeat(${this.grid.length}, ${this.cellSize}px)`;
  },
  methods: {
    pickCell: function (cellNumber) {
      const row = Math.floor(cellNumber / this.grid.length);
      const col = cellNumber % this.grid.length;

      const cell = document.getElementById("cell-" + cellNumber);
      cell.innerText = this.grid[row][col];
      cell.classList.add("revealed");

      this.$socket.emit('lol', 'coucou');
    },
    resetGame: function () {
      const answer = confirm("Voulez-vous vraiment réinitialiser la partie ?");
    },
  },
};
</script>

<style scoped>
#game .container {
  width: 90% !important;
}

.grid {
  display: grid;
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

.revealed,
.revealed:hover {
  background-color: white;
  font-weight: bold;
}
</style>