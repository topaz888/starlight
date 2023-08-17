
import { messageBigInt, dataIndex, messageNumber, messageCheck } from "../../models/LedMessage"

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
    waitTimeStream: bigint;
    waitTimelen: number;
    waitTimeLenStream: bigint;
    waitTimeLenlen: number;

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

        this.waitTimeStream = BigInt(dataIndex.waitTime);
        this.waitTimelen = 8;

        this.waitTimeLenStream = BigInt(dataIndex.waitTimeLen);
        this.waitTimeLenlen = 4;
    }

    //Serialize data, if it is null then ignore.
    shiftMessage = (index:number, value: messageNumber) => {
        try{
            
            if(value.mode){
                const rawMode = BigInt(value.mode) << BigInt(this.modeLen * index + this.dataTypeLen);
                this.modeStream = this.modeStream | rawMode;
            }

            if(value.cycle){
                const rawCycle = BigInt(value.cycle) << BigInt(this.cycleLen * index + this.dataTypeLen);
                this.cycleStream = this.cycleStream | rawCycle;
            }

            if(value.cycle2){
                const rawCycle2 = value.cycle2===null?BigInt(0):BigInt(value.cycle2) << BigInt(this.cycleLen * index + this.dataTypeLen);
                this.cycle2Stream = this.cycle2Stream | rawCycle2;
            }

            
            if(value.delay){
                const rawDelay = value.delay===null?BigInt(0):BigInt(value.delay) << BigInt(this.delayLen * index + this.dataTypeLen);
                this.delayStream = this.delayStream | rawDelay;
            }

            if(value.brightness){
                const rawbrightness = BigInt(value.brightness) << BigInt(this.brightnessLen * index + this.dataTypeLen);
                this.brightnessStream = this.brightnessStream | rawbrightness;
            }

            if(value.waitTime){
                const rawWaitTime = BigInt(value.waitTime) << BigInt(this.waitTimelen * index + this.dataTypeLen);
                this.waitTimeStream = this.waitTimeStream | rawWaitTime;
            }

            if(value.waitTimeLen){
                const rawWaitTimeLen = BigInt(value.waitTimeLen) << BigInt(this.waitTimeLenlen * index + this.dataTypeLen);
                this.waitTimeLenStream = this.waitTimeLenStream | rawWaitTimeLen;
            }
        }catch(e)
        {
            console.log(e);
        }
    }


    getPackageLen = (message: messageCheck) => {
        var length = 0;
        if(message.brightnessCheck) length++;
        if(message.cycleCheck) length++;
        if(message.cycle2Check) length++;
        if(message.delayCheck) length++;
        if(message.modeCheck) length++;
        if(message.waitTimeCheck) length++;
        if(message.waitTimeLenCheck) length++;
        return length;
    }

    resetStream = () => {
        this.modeStream = BigInt(dataIndex.mode);
        this.cycleStream = BigInt(dataIndex.cycle);
        this.cycle2Stream = BigInt(dataIndex.cycle2);
        this.delayStream = BigInt(dataIndex.delay);
        this.brightnessStream = BigInt(dataIndex.brightness);
        this.waitTimeStream = BigInt(dataIndex.waitTime);
        this.waitTimeLenStream = BigInt(dataIndex.waitTimeLen);
    }

    deserializeWriteData = (records:messageNumber[]) => {
        this.resetStream();
        var modeCheck;
        var delayCheck;
        var cycleCheck;
        var cycle2Check;
        var brightnessCheck;
        var waitTimeCheck;
        for (let index in records){
            if(records[index]){
                this.shiftMessage(+index, records[index]);
                modeCheck = (records[index]?.mode || records[index]?.mode === 0 || modeCheck) ? true : false
                delayCheck = (records[index]?.delay || delayCheck) ? true : false
                cycleCheck = (records[index]?.cycle || records[index]?.cycle === 0 || cycleCheck) ? true: false
                cycle2Check = (records[index]?.cycle2 || cycle2Check) ? true: false
                brightnessCheck = (records[index]?.brightness || records[index]?.brightness === 0 || brightnessCheck) ? true : false
                waitTimeCheck = (records[index]?.waitTime || records[index]?.waitTime === 0 || waitTimeCheck) ? true : false
            }
        }
        var messageCheck: messageCheck = {
            modeCheck: modeCheck,
            delayCheck: delayCheck,
            brightnessCheck: brightnessCheck,
            cycleCheck: cycleCheck,
            cycle2Check: cycle2Check,
            waitTimeCheck: waitTimeCheck,
            waitTimeLenCheck: waitTimeCheck
        }
        if(this.packageNumber===0)
            this.packageNumber = this.getPackageLen(messageCheck);
        const packagHeader = BigInt((this.packageNumber << 1) | 0b0001);
        const ledStaticModeMessage : messageBigInt = {
                mode: (modeCheck) ? ((this.modeStream << BigInt(4)) | packagHeader) : null,
                delay: (delayCheck) ? ((this.delayStream << BigInt(4)) | packagHeader) : null,
                cycle: (cycleCheck) ? ((this.cycleStream << BigInt(4)) | packagHeader) : null,
                cycle2: (cycle2Check) ? ((this.cycle2Stream << BigInt(4)) | packagHeader) : null,
                brightness: (brightnessCheck) ? ((this.brightnessStream << BigInt(4)) | packagHeader) : null,
                waitTime: (waitTimeCheck) ? ((this.waitTimeStream << BigInt(4)) | packagHeader) : null,
                waitTimeLen: (waitTimeCheck) ?((this.waitTimeLenStream << BigInt(4)) | packagHeader):null,
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

