// Definition of basic listeners.

import { onUserConnectionHandler } from '../handlers/messages';
import { MessageType, OnCloseListener, OnErrorListener, OnMessageListener } from '../types';
import { buildMessageBufferFromJson, convertTextToJson, getConnectionAddress, isValidMessageObject } from '../utils';

export const onCloseListener: OnCloseListener = (webSocketServer, webSocket, code, reason, request) => {
    const connectionAddress = getConnectionAddress(request);
    console.log(`Client closed the connection. (${connectionAddress})`);
};

export const onErrorListener: OnErrorListener = (webSocketServer, webSocket, error, request) => {
    console.log(`There has been an error: ${error}.`);
};

export const onMessageListener: OnMessageListener = (webSocketServer, webSocket, data, isBinary, request) => {
    const connectionAddress = getConnectionAddress(request);
    console.log(`Data received from client ${connectionAddress}: ${data} (${isBinary ? 'binary' : 'not binary'}).`);

    const convertedData = convertTextToJson(data.toString());
    if (convertedData == null) {
        const errorMessage = buildMessageBufferFromJson({
            error: 'Message must be a valid JSON object.',
            timestamp: Date.now(),
            type: MessageType.ERROR,
        });

        webSocket.send(errorMessage);
        return;
    }

    if (!isValidMessageObject(convertedData)) {
        const errorMessage = buildMessageBufferFromJson({
            error: 'Message format is not valid.',
            timestamp: Date.now(),
            type: MessageType.ERROR,
        });

        webSocket.send(errorMessage);
        return;
    }

    switch (convertedData.type) {
        case MessageType.CONNECTION:
            onUserConnectionHandler(webSocketServer, webSocket, request, convertedData);
            break;
        case MessageType.TEXT:
            break;
    }
};