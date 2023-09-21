import WebSocket from 'ws';
import { IncomingMessage } from 'http';
import { BaseMessage, ConnectionMessage, MessageType, TextMessage } from '../types';

export const getConnectionAddress = (request: IncomingMessage, isProductionEnv: boolean = false): string => {  
    if (isProductionEnv) {
        // In a production environment using Nginx, the IP has to be fetched from the request header.
        return (request.headers['x-forwarded-for'] as string).split(',')[0].trim();
    }

    if (request.socket.remoteAddress == undefined) {
        return 'Address not available';
    }

    if (request.socket.remotePort === undefined) {
        return request.socket.remoteAddress;
    }

    return `${request.socket.remoteAddress}:${request.socket.remotePort}`;
};

export const convertTextToJson = (text: string): Record<string, any> | null  => {
    try {
        const json = JSON.parse(text);
        return json;
    } catch (e) {
        return null;
    }
};

export const isValidMessageObject = (object: Record<string, any>): object is BaseMessage => {
    if (object.timestamp === undefined || typeof object.timestamp !== 'number') {
        return false;
    }

    if (object.type === undefined || typeof object.type !== 'number' || !(object.type in MessageType)) {
        return false;
    }

    return true;
};

export const isValidTextMessageObject = (object: Record<string, any>): object is TextMessage => {
    if (object.username === undefined || typeof object.username !== 'string') {
        return false;
    }
    if (object.text === undefined || typeof object.text !== 'string') {
        return false;
    }

    if (object.sentAt === undefined || typeof object.sentAt !== 'number') {
        return false;
    }

    return true;
};

export const isValidConnectionMessageObject = (object: Record<string, any>): object is ConnectionMessage => {
    if (object.username === undefined || typeof object.username !== 'string') {
        return false;
    }
    
    return true;
};

export const buildJsonStringMessage = (data: Record<string, any>) => {
    return JSON.stringify(data);
};

export const sendBroadcastMessage = (webSocketServer: WebSocket.Server, webSocket: WebSocket, message: string) => {
    webSocketServer.clients.forEach((client) => {
        if (client !== webSocket && client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
};