import { storage } from '../storage';
import { MessageHandler } from "../types/handlers";
import { ConnectionMessage, MessageType, TextMessage } from "../types";
import { buildJsonStringMessage, sendBroadcastMessage } from "../utils";

export const onUserConnectionHandler: MessageHandler<ConnectionMessage> = (webSocketServer, webSocket, request, data) => {
    try {
        storage.registerUser(data.username, webSocket);

        sendBroadcastMessage(webSocketServer, webSocket, buildJsonStringMessage({
            type: MessageType.NOTIFICATION,
            text: `${data.username} has joined the chat room!`,
        }));
    
        webSocket.send(buildJsonStringMessage({
            success: true,
            type: MessageType.CONNECTION,
            message: `Welcome to the chat room, ${data.username}!`,
        }));

    } catch (err) {
        webSocket.send(buildJsonStringMessage({
            success: false,
            type: MessageType.CONNECTION,
            message: `The username "${data.username}" has already been taken.`,
        }));
    }
};

export const onUserTextHandler: MessageHandler<TextMessage> = (webSocketServer, webSocket, request, data) => {
    sendBroadcastMessage(webSocketServer, webSocket, buildJsonStringMessage({
        type: MessageType.TEXT,
        from: data.username,
        sentAt: data.sentAt,
        text: data.text,
        timestamp: Date.now(),
    }));
};