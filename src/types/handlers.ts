import WebSocket from 'ws';
import { IncomingMessage } from 'http';

export type MessageHandler<T> = (webSocketServer: WebSocket.Server, webSocket: WebSocket, request: IncomingMessage, data: T) => void;