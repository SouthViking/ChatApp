// Definition of basic listeners.

import { onUserDisconnectHandler } from '../handlers/actions';
import { onUserConnectionHandler, onUserTextHandler } from '../handlers/messages';
import { UserMessageType, OnCloseListener, OnErrorListener, OnMessageListener, ResponseMessageType, UserConnectionMessage, UserTextMessage } from '../types';
import { buildJsonStringMessage, convertTextToJson, getConnectionAddress, isValidConnectionMessageObject, isValidTextMessageObject } from '../utils';

export const onCloseListener: OnCloseListener = (webSocketServer, webSocket, code, reason, request) => {
    const connectionAddress = getConnectionAddress(request);
    console.log(`Client closed the connection. (${connectionAddress})`);

    onUserDisconnectHandler(webSocketServer, webSocket, request, { code, reason });
};

export const onErrorListener: OnErrorListener = (webSocketServer, webSocket, error, request) => {
    console.log(`There has been an error: ${error}.`);
};

export const onMessageListener: OnMessageListener = (webSocketServer, webSocket, data, isBinary, request) => {
    const connectionAddress = getConnectionAddress(request);
    console.log(`Data received from client ${connectionAddress}: ${data} (${isBinary ? 'binary' : 'not binary'}).`);

    const convertedData = convertTextToJson(data.toString());
    if (convertedData === null) {
        const errorMessage = buildJsonStringMessage({
            timestamp: Date.now(),
            type: ResponseMessageType.ERROR,
            error: 'The message must be a valid JSON object.',
        });

        webSocket.send(errorMessage);
        return;
    }

    switch (convertedData.type) {
        case UserMessageType.CONNECTION:
            onUserConnectionHandler(webSocketServer, webSocket, request, convertedData as UserConnectionMessage);
            break;

        case UserMessageType.TEXT:
            onUserTextHandler(webSocketServer, webSocket, request, convertedData as UserTextMessage);
            break;

        default:
            webSocket.send(buildJsonStringMessage({
                timestamp: Date.now(),
                type: ResponseMessageType.ERROR,
                error: 'The provided operation is not valid.',
            }));

            break;
    }
};