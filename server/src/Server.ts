import * as express from 'express';
import * as http from 'http';
import * as socketIo from 'socket.io';

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
        this.app.use(function(req, res, next) {
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
                this.broadcast('players', this.players.map(p => p.getPseudo()));
            });

            socket.on('getGrid', () => {
                socket.emit('grid', this.gameController.getGrid());
            });

            socket.on('pick', data => {
                this.gameController.pick(data.row, data.col);
                this.broadcast('grid', this.gameController.getGrid());
            });

            socket.on('reset', () => {
                this.gameController.resetGame(10, 5);
                this.broadcast('grid', this.gameController.getGrid());
            });

            socket.on('getPlayers', () => {
                socket.emit('players', this.players);
            })

            socket.on('disconnect', () => {
                console.log(`Socket ${socket.id} disconnected !`);
                this.sockets.delete(socket.id);
                this.players = this.players.filter(player => player.getUuid() !== socket.id);
                this.broadcast('players', this.players.map(p => p.getPseudo()));
            })
        })
    }

    private broadcast(event: string, ...args: any) {
        this.sockets.forEach(socket => {
            socket.emit(event, ...args);
        })
    }
}