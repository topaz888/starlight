export type LedMessage = {
    messages: messageNumber[];
    deviceId: string | null;
}

export enum dataIndex {
    mode = 0,
    cycle,
    cycle2,
    delay,
    brightness,  
    waitTime,
    waitTimeLen,
}
//realm LedRealm message type
export type message = {
    ledId: string,
    mode: string,
    cycle: string,
    cycle2: string|null,
    delay: string|null, 
    brightness: string,
    waitTime: string|null,
    waitTimeLen: string|null
}

export type messageCheck = {
    modeCheck: boolean|undefined,
    delayCheck: boolean|undefined, 
    brightnessCheck: boolean|undefined,
    cycleCheck: boolean|undefined,
    cycle2Check: boolean|undefined,
    waitTimeCheck: boolean|undefined,
    waitTimeLenCheck: boolean|undefined
}

export type messageNumber = {
    mode: number|null,
    delay: number|null, 
    brightness: number|null,
    cycle: number|null,
    cycle2: number|null,
    waitTime: number|null,
    waitTimeLen: number|null
}

export type messageBigInt = {
    mode: bigint | null;
    delay: bigint | null;
    brightness: bigint | null;
    cycle: bigint | null;
    cycle2: bigint | null;
    waitTime: bigint|null,
    waitTimeLen: bigint|null
    packageLen: number | null;
}

export type ledArrayNumber = {
    modeId: string;
    cycle: number[];
    cycle2: number[];
    brightness: number[];
}

export type ledArray = {
    modeId: string;
    cycle: number[];
    cycle2: number[];
    brightness: number[];
}


export type realmData = {
    _id: string;
    modeId:string;
    message:message[];
    createdAt: Date;
}[]


export type brightAndCycleNumber = {
    brightness: number,
    cycle: number,
}