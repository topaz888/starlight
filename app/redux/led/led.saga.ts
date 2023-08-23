import { put, takeEvery } from "redux-saga/effects";
import { ledActionConstants } from "./led.reducer";
import ledController from "./LedController";
import { messageBigInt, LedMessage } from "../../models/LedMessage";
import { TakeableChannel, eventChannel } from "redux-saga";
import { AnyAction } from "redux";
import { bluetoothActionConstants } from "../bluetooth/bluetooth.reducer";
import { Message } from "../../models/BluetoothPeripheral";

import * as Effects from "redux-saga/effects";
const call: any = Effects.call;

function* updateCustomMessage() {
    yield put({
        type: ledActionConstants.UPDATE_CUSTOM_MESSAGE,
      });
}

function* uploadMessage(action:{
    type: typeof ledActionConstants.UPLOAD_MESSAGE,
    payload: LedMessage | string
}) : Generator<AnyAction, void, any>  {
    
    if(typeof(action.payload) != "string"){
        const data: messageBigInt = yield call(ledController.deserializeWriteData,action.payload.messages)
        
        // console.log(data);
        if(data.mode){
            const modeMessage : Message = {deviceId: action.payload.deviceId, message: data.mode.toString()}
            yield put({
                type: bluetoothActionConstants.SEND_MESSAGE,
                payload: modeMessage,
            })
        }

        if(data.delay){
            const delayMessage : Message = {deviceId: action.payload.deviceId, message: data.delay.toString()}
            yield put({
                type: bluetoothActionConstants.SEND_MESSAGE,
                payload: delayMessage,
            })
        }

        if(data.cycle){
            const cycleMessage : Message = {deviceId: action.payload.deviceId, message: data.cycle.toString()}
            yield put({
                type: bluetoothActionConstants.SEND_MESSAGE,
                payload: cycleMessage,
            })
        }

        if(data.cycle2){
            const cycle2Message : Message = {deviceId: action.payload.deviceId, message: data.cycle2.toString()}
            yield put({
                type: bluetoothActionConstants.SEND_MESSAGE,
                payload: cycle2Message,
            })
        }

        if(data.brightness){
            const brightnessMessage : Message = {deviceId: action.payload.deviceId, message: data.brightness.toString()}
            yield put({
                type: bluetoothActionConstants.SEND_MESSAGE,
                payload: brightnessMessage,
            })
        }

        if(data.waitTime){
            const brightnessMessage : Message = {deviceId: action.payload.deviceId, message: data.waitTime.toString()}
            yield put({
                type: bluetoothActionConstants.SEND_MESSAGE,
                payload: brightnessMessage,
            })
        }

        if(data.waitTimeLen){
            const brightnessMessage : Message = {deviceId: action.payload.deviceId, message: data.waitTimeLen.toString()}
            yield put({
                type: bluetoothActionConstants.SEND_MESSAGE,
                payload: brightnessMessage,
            })
        }
    }else{
        //reading when the status is default
        const data: number = yield call(ledController.deserializeReadData,action.payload)
        const message : Message = {deviceId: null, message: data}
        yield put({
            type: bluetoothActionConstants.SEND_MESSAGE,
            payload: message,
        })
    }
}

export function* ledSaga() {
    yield takeEvery([ledActionConstants.UPDATE_MODE, 
        ledActionConstants.UPDATE_BRIGHTNESS,
        ledActionConstants.UPDATE_CYCLE, 
        ledActionConstants.UPDATE_DELAY,
        ledActionConstants.UPDATE_WAITTIME],
        updateCustomMessage,
      );

      yield takeEvery(ledActionConstants.UPLOAD_MESSAGE,
        uploadMessage,
      );
}