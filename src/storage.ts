import { WebSocket } from 'ws';

class Storage {
    private users: Record<string, WebSocket>;

    constructor () {
        this.users = {};
    }

    public registerUser(username: string, webSocket: WebSocket) {
        if (this.users[username]) {
            throw new Error(`User with username ${username} has already been registered.`);
        }

        this.users[username] = webSocket;
    }

    public removeUser(username: string) {
        if (this.users[username]) {
            delete this.users[username];
        }
    }

}

export const storage = new Storage();