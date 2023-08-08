import {Dispatch } from 'react';
import 'react-native-get-random-values';
import { message, messageNumber, realmData, ledArray } from '../../../models/LedMessage';
import Realm, { BSON } from 'realm';
import { LedRealmContext } from '..';
import { updateCustomNameArray, updateDefault, updatemainScreenledBrightness, updatemainScreenledCycle } from '../../../redux/led/led.reducer';
import DataList from '../models/led.default.data';


export const handleAddLed = async (_modeId: string, _message: {mode:number|null, cycle:number|null, cycle2:number|null,
                        delay:number|null, brightness: number|null, waitTime:number|null, waitTimeLen:number|null}[],
                        )  => {
            const realm = await Realm.open(LedRealmContext);
            
            var items:any  = realm.objects("LedListRealm").filtered('modeId=$0',_modeId?.toString());
            var ledList: typeof led[] = [];

            var min = _message.reduce(
                (accumulator: number[], currentValue) => {
                    return [
                        accumulator[0] = currentValue.brightness? currentValue.brightness < accumulator[0]? currentValue.brightness:accumulator[0] :accumulator[0],
                        accumulator[1] = currentValue.cycle? currentValue.cycle < accumulator[1]? currentValue.cycle:accumulator[1] :currentValue?.mode===0?1:accumulator[1]
                    ];
                }, [200, 200]
            );
            console.log(`${min[0]} ${min[1]}`)
            var minBrightness = min[0]===200? 0: min[0]
            var minCycle = min[1]===200? 0: min[1]
                    
            for (let index in _message){
                var _waitTimeLen = null
                if(_message[index]?.waitTime)
                    if(_message[index]?.mode === 0)
                        _waitTimeLen = Number(0).toFixed()
                    else if(_message[index]?.mode === 1)
                        _waitTimeLen = Number(2).toFixed()
                    else if(_message[index]?.mode === 2)
                        _waitTimeLen = Number(5).toFixed()
                var led =  {
                        ledId: index.toString(), 
                        modeId: _modeId.toString(),
                        mode: _message[index]?.mode?.toString()??"0",
                        cycle: (_message[index]?.mode===0?1:(_message[index]?.cycle?(_message[index]?.cycle??0)/minCycle:0)).toFixed(1),
                        cycle2: _message[index]?.mode===1?((_message[index]?.cycle??0)/minCycle).toFixed(1):null,
                        delay: _message[index]?.delay?.toString()??null, 
                        brightness: (_message[index]?.brightness?(_message[index]?.brightness??0)/minBrightness:0).toFixed(1),
                        waitTime: _message[index]?.waitTime?.toString()??null,
                        waitTimeLen: _waitTimeLen,
                    }
                ledList.push(led);
            }
            var brightAndCycle = {
                modeId:_modeId.toString(),
                cycle: minCycle.toString(),
                brightness: minBrightness.toString(),
            }
            var data = {_id: new BSON.ObjectId(),
                        modeId: _modeId===null?items.length.toString() : _modeId.toString(),
                        message: ledList,
                        BrightAndCycle: brightAndCycle,
                        createdAt: new Date(),
                };
            if(items.length > 0){
                try{
                    realm.write(async () => {
                        console.log("Customchange");
                        var LedArrayRealm = realm.objects("LedArrayRealm");
                        realm.delete(LedArrayRealm.filtered('modeId=$0',_modeId?.toString()))
                        items[0].message = ledList;
                        var LedRealm = realm.objects("LedRealm");
                        realm.delete(LedRealm.filtered('modeId=$0',_modeId?.toString()))
                        items[0].BrightAndCycle = brightAndCycle;
                    });
                    return true;      
                }catch(e){
                    console.log(e)
                }
            }
            else{
                try{
                    realm.write( () => {
                        console.log("write");
                        realm.create('LedListRealm', data);
                    });
                    return true;
                }catch(e){
                    console.log(e);
                }
            }
            return false;
};


export const handlePersistAddLed = async (_modeId: string, _message: {cycle:number,brightness: number})  => {
            const realm = await Realm.open(LedRealmContext);
            
            var items:any  = realm.objects("PersistLedListRealm").filtered('modeId=$0',_modeId);
            var led: { modeId: string, cycle: string, brightness: string};
                led =  {
                        modeId: _modeId,
                        cycle: +_modeId>7?_message.cycle?.toString()??null:Number(1).toFixed(),
                        brightness: _message.brightness?.toString()??"0",
                    }
            if(items.length > 0){
                try{
                    realm.write(async () => {
                        console.log("Persistchange");
                        var LedRealm = realm.objects("PersistLedRealm");
                        realm.delete(LedRealm.filtered('modeId=$0',_modeId));
                        items[0].message = led;
                        items[0].default = false;
                    });
                    return true;   
                }catch(e){
                    console.log(e)
                }
            }
            return false;
};

export const handleCustomAddLed = async (_modeId: string, _message: {cycle:number,brightness: number})  => {
    const realm = await Realm.open(LedRealmContext);
    
    var items:any  = realm.objects("LedListRealm").filtered('modeId=$0',_modeId);
    var led: { modeId: string, cycle: string, brightness: string};
        led =  {
                modeId: _modeId,
                cycle: _message.cycle?.toString()??null,
                brightness: _message.brightness?.toString()??"0",
            }
    if(items.length > 0){
        try{
            realm.write(async () => {
                console.log("Customchange");
                var LedRealm = realm.objects("LedRealm");
                realm.delete(LedRealm.filtered('modeId=$0',_modeId));
                items[0].BrightAndCycle = led;
            });
            return true;   
        }catch(e){
            console.log(e)
        }
    }
    return false;
};

export const handleBacktoDefault = async (index: number) => {
    const realm = await Realm.open(LedRealmContext);
    var items:any = realm.objects("PersistLedListRealm").filtered('modeId=$0',index.toFixed());
    console.log(DataList.staticMode.mode[index].message)
    var led =  {
        modeId: index.toFixed(),
        cycle: DataList.staticMode.mode[index].message?.cycle??1, 
        brightness: DataList.staticMode.mode[index].message?.brightness??100,
    }
    try{
        if(items.length>0){
            realm.write( () => {
                console.log("default change");
                var LedRealm = realm.objects("PersistLedRealm");
                realm.delete(LedRealm.filtered('modeId=$0',index.toFixed()));
                items[0].message = led;
                items[0].default = true;
            })
        }
    }
    catch(e){
        console.log(e);
    }
    
}

export const handleViewAllLeds = async () => {
    const realm = await Realm.open(LedRealmContext);
    let result = realm.objects('LedListRealm').toJSON() as realmData;
    return result
}

export const handleCustomName = async (dispatch:Dispatch<any>) =>{
    var customName: string[] = [];
    try{
            const data = await handleViewAllLeds() as realmData;
            data.map((item=>customName.push(item?.modeId)));
            dispatch(updateCustomNameArray(customName));
    }catch(e){
        console.log(e);
        throw new Error("Error: handleCustomName");
    }
}

export const bindListener = async (dispatch:Dispatch<any>) => {
    const realm = await Realm.open(LedRealmContext);
    var LedListRealm = realm.objects("LedRealm");
    try{
        LedListRealm.addListener(async () =>{
            console.log("listen ");
            await handleCustomName(dispatch);
        });
        await handleCustomName(dispatch);
    }catch(e){
        console.log(e);
        throw new Error("Error: handleListener");
    }
}

export const removeListener = async ()=>{
    const realm = await Realm.open(LedRealmContext);
    console.log("removeListener");
    realm.removeAllListeners();;
}

export const handleRemoveLed = async (modeId: string) => {
    const realm = await Realm.open(LedRealmContext);
    var LedListRealm = realm.objects("LedListRealm");
    var LedArrayRealm = realm.objects("LedArrayRealm");
    var LedRealm = realm.objects("LedRealm");
    
    if(LedListRealm.length>0 && LedArrayRealm.length>0 && LedRealm.length>0){
        realm.write(() => {
            console.log("delete");
            realm.delete(LedRealm.filtered('modeId=$0',modeId))
            realm.delete(LedArrayRealm.filtered('modeId=$0',modeId))
            realm.delete(LedListRealm.filtered('modeId=$0',modeId))
        })
    }
}

export const loadStaticData = async () => {
    const realm = await Realm.open(LedRealmContext);
    var PersistLedListRealm = realm.objects("PersistLedListRealm");
    var PersistLedRealm = realm.objects("PersistLedRealm");
    var PersistLedArrayRealm = realm.objects("PersistLedArrayRealm");

    if(PersistLedListRealm.length<30){
        try{
            realm.write( () => {
                console.log("delete persist");
                realm.delete(PersistLedListRealm);
                realm.delete(PersistLedArrayRealm);
                realm.delete(PersistLedRealm);
            })
        }
        catch(e){
            console.log(e);
        }
    }else return true

    DataList.staticMode.mode.forEach( (obj,modeId) => {
            var led =  {
                    modeId: modeId.toString(),
                    cycle: obj.message?.cycle, 
                    brightness: obj.message?.brightness,
            }

            var ledArray = {
                    modeId: modeId.toString(),
                    brightness: obj.led?.brightness,
                    cycle: obj.led?.cycle,
                    cycle2: obj.led?.cycle2,
            }

            var data = {_id: new BSON.ObjectId(),
                        modeId: modeId.toString(),
                        message: led,
                        ledArray: ledArray,
                        default: true,
                        createdAt: new Date(),
            }
            try{
                realm.write( () => {
                    console.log("write persist");
                    realm.create('PersistLedListRealm', data)
                })
            }
            catch(e){
                console.log(e);
            }
    })
}

export const getStaticMessageByModeId = async (modeId:string, dispatch:Dispatch<any>) => {
    const realm = await Realm.open(LedRealmContext);
    var items:any  = realm.objects("PersistLedListRealm").filtered('modeId=$0',modeId);
    try{
        if(items.length>0){
           dispatch(updatemainScreenledBrightness(items[0].message.brightness));
           dispatch(updatemainScreenledCycle(items[0].message.cycle));
           dispatch(updateDefault(items[0].default));
           return true;
        }
        else{
            throw new Error("getStaticMessageByModeId");
        }
    }catch(e)
    {
        console.log(e);
    }
    return false; 
}

export const getCustomMessageByModeId = async (modeId:string, dispatch:Dispatch<any>) => {
    const realm = await Realm.open(LedRealmContext);
    var items:any  = realm.objects("LedListRealm").filtered('modeId=$0',modeId);
    try{
        if(items.length>0){
           dispatch(updatemainScreenledBrightness(items[0].BrightAndCycle?.brightness??0));
           dispatch(updatemainScreenledCycle(items[0].BrightAndCycle?.cycle??0));
           return true;
        }
        else{
            throw new Error("getCustomMessageByModeId");
        }
    }catch(e)
    {
        console.log(e);
    }
    return false; 
}

export const getStaticPackageByModeId = async (modeId:string) => {
    const realm = await Realm.open(LedRealmContext);
    var ledList:any  = realm.objects("PersistLedListRealm").filtered('modeId=$0',modeId);
    try{
        if(ledList.length>0){
            var ledArray: ledArray = ledList[0].ledArray
            var led = ledList[0].message
            var messages: messageNumber[] = []
            for(let i=0; i<4; i++){
                var temp: messageNumber = {
                    mode: null,
                    delay: null,
                    brightness: ledArray.brightness.length?+ledArray.brightness[i] * led.brightness:null,
                    cycle: ledArray.cycle?.length?+ledArray.cycle[i] * led.cycle:null,
                    cycle2: ledArray.cycle2?.length?+ledArray.cycle2[i] * led.cycle:null,
                    waitTime: null,
                    waitTimeLen: null
                }
                messages.push(temp);
            }
          return messages;
        }
        else{
            throw new Error("getLedArrayByModeId");
        }
    }catch(e)
    {
        console.log(e);
    }
    return []; 
}

export const getCustomPackageByModeId = async (modeId:string) => {
    const realm = await Realm.open(LedRealmContext);
    var ledList:any  = realm.objects("LedListRealm").filtered('modeId=$0',modeId);
    try{
        if(ledList.length>0){
            const message = ledList[0].message as message[];
            const led  = ledList[0].BrightAndCycle;
            var newarray: messageNumber[] = []
            message.map(item=>{
            var tempBrightness = Math.round((item.brightness==="NaN"?0:+item.brightness)*led.brightness??0)
            tempBrightness = tempBrightness > 100? 100: tempBrightness
            var tempCycle = Math.round((item.cycle==="NaN"?0:+item.cycle??0)*led.cycle??0)
            tempCycle = tempCycle > 100? 100: tempCycle
            const data = 
                        {
                            brightness:led.brightness?tempBrightness:null,
                            cycle:led.cycle?tempCycle:null,
                            cycle2:+item.mode===1?tempCycle:null,
                            delay:item.delay===null?null:+item.delay,
                            mode:+item.mode,
                            waitTime:item.waitTime===null?null:+item.waitTime,
                            waitTimeLen:item.waitTimeLen===null?null:+item.waitTimeLen,
                        }
            newarray[+item.ledId] = data;
                        })
                        return newarray;
        }
    }catch(e)
    {
        console.log(e);
    }
    return []
    
}