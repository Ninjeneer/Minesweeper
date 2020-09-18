import * as socketIo from 'socket.io';

import {v4 as uuidv4} from 'uuid';

export default class Player {
    private socket: socketIo.Socket;
    private uuid: string;
    private pseudo: string;

    constructor(socket: socketIo.Socket, pseudo: string) {
        this.socket = socket;
        this.uuid = socket.id;
        this.pseudo = pseudo;
    }

    public getSocket() {
        return this.socket;
    }

    public getUuid() {
        return this.uuid;
    }

    public getPseudo() {
        return this.pseudo;
    }
}