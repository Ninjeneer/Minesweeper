<template>
  <div id="game" class="container-fluid border">
    <Header :pseudo="this.pseudo" />

    <div class="row">
      <!-- Params -->
      <div class="col-12 col-sm-3 border text-left">
        <Params
          :nextGridSize="this.nextGridSize"
          :nextBombAmount="this.nextBombAmount"
        />
        <Player :players="this.players" />
      </div>
      <div class="col-12 col-sm-9 border p-3">
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
                :style="{ color: cell.player ? cell.player.color : 'black' }"
                :title="cell.player ? cell.player.pseudo : undefined"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MessageBoxManager from "../../utils/MessageBoxManager";
import Header from "./Header";
import Params from "./Params";
import Player from "./Player";

export default {
  name: "Game",
  components: {
    Header,
    Params,
    Player,
  },
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
      nextBombAmount: 0,
    };
  },
  mounted: function () {
    this.$socket.emit("getGrid");
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
  },
  socket: {
    events: {
      players: function (data) {
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
      win: function (data) {
        this.canPlay = false;
        if (data.win) {
          MessageBoxManager.success(
            `<b>${data.player.pseudo}</b> a fait gagner la partie !`
          );
        } else {
          MessageBoxManager.danger(
            `<b>${data.player.pseudo}</b> a fait perdre la partie !`
          );
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
        MessageBoxManager.hide();
      },
      grid: function (data) {
        this.grid = data.playerGrid;
        this.remainingBombs = data.remainingBombs;
        this.nextGridSize = data.size;
        this.nextBombAmount = data.nbBombs;
        this.players = data.players.sort((a, b) =>
          a.score < b.score ? 1 : a.score > b.score ? -1 : 0
        );
        const grid = document.getElementById("grid");
        grid.style.gridTemplateColumns = `repeat(${this.grid.length}, ${this.cellSize}px)`;
        grid.style.gridTemplateRows = `repeat(${this.grid.length}, ${this.cellSize}px)`;

        for (let row = 0; row < this.grid.length; row++) {
          for (let col = 0; col < this.grid.length; col++) {
            const DOMCell = document.getElementById(
              "cell-" + (row * this.grid.length + col)
            );
            if (DOMCell) {
              if (data.playerGrid[row][col].value === "F") {
                DOMCell.classList.add("flagged");
              } else if (this.grid[row][col].value === "#") {
                DOMCell.innerText = "";
                DOMCell.classList.remove("revealed");
                DOMCell.classList.remove("flagged");
              } else {
                DOMCell.innerText =
                  this.grid[row][col].value === "0"
                    ? ""
                    : this.grid[row][col].value;
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
header {
  background-color: royalblue;
  padding: 15px;
  color: white;
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