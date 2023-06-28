import React, {useCallback, useMemo, useState} from 'react';
import 'react-native-get-random-values';
import { LedStaticModeMessage, realmData } from '../../../models/LedMessage';
import { BSON } from 'realm';
import { realm } from '..';
import { useDispatch } from 'react-redux';
import { throttle } from 'redux-saga/effects';
import { updateCustomName } from '../../../redux/led/led.reducer';


export function handleAddLed (_modeId: string | null, _message: {mode:number, cycle:number, 
                                delay:number, brightness: number, waitTime:number, waitTimeLen:number}[]) {
        realm.then((realm)=> {
            var ledStorage = realm.objects("LedListRealm");
            var items: any = ledStorage.filtered('modeId=$0',_modeId);
            var led: { ledId: string, modeId: string, mode: string, 
                cycle: string, delay: string, brightness: string,
                    waitTime:string, waitTimeLen:string };
            var ledList: typeof led[] = [];
            for (let index in _message){
                led =  {
                        ledId: index.toString(), 
                        modeId: _modeId==null?items.length.toString() : _modeId,
                        mode: _message[index]?.mode?.toString()??null,
                        cycle: _message[index]?.cycle?.toString()??null, 
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
                }
            if(items.length > 0){
                realm.write(() => {
                    console.log("change");
                    items[0].message = ledList;
                  });               
            }
            else
            realm.write(() => {
                console.log("write");
                realm.create('LedListRealm', data)});
            });
}
export const handleViewAllLeds = async () => {
    let result = (await realm).objects('LedListRealm').toJSON() as realmData;
    return result
}

export const handleListener = async () => {
    var customName: string[] = [];
    try{
        const data = await handleViewAllLeds() as realmData;
        data.map((item=>customName.push(item?.modeId)))
        useDispatch()(updateCustomName(customName));
    }catch(e){
        console.log(e);
        throw new Error("handleListener");
    }
    // console.log(data);
    
    // (await realm).addListener('change', () => {
    //     useDispatch(updateCustomName());
    // });
}

export const handleRemoveLed = (modeId: string) => {
    if (!modeId) {
    return;
    }
    realm.then((realm)=> {
        var LedListRealm = realm.objects("LedListRealm");
        var LedRealm = realm.objects("LedRealm");
        realm.write(() => {
            console.log("delete");
            realm.delete(LedRealm.filtered('modeId=$0',modeId))
            realm.delete(LedListRealm.filtered('modeId=$0',modeId))
        })
    })
}