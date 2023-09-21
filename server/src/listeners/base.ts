// Definition of basic listeners.

import { getConnectionAddress } from '../utils';
import { OnCloseListener, OnErrorListener, OnMessageListener } from '../types';

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

    // TODO: Handle base message logic and separate the flow regarding the specific message.
    webSocket.send(`Data received! (${data})`);
};