import { call, delay, put, select, take, takeEvery } from "redux-saga/effects";
import { bluetoothActionConstants } from "./bluetooth.reducer";
import { AnyAction } from "@reduxjs/toolkit";
import { TakeableChannel, eventChannel } from "redux-saga";
import bluetoothLeManager from "./BluetoothManager";
import {BluetoothPeripheral, Message} from '../../models/BluetoothPeripheral'
import { Peripheral } from "react-native-ble-manager";
import { getTimerFlag } from "../store";

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

function* refreshTimer():Generator<AnyAction, void, any> {
  while (true) {
      yield delay(5000);
      var timerFlag = yield select(getTimerFlag);
      if(timerFlag){
        return;
      }
      yield put({type: bluetoothActionConstants.REFRESH_FOR_PERIPHERALS});
  }
}

function* connectToPeripheral(action: {
  type: typeof bluetoothActionConstants.INITIATE_CONNECTION,
  payload: BluetoothPeripheral,
}) {
  const peripheral = action.payload;
  yield call(bluetoothLeManager.connectToPeripheral, action.payload.id);
  // yield call(bluetoothLeManager.BondingPeripherals, action.payload.id);
  yield put({
    type: bluetoothActionConstants.CONNECTION_SUCCESS,
    payload: peripheral,
  });
  yield call(bluetoothLeManager.stopScanningForPeripherals);
  yield handleBleUnknownDisconnect(action.payload.id)
}

function* handleBleUnknownDisconnect(identifier:string): Generator<any, void, any> {
  const listener = yield eventChannel(emitter => {
    const  subscription = bluetoothLeManager.addConnectListener(identifier, emitter);
    return () => {
      subscription.remove();
   }
  });
  try {
    while (true) {
      const result = yield take(listener);
      if(result)
        yield put({
          type: bluetoothActionConstants.DISCONNECTION_SUCCESSS,
      })
      listener.close();
    }
  }catch(e){
    console.log(e)
  }
}

function* getMessage(): Generator<AnyAction, void, any> {
  const onListenMessage = () =>
    eventChannel(emitter => {
      bluetoothLeManager.startStreamingData(emitter);
      return () => {
        bluetoothLeManager.stopScanningForPeripherals();
      };
    });
  const channel: TakeableChannel<string> = yield call(onListenMessage);
  try {
    while (true) {
      const response = yield take(channel);
      yield put({
        type: bluetoothActionConstants.UPDATE_RECEIVE_MESSAGE,
        payload: response.payload,
      });
    }
  } catch (e) {
    console.log(e);
  }
}
function* disconnectToPeripheral(action:{
  type: typeof bluetoothActionConstants.DISCONNECTION_PERIPHERAL,
  payload: string,
}){
  yield call(bluetoothLeManager.disconnectToPeripheral, action.payload);
  yield put({
    type: bluetoothActionConstants.DISCONNECTION_SUCCESSS,
  })
}
function* setMessage(action: {
  type: typeof bluetoothActionConstants.SEND_MESSAGE,
  payload: Message,
}) {
  yield call(bluetoothLeManager.sendSignal, action.payload);
}

function* autoBlueToothPair() {
  const isPermissionsEnabled: boolean = yield call(bluetoothLeManager.requestPermissions);
  yield put({
    type: bluetoothActionConstants.REQUEST_PERMISSIONS,
    payload:isPermissionsEnabled
  })
  if(isPermissionsEnabled){
    var peripheral:Peripheral = yield call(bluetoothLeManager.getBondedPeripherals);
    if(peripheral){
      yield put({
        type: bluetoothActionConstants.CHECK_BONDED_DEVICE,
        payload: true,
      });
      var result:boolean = yield call(bluetoothLeManager.connectToPeripheral, peripheral.id);
      if(result)
        yield put({
          type: bluetoothActionConstants.CONNECTION_SUCCESS,
          payload: peripheral,
        });
    }
    else{
      yield put({
        type: bluetoothActionConstants.CHECK_BONDED_DEVICE,
        payload: false,
      });
    }
    if(peripheral){
      yield handleBleUnknownDisconnect(peripheral.id)
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

