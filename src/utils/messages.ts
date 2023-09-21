import { IncomingMessage } from 'http';

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