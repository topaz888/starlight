
import { messageBigInt, brightAndCycleNumber, dataIndex, messageNumber } from "../../models/LedMessage"

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
    cycle2Stream: bigint;

    constructor() {
        this.dataTypeLen = 4;
        this.packageNumber = 0;

        this.modeStream = BigInt(dataIndex.mode);
        this.modeLen = 4;  

        this.cycleStream = BigInt(dataIndex.cycle);
        this.cycleLen = 8;

        this.cycle2Stream = BigInt(dataIndex.cycle2);

        this.delayStream = BigInt(dataIndex.delay);
        this.delayLen = 4;

        this.brightnessStream = BigInt(dataIndex.brightness);
        this.brightnessLen = 8;
    }

    shiftMessage = (index:number, value: messageNumber) => {
        try{
            
            if(value.mode){
                const rawMode = BigInt(value.mode) << BigInt(this.modeLen * index + this.dataTypeLen);
                this.modeStream = this.modeStream | rawMode;
            }

            if(value.cycle){
                const rawCycle = BigInt(value.cycle*10) << BigInt(this.cycleLen * index + this.dataTypeLen);
                this.cycleStream = this.cycleStream | rawCycle;
            }

            if(value.cycle2){
                const rawCycle2 = value.cycle2===null?BigInt(0):BigInt(value.cycle2*10) << BigInt(this.cycleLen * index + this.dataTypeLen);
                this.cycle2Stream = this.cycle2Stream | rawCycle2;
            }

            
            if(value.delay){
                const rawDelay = value.delay===null?BigInt(0):BigInt(value.delay*4) << BigInt(this.delayLen * index + this.dataTypeLen);
                this.delayStream = this.delayStream | rawDelay;
            }

            if(value.brightness){
                const rawbrightness = BigInt(value.brightness) << BigInt(this.brightnessLen * index + this.dataTypeLen);
                this.brightnessStream = this.brightnessStream | rawbrightness;
            }

        //waitTime

        //waitTimeLen
        }catch(e)
        {
            console.log(e);
        }
    }

    
    shiftBrightAndCycle = (index:number, value: brightAndCycleNumber) => {
        try{
            const rawCycle = BigInt(value.cycle*10) << BigInt(this.cycleLen * index + this.dataTypeLen);
            this.cycleStream = this.cycleStream | rawCycle;

            const rawCycle2 = value.cycle===null?BigInt(0):BigInt(value.cycle*10) << BigInt(this.cycleLen * index + this.dataTypeLen);
            this.cycle2Stream = this.cycle2Stream | rawCycle2;

            const rawbrightness = BigInt(value.brightness) << BigInt(this.brightnessLen * index + this.dataTypeLen);
            this.brightnessStream = this.brightnessStream | rawbrightness;
        }catch(e)
        {
            console.log(e);
        }
    }

    getPackageLen = (message: messageNumber) => {
        var length = 0;
        if(message.brightness||message.brightness===0) length++;
        if(message.cycle||message.cycle===0) length++;
        if(message.cycle2||message.cycle2===0) length++;
        if(message.delay||message.delay===0) length++;
        if(message.mode||message.mode===0) length++;
        if(message.waitTime||message.waitTime===0) length++;
        if(message.waitTimeLen||message.waitTimeLen===0) length++;
        return length;
    }

    resetStream = () => {
        this.modeStream = BigInt(dataIndex.mode);
        this.cycleStream = BigInt(dataIndex.cycle);
        this.cycle2Stream = BigInt(dataIndex.cycle2);
        this.delayStream = BigInt(dataIndex.delay);
        this.brightnessStream = BigInt(dataIndex.brightness);
    }

    deserializeWriteData = (records:messageNumber[]) => {
        this.resetStream();
        for (let index in records){
            this.shiftMessage(+index, records[index]);
        }
        this.packageNumber = this.getPackageLen(records[0]);
        const packagHeader = BigInt((this.packageNumber << 1) | 0b0001);

        const ledStaticModeMessage : messageBigInt = {
            mode: (records[0].mode||records[0].mode===0)?((this.modeStream<< BigInt(4)) | packagHeader):null,
            delay: (records[0].delay||records[0].delay===0)?((this.delayStream << BigInt(4)) | packagHeader):null,
            cycle: (records[0].cycle||records[0].cycle===0)?((this.cycleStream << BigInt(4)) | packagHeader):null,
            cycle2: (records[0].cycle2||records[0].cycle2===0)?((this.cycle2Stream << BigInt(4)) | packagHeader):null,
            brightness: (records[0].brightness||records[0].brightness===0)?((this.brightnessStream << BigInt(4)) | packagHeader):null,
            packageLen: this.packageNumber,
        }
        this.packageNumber = 0;
        return ledStaticModeMessage;
    }  

    deserializeReadData = (records:string) => {
        let rawData = +records;
        rawData = rawData << 4;
        return rawData;
    }
}

const ledController = new LedController();
export default ledController;

