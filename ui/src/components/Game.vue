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
          <li 
          v-for="(player, index) in this.players" 
          :key="index"
          :style="{'color': player.color }">{{ player.pseudo }}</li>
        </ul>
      </div>
      <div class="col-12 col-sm-9 border p-3">
        <div class="form-row mb-5">
          <div class="col-6">
            <label for="nbBombForm">Taille de grille à la prochaine partie</label>
            <input type="number" class="form-control" id="gridSizeForm" placeholder="Taille de côté" v-model="nextGridSize"/>
          </div>
          <div class="col-6">
            <label for="nbBombForm">Nombre de bombes à la prochaine partie</label>
            <input type="number" class="form-control" id="nbBombForm" placeholder="Nombre de bombes" v-model="nextBombAmount"/>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div id="messagebox" class="alert">Partie gagnée</div>
            <p>Bombes restantes : {{ this.remainingBombs }}</p>
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
                v-on:contextmenu="flag($event, index)"
                v-bind:id="'cell-' + index"
                :style="{'color': cell.player ? cell.player.color : 'black'}"
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
import MessageBoxManager from "../utils/MessageBoxManager";

export default {
  name: "Game",
  props: {
    pseudo: String,
  },
  data: function () {
    return {
      cellSize: 40,
      canPlay: true,
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
      players: [],
      remainingBombs: 0,
      nextGridSize: 0,
      nextBombAmount: 0
    };
  },
  mounted: function () {
    this.$socket.emit("getGrid");
    // this.$socket.emit("getPlayers");
    MessageBoxManager.init();
  },
  methods: {
    pickCell: function (cellNumber) {
      if (!this.canPlay) {
        return;
      }
      const row = Math.floor(cellNumber / this.grid.length) + 1;
      const col = (cellNumber % this.grid.length) + 1;

      this.$socket.emit("pick", { row, col });
    },
    flag: function (event, cellNumber) {
      event.preventDefault();
      if (!this.canPlay) {
        return;
      }
      const row = Math.floor(cellNumber / this.grid.length) + 1;
      const col = (cellNumber % this.grid.length) + 1;

      this.$socket.emit("flag", { row, col });
    },
    resetGame: function () {
      const answer = confirm("Voulez-vous vraiment réinitialiser la partie ?");
      if (answer) {
        console.log(this.nextGridSize + " : " + this.nbBombs)
        this.$socket.emit("reset", { size: this.nextGridSize, nbBombs: this.nextBombAmount });
        this.canPlay = true;
        MessageBoxManager.hide();
      }
    },
  },
  socket: {
    events: {
      players: function (data) {
        console.log(data);
        this.players = data.players;
        MessageBoxManager.info(
          data.pseudo +
            (data.type === "connect"
              ? " a rejoint la partie !"
              : " a quitté la partie !")
        );
        setTimeout(() => {
          MessageBoxManager.hide();
        }, 5000);
      },
      win: function (state) {
        this.canPlay = false;
        if (state) {
          MessageBoxManager.success("Vous avez gagné la partie !");
        } else {
          MessageBoxManager.danger("Vous avez perdu la partie !");
        }
      },
      error: function (message) {
        MessageBoxManager.danger(message);
        setTimeout(() => {
          MessageBoxManager.hide();
        }, 5000);
      },
      reset: function () {
        this.canPlay = true;
      },
      grid: function (data) {
        data.playerGrid.forEach((line) => {
          console.log(line.map(cell => "[" + cell.value + "|" + cell.visited + "]").join(" "));
        });
        console.log(data);
        this.grid = data.playerGrid;
        this.remainingBombs = data.remainingBombs;
        this.nextGridSize = data.size;
        this.nextBombAmount = data.nbBombs;
        const grid = document.getElementById("grid");
        grid.style.gridTemplateColumns = `repeat(${this.grid.length}, ${this.cellSize}px)`;
        grid.style.gridTemplateRows = `repeat(${this.grid.length}, ${this.cellSize}px)`;

        for (let row = 0; row < this.grid.length; row++) {
          for (let col = 0; col < this.grid.length; col++) {
            const DOMCell = document.getElementById(
              "cell-" + (row * this.grid.length + col)
            );
            if (DOMCell) {
              console.log(data.playerGrid[row][col]);
              if (data.playerGrid[row][col].value === "F") {
                DOMCell.classList.add("flagged");
              } else if (this.grid[row][col].value === "#") {
                DOMCell.innerText = "";
                DOMCell.classList.remove("revealed");
                DOMCell.classList.remove("flagged");
              } else {
                DOMCell.innerText = this.grid[row][col].value;
                DOMCell.classList.add("revealed");
                DOMCell.classList.remove("flagged");
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

.flagged {
  background-color: red !important;
}
</style>