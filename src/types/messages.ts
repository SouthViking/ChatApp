
export enum MessageType {
    CONNECTION,
    TEXT,
    ERROR,
}

export interface BaseMessage {
    type: MessageType;
    timestamp: number;
}

export interface TextMessage extends BaseMessage {
    type: MessageType.TEXT;
    username: string;
    text: string;
    sentAt: number;
}