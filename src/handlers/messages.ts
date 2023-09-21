import { ConnectionMessage, MessageType, TextMessage } from "../types";
import { MessageHandler } from "../types/handlers";
import { buildJsonStringMessage, sendBroadcastMessage } from "../utils";

export const onUserConnectionHandler: MessageHandler<ConnectionMessage> = (webSocketServer, webSocket, request, data) => {
    sendBroadcastMessage(webSocketServer, webSocket, buildJsonStringMessage({
        type: MessageType.NOTIFICATION,
        text: `${data.username} has joined the chat room!`,
    }));
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