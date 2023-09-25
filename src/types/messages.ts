import { UserData } from './user';

export enum UserMessageType {
    CONNECTION,
    TEXT,
}

export enum ResponseMessageType {
    CONNECTION,
    USER_TEXT,
    USER_CONNECTION,
    ERROR,
}

export interface UserConnectionMessage {
    userData: UserData;
    isConnect: boolean;
    type: UserMessageType.CONNECTION;
}

export interface UserTextMessage {
    text: string;
    sentAt: number;
    username: string;
    type: UserMessageType.TEXT;
}