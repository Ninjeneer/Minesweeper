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
            <div id="messagebox" class="alert">Partie gagnée</div>
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
                v-on:contextmenu="flag(index)"
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
      remainingBombs: 0
    };
  },
  mounted: function () {
    this.$socket.emit("getGrid");
    MessageBoxManager.init();
  },
  methods: {
    pickCell: function (cellNumber) {
      console.log('pick')
      if (!this.canPlay) {
        return;
      }
      const row = Math.floor(cellNumber / this.grid.length) + 1;
      const col = (cellNumber % this.grid.length) + 1;

      this.$socket.emit("pick", { row, col });
    },
    flag: function(cellNumber) {
      console.log('flag');
      const row = Math.floor(cellNumber / this.grid.length) + 1;
      const col = (cellNumber % this.grid.length) + 1;

      this.$socket.emit("flag", { row, col });
    },
    resetGame: function () {
      const answer = confirm("Voulez-vous vraiment réinitialiser la partie ?");
      if (answer) {
        this.$socket.emit("reset");
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
      grid: function (data) {
        data.playerGrid.forEach(line => {
          console.log(line.join(' '));
        })
        this.grid = data.grid;
        this.remainingBombs = data.remainingBombs;
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
              } else if(!this.grid[row][col].visited) {
                DOMCell.innerText = "";
                DOMCell.classList.remove("revealed");
              } else if (data.playerGrid[row][col] === 'F') {
                DOMCell.classList.add("flagged");
                DOMCell.classList.remove("revealed");
                DOMCell.innerText = "";
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
  background-color: red;
}
</style>