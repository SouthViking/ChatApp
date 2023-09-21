import WebSocket from 'ws';
import { onCloseListener, onErrorListener, onMessageListener } from './listeners';

const webSocketServer = new WebSocket.Server({ port: 8080 });

webSocketServer.on('connection', (webSocket, request) => {
    const connectionAddress = request.socket.remoteAddress ?? 'Address not available';
    console.log(`A new client has been connected (${connectionAddress}). Current clients: ${webSocketServer.clients.size}.`);

    webSocket.on('close', (code, reason) => onCloseListener(webSocketServer, webSocket, code, reason, request));
    webSocket.on('error', (error) => onErrorListener(webSocketServer, webSocket, error, request));
    webSocket.on('message', (data, isBinary) => onMessageListener(webSocketServer, webSocket, data, isBinary, request));
});
