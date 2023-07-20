import {createSlice, Dictionary, PayloadAction} from '@reduxjs/toolkit';
import { messageNumber } from '../../models/LedMessage';
import { call, put } from 'redux-saga/effects';
import ledController from './LedController';

type ledState = {
    ledCustomMessage: messageNumber[]
    customName: string[];
    ledTitleName: number; 
    ledKey: number;//lightId 
    ledStaticMode: number;
    ledMode: number;//LIGHT mODE
    ledCycle: number;
    ledCycle2: number;
    ledDelay: number;
    ledBrightness: number;
    ledwaitTime:number;
    ledwaitTimeLen:number;

    databaseDefault: boolean;
    isUpdating: boolean;
    isUploading:boolean;
}

const initialState:ledState = {
    ledCustomMessage: [],
    customName:[],
    ledTitleName:0,
    ledKey: 0,
    ledStaticMode: 1,
    ledMode: 0,
    ledCycle: 0,
    ledCycle2: 0,
    ledDelay: 0,
    ledBrightness: 0,
    ledwaitTime:0,
    ledwaitTimeLen:0,

    databaseDefault: false,
    isUpdating: false,
    isUploading: false,
}

const ledReducer = createSlice({
    name: "led",
    initialState: initialState,
    reducers: {
        moveNextMode:state =>{
            console.log("moveNextMode");
            let maxMode: number = 30;
            let minMode: number = 1;
            if(state.ledStaticMode < maxMode)
                state.ledStaticMode = state.ledStaticMode + Number(1);
            else if(state.ledStaticMode == maxMode)
                state.ledStaticMode = minMode;
        },
        movePrevMode:state =>{
            console.log("movePrevMode");
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
        updateledTitleName: (state,action)=>{
            console.log("TitleName");
            state.ledTitleName = action.payload;
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
        updateledCycle2: (state,action)=>{
            console.log("cycle2");
            state.ledCycle2 = action.payload;
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
        updateledCustomMessage: state=>{
            console.log("updateledCustomMessage");
            const staticModeMessage:messageNumber = {
                                        mode: state.ledMode,
                                        cycle: state.ledCycle,
                                        cycle2: state.ledCycle2,
                                        delay: state.ledDelay,
                                        brightness: state.ledBrightness,
                                        waitTime: state.ledwaitTime,
                                        waitTimeLen: state.ledwaitTimeLen,
                                    };
            state.ledCustomMessage[state.ledKey] = staticModeMessage;
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
            state.ledCustomMessage = action.payload;
            state.ledMode = state.ledCustomMessage[0]?.mode ?? 0;
            state.isUpdating = false;
        },

        updateDefault: (state,action) => {
            state.databaseDefault = action.payload;
        },

        setledStaticMessage: state =>{
            console.log("setledStaticMessage");
            const key = state.ledKey;
            state.ledMode = state.ledCustomMessage[key]?.mode ?? 0;
            state.ledBrightness = state.ledCustomMessage[key]?.brightness ?? 0;
            state.ledCycle = state.ledCustomMessage[key]?.cycle ?? 0;
            state.ledDelay = state.ledCustomMessage[key]?.delay ?? 0;
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
    UPDATE_CUSTOM_MESSAGE: ledReducer.actions.updateledCustomMessage.type,
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
    updateledCycle2,
    updateledDelay,
    updateledBrightness,
    setledStaticMessage,
    uploadMessage,
    updateledMessageByData,
    updateledwaitTime,
    updateledwaitTimeLen,
    updateDefault,
    updateledTitleName
} = ledReducer.actions


export default ledReducer;