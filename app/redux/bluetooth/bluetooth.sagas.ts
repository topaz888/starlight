import { call, put, take, takeEvery, select } from "redux-saga/effects";
import { sagaActionConstants } from "./bluetooth.reducer";
import { AnyAction, PayloadAction } from "@reduxjs/toolkit";
import { END, TakeableChannel, eventChannel } from "redux-saga";
// import { Device } from "react-native-ble-plx";
import bluetoothLeManager from "./BluetoothManager";
import {BluetoothPeripheral, Message} from '../../models/BluetoothPeripheral'

// type TakeableDevice = {
//     payload: {id: string; name: string; serviceUUIDs: string};
//     take: (cb: (message: any | END) => void) => Device;
//   };

function* watchForPeripherals(): Generator<AnyAction, void, any> {
  const isPermissionsEnabled: boolean = yield call(bluetoothLeManager.requestAndroid31Permissions);
  yield put({
    type: sagaActionConstants.REQUEST_PERMISSIONS,
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
            type: sagaActionConstants.ON_DEVICE_DISCOVERED,
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
  type: typeof sagaActionConstants.INITIATE_CONNECTION,
  payload: BluetoothPeripheral,
}) {
  const peripheral = action.payload;
  yield call(bluetoothLeManager.connectToPeripheral, action.payload.id);
  yield put({
    type: sagaActionConstants.CONNECTION_SUCCESS,
    payload: peripheral,
  });
  yield call(bluetoothLeManager.stopScanningForPeripherals);
  yield put({
    type: sagaActionConstants.START_RECEIVE_MESSAGE,
  });
}

function* getMessage(): Generator<AnyAction, void, any> {
  const listenMessage = () =>
    eventChannel(emitter => {
      bluetoothLeManager.startStreamingData(emitter);
      return () => {
        bluetoothLeManager.stopScanningForPeripherals();
      };
    });
  const channel: TakeableChannel<string> = yield call(listenMessage);
  try {
    while (true) {
      const response = yield take(channel);
      yield put({
        type: sagaActionConstants.UPDATE_RECEIVE_MESSAGE,
        payload: response.payload,
      });
    }
  } catch (e) {
    console.log(e);
  }
}

function* setMessage(action: {
  type: typeof sagaActionConstants.SEND_MESSAGE,
  payload: Message,
}) {
  yield call(bluetoothLeManager.sendSignal, action.payload);
}

export function* bluetoothSaga() {
    yield takeEvery(sagaActionConstants.SCAN_FOR_PERIPHERALS,
      watchForPeripherals,
      );
    yield takeEvery(sagaActionConstants.INITIATE_CONNECTION,
      connectToPeripheral
      );
    yield takeEvery(sagaActionConstants.START_RECEIVE_MESSAGE,
      getMessage
      );
    yield takeEvery(sagaActionConstants.SEND_MESSAGE,
      setMessage
      );
}