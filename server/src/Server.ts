import * as express from 'express';
import * as http from 'http';
import * as socketIo from 'socket.io';

import MineSweeper, { GameState } from './Minesweeper';

import GameController from './GameController';
import Player from './Player';

const cors = require('cors');

export default class Server {
    private app;
    private server: http.Server;
    private io: socketIo.Server;
    private gameController: GameController;

    private sockets: Map<string, socketIo.Socket> = new Map<string, socketIo.Socket>();
    private players: Player[] = [];

    constructor(gameController: GameController) {
        this.gameController = gameController;
        this.app = express();
        this.app.use(cors());
        this.app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "http://localhost:8080"); // update to match the domain you will make the request from
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header("Access-Control-Allow-Credentials", "true");
            next();
        });
        const server = http.createServer(this.app);
        this.server = server;
        this.io = socketIo(this.server, {
            serveClient: false,
            pingInterval: 25000,
            pingTimeout: 10000
        });

        this.startWebsocket();
    }

    public startServer(port: number) {
        this.server.listen(port, () => {
            console.log(`Minesweeper Server started on port ${port}`);
        });
    }

    private startWebsocket() {
        this.io.on('connection', socket => {
            this.sockets.set(socket.id, socket);
            console.log(`Socket ${socket.id} connected !`);

            socket.on('register', data => {
                const player = new Player(socket, data);
                this.players.push(player);
                console.log(`Player ${player.getPseudo()} registered !`)
                this.broadcast('players', {
                    players: this.players.map(p => p.getPseudo()),
                    pseudo: player.getPseudo(),
                    type: 'connect'
                });
            });

            socket.on('getGrid', () => {
                socket.emit('grid', this.buildGridPayload());
            });

            socket.on('pick', data => {
                const pick = this.gameController.pick(data.row, data.col);
                if (pick === GameState.LOST) {
                    this.broadcast('win', false);
                } else if (pick === GameState.WIN) {
                    this.broadcast('win', true);
                }
                this.broadcast('grid', this.buildGridPayload());
            });

            socket.on('flag', data => {
                this.gameController.flag(data.row, data.col);
                this.broadcast('grid', this.buildGridPayload());
                this.gameController.displayGrid();
            })

            socket.on('reset', data => {
                console.log(JSON.stringify(data));
                this.gameController.resetGame(+data.size, +data.nbBombs);
                this.broadcast('grid', this.buildGridPayload());
                this.broadcast('reset');
            });

            socket.on('getPlayers', () => {
                socket.emit('players', this.players);
            })

            socket.on('disconnect', () => {
                console.log(`Socket ${socket.id} disconnected !`);
                this.sockets.delete(socket.id);
                const player = this.players.find(p => p.getUuid() === socket.id);
                this.players = this.players.filter(player => player.getUuid() !== socket.id);
                this.broadcast('players', {
                    players: this.players.map(p => p.getPseudo()),
                    pseudo: player ? player.getPseudo() : 'Un joueur',
                    type: 'disconnect'
                });
            })
        })
    }

    private broadcast(event: string, ...args: any) {
        this.sockets.forEach(socket => {
            socket.emit(event, ...args);
        })
    }

    private buildGridPayload() {
        return {
            playerGrid: this.gameController.getPlayerGrid(),
            remainingBombs: this.gameController.getRemainingBombs(),
            size: this.gameController.getGameProps().size,
            nbBombs: this.gameController.getGameProps().nbBombs
        };
    }
}