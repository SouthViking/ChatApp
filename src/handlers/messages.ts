import { MessageType, TextMessage } from "../types";
import { MessageHandler } from "../types/handlers";
import { buildMessageBufferFromJson, sendBroadcastMessage } from "../utils";

export const onUserConnectionHandler: MessageHandler<{}> = (webSocketServer, webSocket, request, data) => {
};

export const onUserTextHandler: MessageHandler<TextMessage> = (webSocketServer, webSocket, request, data) => {
    sendBroadcastMessage(webSocketServer, webSocket, buildMessageBufferFromJson({
        type: MessageType.TEXT,
        from: data.username,
        sentAt: data.sentAt,
        text: data.text,
        timestamp: Date.now(),
    }));
};