
export enum MessageType {
    CONNECTION,
    TEXT,
    ERROR,
}

export interface BaseMessage {
    type: MessageType;
    timestamp: number;
}