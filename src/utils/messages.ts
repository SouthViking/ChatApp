import { IncomingMessage } from 'http';
import { BaseMessage, MessageType } from '../types';

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

export const buildMessageBufferFromJson = (data: Record<string, any>) => {
    return Buffer.from(JSON.stringify(data));
};