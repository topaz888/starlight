export type LedUserDefinedMessage = {
    mode: string;
    delay: number;
    brightness: number;
    cycle: number;
    waitingTime: number;
    length: number;
}

export type LedStaticModeMessage = {
    delay: number;
    cycle: number;
    brightness: number;
}

export type BigIntLedStaticModeMessage = {
    delay: bigint;
    cycle: bigint;
    brightness: bigint;
}

export type LedMessage = {
    message: Record<number, LedStaticModeMessage>;
    deviceId: string | null;
}

export enum dataIndex {
    mode = 0,
    cycle,
    delay,
    brightness,  
    waitTime,
    waitTimeLen,
}

export type message = {
    brightness: string,
    cycle: string, 
    delay: string, 
    ledId: string,
    mode: string,
    waitTime: string,
    waitTimeLen: string
}

export type realmData = {
    _id: string;
    modeId:string;
    message:message[];
    createdAt: Date;
}[]
