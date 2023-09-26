import { storage } from '../storage';
import { ResponseMessageType } from '../types';
import { DisconnectHandler } from '../types/handlers';
import { buildJsonStringMessage, sendBroadcastMessage } from '../utils';

export const onUserDisconnectHandler: DisconnectHandler = (webSocketServer, webSocket, request, data) => {
    try {
        const username = storage.getUsernameFromWebSocket(webSocket);
        if (username === null) {
            // The user is not registered, do not notify anything to the front.
            return;
        }

        storage.removeUserByWebSocket(webSocket);

        sendBroadcastMessage(webSocketServer, webSocket, buildJsonStringMessage({
            username,
            isConnect: false,
            userList: storage.getUserList(),
            type: ResponseMessageType.USER_CONNECTION,
        }));

    } catch (error: unknown) {
        console.log(`There has been an internal error in the disconnect handler: ${error}`);
    }
} 