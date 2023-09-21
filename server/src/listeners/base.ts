// Definition of basic listeners.

import { OnCloseListener, OnErrorListener, OnMessageListener } from '../types';

export const onCloseListener: OnCloseListener = (webSocketServer, webSocket, code, reason, request) => {
    const connectionAddress = request.socket.remoteAddress ?? 'Address not available';
    console.log(`Client closed the connection. (${connectionAddress})`);
};

export const onErrorListener: OnErrorListener = (webSocketServer, webSocket, error, request) => {
    console.log(`There has been an error: ${error}.`);
};

export const onMessageListener: OnMessageListener = (webSocketServer, webSocket, data, isBinary, request) => {
    const connectionAddress = request.socket.remoteAddress ?? 'Address not available';
    console.log(`Data received from client ${connectionAddress}: ${data} (${isBinary ? 'binary' : 'not binary'}).`);

    // TODO: Handle base message logic and separate the flow regarding the specific message.
    webSocket.send(`Data received! (${data})`);
};