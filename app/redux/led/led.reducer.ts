import {createSlice, Dictionary, PayloadAction} from '@reduxjs/toolkit';
import { LedStaticModeMessage } from '../../models/LedMessage';
import { call, put } from 'redux-saga/effects';
import ledController from './LedController';

type ledState = {
    ledStaticMessage: Record<number, LedStaticModeMessage>;
    ledKey: number;
    ledStaticMode: number;
    ledMode: string;
    ledCycle: number;
    ledDelay: number;
    ledBrightness: number;
    isUpdating: boolean;
    isUploading:boolean;
}

const initialState:ledState = {
    ledStaticMessage: {},
    ledKey: 0,
    ledStaticMode: 1,
    ledMode: 'N/A',
    ledCycle: 0,
    ledDelay: 0,
    ledBrightness: 0,
    isUpdating: false,
    isUploading: false,
}

const ledReducer = createSlice({
    name: "led",
    initialState: initialState,
    reducers: {
        moveNextMode:state =>{
            let maxMode: number = 30;
            let minMode: number = 1;
            if(state.ledStaticMode < maxMode)
                state.ledStaticMode = state.ledStaticMode + Number(1);
            else if(state.ledStaticMode == maxMode)
                state.ledStaticMode = minMode;
        },
        movePrevMode:state =>{
            let maxMode: number = 30;
            let minMode: number = 1;
            if(state.ledStaticMode > minMode)
                state.ledStaticMode = state.ledStaticMode - Number(1);
            else if(state.ledStaticMode == minMode)
                state.ledStaticMode = maxMode;
        },
        updateledKey: (state,action)=>{
            state.ledKey = action.payload;
            state.isUpdating = true;
        },
        updateledMode: (state,action)=>{
            state.ledMode = action.payload;
            state.isUpdating = true;
        },
        updateledCycle: (state,action)=>{
            state.ledCycle = action.payload;
            state.isUpdating = true;
        },
        updateledDelay: (state,action)=>{
            state.ledDelay = action.payload;
            state.isUpdating = true;
        },
        updateledBrightness: (state,action)=>{
            state.ledBrightness = action.payload;
            state.isUpdating = true;
        },
        updateledStaticMessage: state=>{
            const staticModeMessage: LedStaticModeMessage = {cycle: state.ledCycle,
                                                             delay: state.ledDelay,
                                                             brightness: state.ledBrightness,
                                                            };
            state.ledStaticMessage[state.ledKey] = staticModeMessage;
            state.isUpdating = false;
        },
        setledStaticMessage: state =>{
            const key = state.ledKey;
            state.ledBrightness = state.ledStaticMessage[key]?.brightness ?? 0;
            state.ledCycle = state.ledStaticMessage[key]?.cycle ?? 0;
            state.ledDelay = state.ledStaticMessage[key]?.delay ?? 0;
        },
        uploadMessage: (state, _) => {
            state.isUploading = true;
        }
    }
})

export const ledActionConstants = {
    UPDATE_KEY: ledReducer.actions.updateledKey.type,
    UPDATE_BRIGHTNESS: ledReducer.actions.updateledBrightness.type,
    UPDATE_CYCLE: ledReducer.actions.updateledCycle.type, 
    UPDATE_DELAY: ledReducer.actions.updateledDelay.type,
    UPDATE_STATIC_MESSAGE: ledReducer.actions.updateledStaticMessage.type,
    SET_LED_STATIC_MESSAGE: ledReducer.actions.setledStaticMessage.type,
    UPLOAD_MESSAGE: ledReducer.actions.uploadMessage.type,
  };

export const {
    moveNextMode,
    movePrevMode,
    updateledKey,
    updateledMode,
    updateledCycle,
    updateledDelay,
    updateledBrightness,
    setledStaticMessage,
    uploadMessage,
} = ledReducer.actions


export default ledReducer;