import { put, takeEvery } from "redux-saga/effects";
import { ledActionConstants } from "./led.reducer";
import ledController from "./LedController";
import { BigIntLedStaticModeMessage, LedStaticModeMessage, LedMessage } from "../../models/LedMessage";
import { TakeableChannel, eventChannel } from "redux-saga";
import { AnyAction } from "redux";
import { bluetoothActionConstants } from "../bluetooth/bluetooth.reducer";
import { Message } from "../../models/BluetoothPeripheral";

import * as Effects from "redux-saga/effects";
const call: any = Effects.call;

function* updateMessage() {
    yield put({
        type: ledActionConstants.UPDATE_STATIC_MESSAGE,
      });
}

function* uploadMessage(action:{
    type: typeof ledActionConstants.UPLOAD_MESSAGE,
    payload: LedMessage | string
}) : Generator<AnyAction, void, any>  {
    
    if(typeof(action.payload) != "string"){
        const data: BigIntLedStaticModeMessage = yield call(ledController.deserializeWriteData,action.payload.message)
        
        const cycleMessage : Message = {deviceId: action.payload.deviceId, message: data.cycle.toString()}
        yield put({
            type: bluetoothActionConstants.SEND_MESSAGE,
            payload: cycleMessage,
        })
        const delayMessage : Message = {deviceId: action.payload.deviceId, message: data.delay.toString()}
        yield put({
            type: bluetoothActionConstants.SEND_MESSAGE,
            payload: delayMessage,
        })
        const brightnessMessage : Message = {deviceId: action.payload.deviceId, message: data.brightness.toString()}
        yield put({
            type: bluetoothActionConstants.SEND_MESSAGE,
            payload: brightnessMessage,
        })
    }else{const data: number = yield call(ledController.deserializeReadData,action.payload)
        const message : Message = {deviceId: null, message: data}
        yield put({
            type: bluetoothActionConstants.SEND_MESSAGE,
            payload: message,
        })
    }
}

export function* ledSaga() {
    yield takeEvery([ledActionConstants.UPDATE_MODE, ledActionConstants.UPDATE_BRIGHTNESS,ledActionConstants.UPDATE_CYCLE, ledActionConstants.UPDATE_DELAY],
        updateMessage,
      );

      yield takeEvery(ledActionConstants.UPLOAD_MESSAGE,
        uploadMessage,
      );
}