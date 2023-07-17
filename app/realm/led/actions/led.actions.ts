import {Dispatch } from 'react';
import 'react-native-get-random-values';
import { message, messageNumber, realmData } from '../../../models/LedMessage';
import Realm, { BSON } from 'realm';
import { LedRealmContext } from '..';
import { updateCustomName, updateDefault, updateledBrightness, updateledCycle } from '../../../redux/led/led.reducer';
import DataList from '../models/led.default.data';


export const handleAddLed = async (_modeId: string | null, _message: {mode:number|null, cycle:number|null, cycle2:number|null,
                        delay:number|null, brightness: number|null, waitTime:number|null, waitTimeLen:number|null}[])  => {
            const realm = await Realm.open(LedRealmContext);
            
            var items:any  = realm.objects("LedListRealm").filtered('modeId=$0',_modeId);;
            var ledList: typeof led[] = [];
            for (let index in _message){
                var led =  {
                        ledId: index.toString(), 
                        modeId: _modeId==null?items.length.toString() : _modeId,
                        mode: _message[index]?.mode?.toString()??null,
                        cycle: _message[index]?.cycle?.toString()??null,
                        cycle2: _message[index]?.cycle2?.toString()??null,
                        delay: _message[index]?.delay?.toString()??null, 
                        brightness: _message[index]?.brightness?.toString()??null,
                        waitTime: _message[index]?.waitTime?.toString()??null,
                        waitTimeLen: _message[index]?.waitTime?.toString()??null,
                    }
                ledList.push(led);
            }
            var data = {_id: new BSON.ObjectId(),
                        modeId: _modeId==null?items.length.toString() : _modeId,
                        message: ledList,
                        createdAt: new Date(),
                };
            if(items.length > 0){
                try{
                    realm.write(async () => {
                        console.log("change");
                        var LedRealm = realm.objects("LedRealm");
                        realm.delete(LedRealm.filtered('modeId=$0',_modeId))
                        items[0].message = ledList;
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
                        cycle: _message.cycle?.toString()??null,
                        brightness: _message.brightness?.toString()??null,
                    }
            if(items.length > 0){
                try{
                    realm.write(async () => {
                        console.log("change");
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

export const handleViewAllLeds = async () => {
    const realm = await Realm.open(LedRealmContext);
    let result = realm.objects('LedListRealm').toJSON() as realmData;
    return result
}

export const handleCustomName = async () =>{
    var customName: string[] = [];
    try{
            const data = await handleViewAllLeds() as realmData;
            data.map((item=>customName.push(item?.modeId)));
    }catch(e){
        console.log(e);
        throw new Error("Error: handleCustomName");
    }
    return customName;
}

export const bindListener = async (dispatch:Dispatch<any>) => {
    const realm = await Realm.open(LedRealmContext);
    try{
        realm.addListener("change", async () =>{
            console.log("new change ");
            const data = await handleCustomName();
            dispatch(updateCustomName(data));
        });
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
    var LedRealm = realm.objects("LedRealm");
    realm.write(() => {
        console.log("delete");
        realm.delete(LedRealm.filtered('modeId=$0',modeId))
        realm.delete(LedListRealm.filtered('modeId=$0',modeId))
    })
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
    }else return

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
           dispatch(updateledBrightness(items[0].message.brightness));
           dispatch(updateledCycle(items[0].message.cycle));
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

export const getLedArrayByModeId = async (modeId:string) => {
    const realm = await Realm.open(LedRealmContext);
    var items:any  = realm.objects("PersistLedListRealm").filtered('modeId=$0',modeId);
    try{
        if(items.length>0){
            var item = items[0].ledArray;
            console.log(item);
          return item;
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

export const getMessageByModeId = async (modeId:string) => {
    const realm = await Realm.open(LedRealmContext);
    var items:any  = realm.objects("LedListRealm").filtered('modeId=$0',modeId);
    try{
        if(items.length>0){
            const message = items[0].message as message[];
            var newarray: messageNumber[] = []
            message.map(item=>{
            const data = 
                        {
                            brightness:+item.brightness,
                            cycle:+item.cycle,
                            cycle2:item.cycle2===null?null:+item.cycle2,
                            delay:item.delay===null?null:+item.delay,
                            mode:+item.mode,
                            waitTime:item.waitTime===null?null:+item.waitTime,
                            waitTimeLen:item.waitTimeLen===null?null:+item.waitTimeLen,
                        }
            newarray[+item.ledId] = data;
                        })
                        return newarray;
        }
        else{
            return modeId
        }
    }catch(e)
    {
        console.log(e);
    }
    
}