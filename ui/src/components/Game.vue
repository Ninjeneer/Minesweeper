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
          <li v-for="(pseudo, index) in this.players" :key="index">{{ pseudo }}</li>
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
                :key="index"
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
      players: []
    };
  },
  mounted: function () {
    this.$socket.emit("getGrid");
  },
  methods: {
    pickCell: function (cellNumber) {
      const row = Math.floor(cellNumber / this.grid.length) + 1;
      const col = (cellNumber % this.grid.length) + 1;

      this.$socket.emit("pick", { row, col });
    },
    resetGame: function () {
      const answer = confirm("Voulez-vous vraiment réinitialiser la partie ?");
      if (answer) {
        this.$socket.emit("reset");
      }
    },
  },
  socket: {
    events: {
      players: function(data) {
        this.players = data;
      },
      grid: function (data) {
        console.log(data);
        this.grid = data;
        const grid = document.getElementById("grid");
        grid.style.gridTemplateColumns = `repeat(${this.grid.length}, ${this.cellSize}px)`;
        grid.style.gridTemplateRows = `repeat(${this.grid.length}, ${this.cellSize}px)`;

        for (let row = 0; row < this.grid.length; row++) {
          for (let col = 0; col < this.grid.length; col++) {
            const DOMCell = document.getElementById(
              "cell-" + (row * this.grid.length + col)
            );
            if (DOMCell) {
              if (this.grid[row][col].visited) {
                DOMCell.innerText = this.grid[row][col].value;
                DOMCell.classList.add("revealed");
              } else {
                DOMCell.innerText = "";
                DOMCell.classList.remove("revealed");
              }
            }
          }
        }
      },
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