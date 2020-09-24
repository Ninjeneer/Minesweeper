import * as socketIo from 'socket.io';

import {v4 as uuidv4} from 'uuid';

export default class Player {
    private static usedColors: string[] = [];
    private uuid: string;
    private pseudo: string;
    private color: string;

    constructor(socket: socketIo.Socket, pseudo: string) {
        this.uuid = socket.id;
        this.pseudo = pseudo;
        
        do {
            this.color = this.generateRandomColor();
        } while (Player.usedColors.includes(this.color));
        Player.usedColors.push(this.color);
    }

    public getUuid() {
        return this.uuid;
    }

    public getPseudo() {
        return this.pseudo;
    }

    private generateRandomColor() {
        const n = (Math.random() * 0xfffff * 1000000).toString(16);
        return '#' + n.slice(0, 6);
      };
}