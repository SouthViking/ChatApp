import { storage } from '../storage';
import { ResponseMessageType, UserConnectionMessage, UserTextMessage } from '../types';
import { MessageHandler } from "../types/handlers";
import { buildJsonStringMessage, sendBroadcastMessage } from "../utils";

export const onUserConnectionHandler: MessageHandler<UserConnectionMessage> = (webSocketServer, webSocket, request, data) => {
    try {
        data.isConnect ? storage.registerUser(data.username, webSocket) : storage.removeUser(data.username);

        sendBroadcastMessage(webSocketServer, webSocket, buildJsonStringMessage({
            username: data.username,
            isConnect: data.isConnect,
            type: ResponseMessageType.USER_CONNECTION,
        }));
    
        webSocket.send(buildJsonStringMessage({
            success: true,
            type: ResponseMessageType.CONNECTION,
        }));

    } catch (err) {
        webSocket.send(buildJsonStringMessage({
            success: false,
            type: ResponseMessageType.CONNECTION,
            message: `The username "${data.username}" has already been taken.`,
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