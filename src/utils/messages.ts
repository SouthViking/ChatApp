import WebSocket from 'ws';
import { IncomingMessage } from 'http';
import { UserConnectionMessage, UserTextMessage } from '../types';

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

export const isValidTextMessageObject = (object: Record<string, any>): object is UserTextMessage => {
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

export const isValidConnectionMessageObject = (object: Record<string, any>): object is UserConnectionMessage => {
    if (object.username === undefined || typeof object.username !== 'string') {
        return false;
    }
    
    if (object.isConnect === undefined || typeof object.isConnect !== 'boolean') {
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