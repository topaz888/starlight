import React, {useCallback, useMemo} from 'react';
import 'react-native-get-random-values';
import { LedStaticModeMessage } from '../../../models/LedMessage';
import Realm, { BSON } from 'realm';
import { LEDLISTREALM, LEDREALM } from '../models/led.models';
import { realm } from '..';

export function handleAddLed (_modeId: string, _message: {cycle:number, delay:number, brightness: number}[]) {
        realm.then((realm)=> {
            var ledStorage = realm.objects("PersistLedListRealm");
            var items: any = ledStorage.filtered('modeId=$0',_modeId);
            var led: { id: string; cycle: string; delay: string; brightness: string; };
            var ledList: typeof led[] = [];
            for (let index in _message){
                led =  {id: index.toString(), 
                        cycle: _message[index]?.cycle?.toString()??0, 
                        delay: _message[index]?.delay?.toString()??0, 
                        brightness: _message[index]?.brightness?.toString()??0,
                    }
                ledList.push(led);
            }
            var data = {_id: new BSON.ObjectId(),
                        modeId: _modeId,
                        message: ledList,
                        createdAt: new Date(),
                }
            if(items.length > 0){
                realm.write(() => {
                    items[0].message = ledList;
                  });               
            }
            else
            realm.write(() => {
                console.log("Persist write");
                realm.create('PersistLedListRealm', data)});
            });

}


function deleteAllData()  {
    realm.then((realm)=> {
        realm.write(() => {
            realm.delete('PersistLedListRealm');
        });
    })
  };