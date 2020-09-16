import * as WebSocket from 'ws';
import * as express from 'express';
import * as http from 'http';

import {v4 as uuidv4} from 'uuid';

export default class Server {
    private app: Express.Application;
    private server: http.Server;
    private wss: WebSocket.Server;

    private sockets: Map<string, WebSocket> = new Map<string, WebSocket>();

    constructor() {
        this.app = express();
        const server = http.createServer(this.app);
        this.server = server;
        this.wss = new WebSocket.Server({ server });

        this.startWebsocket();
    }

    public startServer(port: number) {
        this.server.listen(port, () => {
            console.log(`Minesweeper Server started on port ${port}`);
        });
    }

    private startWebsocket() {
        this.wss.on('connection', socket => {
            const socketID = uuidv4();
            this.sockets.set(socketID, socket);
            console.log(`Socket ${socketID} connected !`);
            
            socket.on('message', data => {
                console.log(data);
            })
        })
    }
}