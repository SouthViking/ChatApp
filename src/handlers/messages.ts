import { storage } from '../storage';
import { ResponseMessageType, UserConnectionMessage, UserTextMessage } from '../types';
import { MessageHandler } from "../types/handlers";
import { buildJsonStringMessage, sendBroadcastMessage } from "../utils";

export const onUserConnectionHandler: MessageHandler<UserConnectionMessage> = (webSocketServer, webSocket, request, data) => {
    const userData = data.userData;

    try {
        data.isConnect ? storage.registerUser(userData, webSocket) : storage.removeUser(userData.username);

        sendBroadcastMessage(webSocketServer, webSocket, buildJsonStringMessage({
            username: userData.username,
            isConnect: data.isConnect,
            // Send the full list of current users to any other current user to update the list in the front.
            userList: storage.getUserList(),
            type: ResponseMessageType.USER_CONNECTION,
        }));
    
        webSocket.send(buildJsonStringMessage({
            success: true,
            type: ResponseMessageType.CONNECTION,
            userData: storage.getUserData(userData.username),
            // Send the list of current users but omit the current one, since this message goes directly to the user connecting.
            userList: storage.getUserList(userData.username),
        }));

    } catch (err) {
        webSocket.send(buildJsonStringMessage({
            success: false,
            type: ResponseMessageType.CONNECTION,
            message: `The username "${userData.username}" has already been taken.`,
        }));
    }
};

export const onUserTextHandler: MessageHandler<UserTextMessage> = (webSocketServer, webSocket, request, data) => {
    sendBroadcastMessage(webSocketServer, webSocket, buildJsonStringMessage({
        type: ResponseMessageType.USER_TEXT,
        from: data.username,
        sentAt: data.sentAt,
        text: data.text,
        timestamp: Date.now(),
    }));
};