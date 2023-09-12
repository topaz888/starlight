import { call, delay, put, select, take, takeEvery } from "redux-saga/effects";
import { bluetoothActionConstants } from "./bluetooth.reducer";
import { AnyAction } from "@reduxjs/toolkit";
import { TakeableChannel, eventChannel } from "redux-saga";
import bluetoothLeManager from "./BluetoothManager";
import {BluetoothPeripheral, Message} from '../../models/BluetoothPeripheral'
import { getTimerFlag } from "../store";
import { Platform } from "react-native";

function* watchForPeripherals(): Generator<AnyAction, void, any> {
  const isPermissionsEnabled: boolean = yield call(bluetoothLeManager.requestPermissions);
  yield put({
    type: bluetoothActionConstants.REQUEST_PERMISSIONS,
    payload:isPermissionsEnabled
  })
  const isEnabled: boolean = yield call(bluetoothLeManager.getBluetoothState);
  yield put({
    type: bluetoothActionConstants.REQUEST_BLUETOOTH,
    payload:isEnabled
  })
  if(isPermissionsEnabled && isEnabled){
      const onDiscoveredPeripheral = () => eventChannel(emitter => {
        return bluetoothLeManager.scanForPeripherals(emitter);
      });
      const channel: TakeableChannel<unknown> = yield call(onDiscoveredPeripheral);
      try {
        while (true) {
          const response = yield take(channel);
          yield put({
            type: bluetoothActionConstants.ON_DEVICE_DISCOVERED,
            payload: {
              id: response.payload.id,
              name: response.payload.name,
              serviceUUIDs: response.payload.serviceUUIDs,
            },
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
}
//refresh the list of bluetooth, only work well on android 
function* refreshTimer():Generator<AnyAction, void, any> {
  if (Platform.OS === "android"){
    while (true) {
        yield delay(5000);
        var timerFlag = yield select(getTimerFlag);
        if(timerFlag){
          return;
        }
        yield put({type: bluetoothActionConstants.REFRESH_FOR_PERIPHERALS});
    }
  }
}

function* connectToPeripheral(action: {
  type: typeof bluetoothActionConstants.INITIATE_CONNECTION,
  payload: BluetoothPeripheral,
}) {
  const peripheral = action.payload;
  yield call(bluetoothLeManager.connectToPeripheral, peripheral.id);
  yield call(bluetoothLeManager.setIosUUID, peripheral.id, peripheral.name);
  yield put({
    type: bluetoothActionConstants.CONNECTION_SUCCESS,
    payload: peripheral,
  });
  yield put({
    type: bluetoothActionConstants.START_RECEIVE_MESSAGE,
  });
  var result:boolean = yield call(bluetoothLeManager.isbonded, peripheral.id);
  if(!result){
    yield put({
      type: bluetoothActionConstants.DISPLAY_LOADING,
      payload: true,
    });
  }
  yield call(bluetoothLeManager.stopScanningForPeripherals);
  yield handleBleUnknownDisconnect(peripheral.id)
}

//subscribe a listener to connection channel
function* handleBleUnknownDisconnect(identifier:string): Generator<any, void, any> {
  const listener = yield eventChannel(emitter => {
    const  subscription = bluetoothLeManager.addConnectListener(identifier, emitter);
    return () => {
      subscription?.remove();
   }
  });
  try {
    while (true) {
      const result = yield take(listener);
      if(result){
        yield put({
          type: bluetoothActionConstants.DISCONNECTION_PERIPHERAL,
          payload: identifier
      })
        console.log("handleBleUnknownDisconnect disconnect ", identifier)
        listener.close();
      }
    }
  }catch(e){
    console.log(e)
  }
}

//get transmission data from bluetooth manager
function* getMessage(): Generator<any, void, any> {
  const onListenMessage = yield eventChannel( emitter => {
      const subscription = bluetoothLeManager.startStreamingData(emitter)
      return () => {
        subscription.then(i=>i?.remove())
      };
    });
  try {
      while(true){
        const response = yield take(onListenMessage);
        yield put({
          type: bluetoothActionConstants.UPDATE_RECEIVE_MESSAGE,
          payload: response.payload,
        });
      }
  } catch (e) {
    console.log(e);
  }
}

//actively disconnect bluetooth
function* disconnectToPeripheral(action:{
  type: typeof bluetoothActionConstants.DISCONNECTION_PERIPHERAL,
  payload: string,
}){
  yield call(bluetoothLeManager.disconnectToPeripheral, action.payload);
  yield put({
    type: bluetoothActionConstants.DISCONNECTION_SUCCESSS,
  })
}

//send data to bluetooth manager => next step is transferring data
function* setMessage(action: {
  type: typeof bluetoothActionConstants.SEND_MESSAGE,
  payload: Message,
}) {
  yield call(bluetoothLeManager.sendSignal, action.payload);
}


//check the bondede devices and try to connect the first starlight device if it is available
function* autoBlueToothPair() {
  const isPermissionsEnabled: boolean = yield call(bluetoothLeManager.requestPermissions);
  yield put({
    type: bluetoothActionConstants.REQUEST_PERMISSIONS,
    payload:isPermissionsEnabled
  })
  if(isPermissionsEnabled){
    var peripherals:any[] = yield call(bluetoothLeManager.getBondedPeripherals);
    if(!peripherals) return
    if(Platform.OS==='ios'){
      var result:boolean = yield call(bluetoothLeManager.connectToPeripheral, peripherals[0].id);
      if(result){
        yield put({
          type: bluetoothActionConstants.CONNECTION_SUCCESS,
          payload: peripherals[0],
        });
        yield put({
          type: bluetoothActionConstants.START_RECEIVE_MESSAGE,
        });
        yield handleBleUnknownDisconnect(peripherals[0].id)
        return
      }
    }else if(Platform.OS==='android'){
    for(let i=0; i<peripherals.length && i<5; i++){
        var result:boolean = yield call(bluetoothLeManager.connectToPeripheral, peripherals[i].id);
        if(result){
          yield put({
            type: bluetoothActionConstants.CONNECTION_SUCCESS,
            payload: peripherals[i],
          });
          yield put({
            type: bluetoothActionConstants.START_RECEIVE_MESSAGE,
          });
          yield handleBleUnknownDisconnect(peripherals[i].id)
          return
        }
      }
    }
  }
}

export function* bluetoothSaga() {
    yield takeEvery(bluetoothActionConstants.SCAN_FOR_PERIPHERALS,
      watchForPeripherals,
      );
    yield takeEvery(bluetoothActionConstants.SCAN_FOR_PERIPHERALS,
      refreshTimer,
      );
    yield takeEvery(bluetoothActionConstants.INITIATE_CONNECTION,
      connectToPeripheral
      );
    yield takeEvery(bluetoothActionConstants.DISCONNECTION_PERIPHERAL,
      disconnectToPeripheral
        );
    yield takeEvery(bluetoothActionConstants.START_RECEIVE_MESSAGE,
      getMessage
      );
    yield takeEvery(bluetoothActionConstants.SEND_MESSAGE,
      setMessage
      );
    yield takeEvery(bluetoothActionConstants.AUTO_PAIRING,
      autoBlueToothPair
      );
}

