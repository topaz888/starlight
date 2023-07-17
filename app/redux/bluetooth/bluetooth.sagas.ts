import { call, put, take, takeEvery, select } from "redux-saga/effects";
import { bluetoothActionConstants } from "./bluetooth.reducer";
import { AnyAction, PayloadAction } from "@reduxjs/toolkit";
import { END, TakeableChannel, eventChannel } from "redux-saga";
// import { Device } from "react-native-ble-plx";
import bluetoothLeManager from "./BluetoothManager";
import {BluetoothPeripheral, Message} from '../../models/BluetoothPeripheral'
import { Peripheral } from "react-native-ble-manager";

// type TakeableDevice = {
//     payload: {id: string; name: string; serviceUUIDs: string};
//     take: (cb: (message: any | END) => void) => Device;
//   };

function* watchForPeripherals(): Generator<AnyAction, void, any> {
  const isPermissionsEnabled: boolean = yield call(bluetoothLeManager.requestAndroid31Permissions);

  yield put({
    type: bluetoothActionConstants.REQUEST_PERMISSIONS,
    payload:isPermissionsEnabled
  })
  if(isPermissionsEnabled){
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

function* connectToPeripheral(action: {
  type: typeof bluetoothActionConstants.INITIATE_CONNECTION,
  payload: BluetoothPeripheral,
}) {
  const peripheral = action.payload;
  yield call(bluetoothLeManager.BondingPeripherals, action.payload.id);
  yield call(bluetoothLeManager.connectToPeripheral, action.payload.id);
  yield put({
    type: bluetoothActionConstants.CONNECTION_SUCCESS,
    payload: peripheral,
  });
  yield call(bluetoothLeManager.stopScanningForPeripherals);
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
  type: typeof bluetoothActionConstants.DISCONNECTION_SUCCESS,
  payload: string,
}){
  yield call(bluetoothLeManager.disconnectToPeripheral, action.payload);
}
function* setMessage(action: {
  type: typeof bluetoothActionConstants.SEND_MESSAGE,
  payload: Message,
}) {
  yield call(bluetoothLeManager.sendSignal, action.payload);
}

function* autoBlueToothPair() {
  const isPermissionsEnabled: boolean = yield call(bluetoothLeManager.requestAndroid31Permissions);
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
      yield call(bluetoothLeManager.connectToPeripheral, peripheral.id);
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
  }
}

export function* bluetoothSaga() {
    yield takeEvery(bluetoothActionConstants.SCAN_FOR_PERIPHERALS,
      watchForPeripherals,
      );
    yield takeEvery(bluetoothActionConstants.INITIATE_CONNECTION,
      connectToPeripheral
      );
    yield takeEvery(bluetoothActionConstants.DISCONNECTION_SUCCESS,
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