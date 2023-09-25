import { WebSocket } from 'ws';

export interface UserData {
    username: string;
}

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

    /** Gets the list of registered users excluding the current one if defined.  */
    public getUserList(excludeName?: string): UserData[] {
        const userList = Object.keys(this.users).map(username => ({ username }));

        return excludeName ? userList.filter(userData => userData.username !== excludeName) : userList;
    }

}

export const storage = new Storage();