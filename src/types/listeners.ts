import WebSocket from 'ws';
import { IncomingMessage } from 'http';

/** Definition of a listener that will be executed when an exception is thrown. */
export type OnErrorListener = (webSocketServer: WebSocket.Server, webSocket: WebSocket, error: Error, request: IncomingMessage) => void;

/** Definition of a listener that will be executed when the client connection is closed. */
export type OnCloseListener = (webSocketServer: WebSocket.Server, webSocket: WebSocket, code: number, reason: Buffer, request: IncomingMessage) => void;

/** Definition of a listener that will be executed whenever the server receives a client message. */
export type OnMessageListener = (webSocketServer: WebSocket.Server, webSocket: WebSocket, data: WebSocket.RawData, isBinary: boolean, request: IncomingMessage) => void;