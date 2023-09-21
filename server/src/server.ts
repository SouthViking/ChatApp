import WebSocket from 'ws';

const webSocketServer = new WebSocket.Server({ port: 8080 });

webSocketServer.on('connection', (webSocket, request) => {
    const connectionAddress = request.socket.remoteAddress ?? 'Address not available';
    console.log(`A new client has been connected (${connectionAddress}). Current clients: ${webSocketServer.clients.size}.`);

    webSocket.on('message', (data) => {
        console.log(`Received message ${data} from client: ${connectionAddress}.`);

        webSocket.send(`Data has been received ${Date.now()}`);
    });

    webSocket.on('close', (code, reason) => {
        console.log(`Client ${connectionAddress} has disconnected.`);
    });

    webSocket.on('error', (error) => {
        console.log(`There has been an error: ${error}.`);
    });
});
