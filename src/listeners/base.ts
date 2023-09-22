// Definition of basic listeners.

import { onUserConnectionHandler, onUserTextHandler } from '../handlers/messages';
import { MessageType, OnCloseListener, OnErrorListener, OnMessageListener } from '../types';
import { buildJsonStringMessage, convertTextToJson, getConnectionAddress, isValidConnectionMessageObject, isValidMessageObject, isValidTextMessageObject } from '../utils';

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
        const errorMessage = buildJsonStringMessage({
            error: 'Message must be a valid JSON object.',
            timestamp: Date.now(),
            type: MessageType.ERROR,
        });

        webSocket.send(errorMessage);
        return;
    }

    if (!isValidMessageObject(convertedData)) {
        webSocket.send(JSON.stringify({
            error: 'Message format is not valid.',
            timestamp: Date.now(),
            type: MessageType.ERROR,
        }));
        return;
    }

    if (convertedData.type === MessageType.TEXT) {
        if (!isValidTextMessageObject(convertedData)) {
            const errorMessage = buildJsonStringMessage({
                error: 'Text message is not valid.',
                timestamp: Date.now(),
                type: MessageType.ERROR,
            });
    
            webSocket.send(errorMessage);
            return;
        }

        onUserTextHandler(webSocketServer, webSocket, request, convertedData);
    
    } else if (convertedData.type === MessageType.CONNECTION) {
        if (!isValidConnectionMessageObject(convertedData)) {
            const errorMessage = buildJsonStringMessage({
                error: 'Connection message is not valid.',
                timestamp: Date.now(),
                type: MessageType.ERROR,
            });
    
            webSocket.send(errorMessage);
            return;
        }

        onUserConnectionHandler(webSocketServer, webSocket, request, convertedData);
    }
};