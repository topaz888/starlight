
import { BigIntLedStaticModeMessage, LedStaticModeMessage, dataIndex } from "../../models/LedMessage"

class LedController {
    cycleStream: bigint;
    cycleLen: number;
    delayStream: bigint;
    delayLen: number;
    brightnessStream: bigint;
    brightnessLen: number;
    dataTypeLen: number;
    packageNumber: number;
    modeStream: bigint;
    modeLen: number;

    constructor() {
        this.dataTypeLen = 4;
        this.packageNumber = 0;

        this.modeStream = BigInt(dataIndex.mode);
        this.modeLen = 4;  

        this.cycleStream = BigInt(dataIndex.cycle);
        this.cycleLen = 8;

        this.delayStream = BigInt(dataIndex.delay);
        this.delayLen = 4;  

        this.brightnessStream = BigInt(dataIndex.brightness);
        this.brightnessLen = 8;
    }

    shiftMessage = (index:number, value: {mode:number, cycle:number, delay:number, brightness: number}) => {
        try{
        const rawMode = BigInt(value.mode) << BigInt(this.modeLen * index + this.dataTypeLen);
        this.modeStream = this.modeStream | rawMode;

        const rawCycle = BigInt(value.cycle*10) << BigInt(this.cycleLen * index + this.dataTypeLen);
        this.cycleStream = this.cycleStream | rawCycle;

        const rawDelay = BigInt(value.delay*4) << BigInt(this.delayLen * index + this.dataTypeLen);
        this.delayStream = this.delayStream | rawDelay;

        const rawbrightness = BigInt(value.brightness) << BigInt(this.brightnessLen * index + this.dataTypeLen);
        this.brightnessStream = this.brightnessStream | rawbrightness;
        }catch(e)
        {
            console.log(e);
        }
    }

    deserializeWriteData = (records:{mode:number, cycle:number, delay:number, brightness: number}[], 
                    ) => {
        this.cycleStream = BigInt(dataIndex.cycle);
        this.delayStream = BigInt(dataIndex.delay);
        this.brightnessStream = BigInt(dataIndex.brightness);
        this.packageNumber = 3;
        for (let index in records){
            this.shiftMessage(+index, records[index])
        }
        const packagHeader = BigInt((this.packageNumber << 1) | 0b0001);
        console.log(packagHeader);
        const ledStaticModeMessage : BigIntLedStaticModeMessage = {delay: ((this.delayStream << BigInt(4)) | packagHeader), 
                                                                cycle: ((this.cycleStream << BigInt(4)) | packagHeader) ,
                                                                brightness: ((this.brightnessStream << BigInt(4)) | packagHeader)}
        this.packageNumber = 0;
        return ledStaticModeMessage;
    }

    deserializeReadData = (records:string, 
        ) => {
        let rawData = +records;
        rawData = rawData << 4;
        return rawData;
    }
}

const ledController = new LedController();
export default ledController;

