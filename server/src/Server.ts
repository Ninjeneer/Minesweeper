import * as express from 'express';
import * as http from 'http';
import * as socketIo from 'socket.io';

import {v4 as uuidv4} from 'uuid';

const cors = require('cors');



export default class Server {
    private app;
    private server: http.Server;
    private io: socketIo.Server;

    private sockets: Map<string, socketIo.Socket> = new Map<string, socketIo.Socket>();

    constructor() {
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
            const socketID = uuidv4();
            this.sockets.set(socketID, socket);
            console.log(`Socket ${socketID} connected !`);
            
            socket.on('message', data => {
                console.log(data);
            });

            socket.on('lol', data => console.log(data));
        })
    }
}