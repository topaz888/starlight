import {createSlice, Dictionary, PayloadAction} from '@reduxjs/toolkit';
import { LedStaticModeMessage } from '../../models/LedMessage';
import { call, put } from 'redux-saga/effects';
import ledController from './LedController';

type ledState = {
    ledStaticMessage: {mode:number, 
                       cycle:number, 
                       delay:number, 
                       brightness: number,
                       waitTime:number,
                       waitTimeLen: number,
                    }[]
    customName: string[];
    ledKey: number;
    ledStaticMode: number;
    ledMode: number;
    ledCycle: number;
    ledDelay: number;
    ledBrightness: number;
    ledwaitTime:number;
    ledwaitTimeLen:number;

    isUpdating: boolean;
    isUploading:boolean;
}

const initialState:ledState = {
    ledStaticMessage: [],
    customName:[],
    ledKey: 0,
    ledStaticMode: 1,
    ledMode: 0,
    ledCycle: 0,
    ledDelay: 0,
    ledBrightness: 0,
    ledwaitTime:0,
    ledwaitTimeLen:0,

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
        updateCustomName: (state,action)=>{
            console.log("CustomName");
            state.customName = action.payload;
        },
        updateledKey: (state,action)=>{
            console.log("key");
            state.ledKey = action.payload;
            state.isUpdating = true;
        },
        updateledMode: (state,action)=>{
            console.log("mode");
            state.ledMode = action.payload;
            state.isUpdating = true;
        },
        updateledCycle: (state,action)=>{
            console.log("cycle");
            state.ledCycle = action.payload;
            state.isUpdating = true;
        },
        updateledDelay: (state,action)=>{
            console.log("delay");
            state.ledDelay = action.payload;
            state.isUpdating = true;
        },
        updateledBrightness: (state,action)=>{
            console.log("brightness");
            state.ledBrightness = action.payload;
            state.isUpdating = true;
        },
        updateledStaticMessage: state=>{
            console.log("updateledStaticMessage");
            const staticModeMessage = {
                                        mode: state.ledMode,
                                        cycle: state.ledCycle,
                                        delay: state.ledDelay,
                                        brightness: state.ledBrightness,
                                        waitTime: state.ledwaitTime,
                                        waitTimeLen: state.ledwaitTimeLen,
                                    };
            state.ledStaticMessage[state.ledKey] = staticModeMessage;
            state.isUpdating = false;
        },

        updateledwaitTime: (state,action)=>{
            console.log("waitTime");
            state.ledwaitTime = action.payload;
            state.isUpdating = true;
        },

        updateledwaitTimeLen: (state,action)=>{
            console.log("waitTimeLen");
            state.ledwaitTimeLen = action.payload;
            state.isUpdating = true;
        },

        updateledMessageByData: (state,action)=>{
            state.ledStaticMessage = action.payload;
            state.ledMode = state.ledStaticMessage[0]?.mode ?? 0;
            state.isUpdating = false;
        },

        setledStaticMessage: state =>{
            console.log(state.ledStaticMessage);
            const key = state.ledKey;
            state.ledMode = state.ledStaticMessage[key]?.mode ?? 0;
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
    UPDATE_MODE: ledReducer.actions.updateledMode.type,
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
    updateCustomName,
    updateledKey,
    updateledMode,
    updateledCycle,
    updateledDelay,
    updateledBrightness,
    setledStaticMessage,
    uploadMessage,
    updateledMessageByData,
    updateledwaitTime,
    updateledwaitTimeLen
} = ledReducer.actions


export default ledReducer;