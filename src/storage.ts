import { WebSocket } from 'ws';
import { UserData } from './types';

class Storage {
    private users: Record<string, [WebSocket, UserData]>;

    constructor () {
        this.users = {};
    }

    public registerUser(userData: UserData, webSocket: WebSocket) {
        if (this.users[userData.username]) {
            throw new Error(`User with username ${userData.username} has already been registered.`);
        }

        this.users[userData.username] = [webSocket, userData];
    }

    public removeUser(username: string) {
        if (this.users[username]) {
            delete this.users[username];
        }
    }

    /** Gets the list of registered users excluding the current one if defined.  */
    public getUserList(excludeName?: string): UserData[] {
        const userList = Object.keys(this.users).map(username => ({ ...this.users[username][1] }));

        return excludeName ? userList.filter(userData => userData.username !== excludeName) : userList;
    }

}

export const storage = new Storage();