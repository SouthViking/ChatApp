import { WebSocket } from 'ws';
import { UserData } from './types';
import { generateRandomHexColor } from './utils/misc';

class Storage {
    private users: Record<string, [WebSocket, UserData]>;

    constructor () {
        this.users = {};
    }

    public registerUser(userData: UserData, webSocket: WebSocket) {
        if (this.users[userData.username]) {
            throw new Error(`User with username ${userData.username} has already been registered.`);
        }

        if (userData.avatar === undefined) {
            userData.avatar = { hexColor: generateRandomHexColor() };
        }

        this.users[userData.username] = [webSocket, userData];
    }

    public removeUser(username: string) {
        if (this.users[username]) {
            delete this.users[username];
        }
    }

    public removeUserByWebSocket(webSocket: WebSocket) {
        const usernameToDelete = this.getUsernameFromWebSocket(webSocket);
        usernameToDelete && this.removeUser(usernameToDelete);
    }

    public getUsernameFromWebSocket(webSocket: WebSocket) {
        for (const username in this.users) {
            if (this.users[username][0] === webSocket) {
                return username;
            }
        }

        return null;
    }

    /** Gets the list of registered users excluding the current one if defined.  */
    public getUserList(excludeName?: string): UserData[] {
        const userList = Object.keys(this.users).map(username => ({ ...this.users[username][1] }));

        return excludeName ? userList.filter(userData => userData.username !== excludeName) : userList;
    }

    public getUserData(username: string) {
        if (this.users[username] === undefined) {
            return null;
        }

        return this.users[username][1];
    }

}

export const storage = new Storage();