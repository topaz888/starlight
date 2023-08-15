import {createSlice} from '@reduxjs/toolkit';
import { messageNumber } from '../../models/LedMessage';

type ledState = {
    ledCustomMessage: messageNumber[];
    customNameArray: string[];
    customNameIndex:number;
    ledTitleName: number; 
    ledKey: number;//lightId 
    ledStaticMode: number;
    ledMode: number;//LIGHT MODE
    ledCycle: number;
    mainScreenledCycle:number;
    ledCycle2: number;
    ledDelay: number;
    ledBrightness: number;
    mainScreenBrightness:number;
    ledwaitTime:number;
    ledwaitTimeLen:number;
    minBrightness:number;
    minCycle:number;
    tabView:number;

    databaseDefault: boolean;
    isUpdating: boolean;
    isUploading:boolean;
    isPlaying:boolean;
    isTurnOff:boolean;
}

const initialState:ledState = {
    ledCustomMessage: [],
    customNameArray:[],
    customNameIndex:0,
    ledTitleName:0,
    ledKey: 0,
    ledStaticMode: 1,
    ledMode: 0,
    ledCycle: 1,
    mainScreenledCycle: 0,
    ledCycle2: 0,
    ledDelay: 0,
    ledBrightness: 0,
    mainScreenBrightness: 0,
    ledwaitTime:0,
    ledwaitTimeLen:0,
    minBrightness:0,
    minCycle:0,
    tabView:0,

    databaseDefault: false,
    isUpdating: false,
    isUploading: false,
    isPlaying: false,
    isTurnOff: false,
}

const ledReducer = createSlice({
    name: "led",
    initialState: initialState,
    reducers: {
        moveNextStaticMode:state =>{
            // console.log("moveNextMode");
            let maxMode: number = 30;
            let minMode: number = 1;
            if(state.ledStaticMode < maxMode)
                state.ledStaticMode = state.ledStaticMode + Number(1);
            else if(state.ledStaticMode == maxMode)
                state.ledStaticMode = minMode;
        },
        movePrevStaticMode:state =>{
            // console.log("movePrevMode");
            let maxMode: number = 30;
            let minMode: number = 1;
            if(state.ledStaticMode > minMode)
                state.ledStaticMode = state.ledStaticMode - Number(1);
            else if(state.ledStaticMode == minMode)
                state.ledStaticMode = maxMode;
        },
        moveNextCustomIndex:state =>{
            // console.log("moveNextCustomIndex");
            let maxMode: number = state.customNameArray.length-1;
            let minMode: number = 0;
            if(state.customNameIndex < maxMode)
                state.customNameIndex = state.customNameIndex + Number(1);
            else if(state.customNameIndex == maxMode)
                state.customNameIndex = minMode;
        },
        movePrevCustomIndex:state =>{
            // console.log("movePrevCustomIndex");
            let maxMode: number = state.customNameArray.length-1;
            let minMode: number = 0;
            if(state.customNameIndex > minMode)
                state.customNameIndex = state.customNameIndex - Number(1);
            else if(state.customNameIndex == minMode)
                state.customNameIndex = maxMode;
        },
        updateCustomNameArray: (state,action)=>{
            // console.log("updateCustomNameArray");
            state.customNameArray = action.payload;
            state.isUpdating = true;
        },
        updateledKey: (state,action)=>{
            // console.log("updateledKey");
            state.ledKey = action.payload;
            state.isUpdating = true;
        },
        updateledTitleName: (state,action)=>{
            // console.log("updateledTitleName");
            state.ledTitleName = action.payload;
            state.isUpdating = true;
        },

        updateledMode: (state,action)=>{
            // console.log("updateledMode");
            state.ledMode = action.payload;
            state.isUpdating = true;
        },
        updateledCycle: (state,action)=>{
            // console.log("updateledCycle");
            state.ledCycle = action.payload;
            state.isUpdating = true;
        },

        updatemainScreenledCycle: (state,action)=>{
            // console.log("updatemainScreenledCycle");
            state.mainScreenledCycle = action.payload;
            state.isUpdating = true;
        },

        updateledCycle2: (state,action)=>{
            // console.log("updateledCycle2");
            state.ledCycle2 = action.payload;
            state.isUpdating = true;
        },
        updateledDelay: (state,action)=>{
            // console.log("updateledDelay");
            state.ledDelay = action.payload;
            state.isUpdating = true;
        },
        updateledBrightness: (state,action)=>{
            // console.log("updateledBrightness");
            state.ledBrightness = action.payload;
            state.isUpdating = true;
        },

        updatemainScreenledBrightness: (state,action)=>{
            // console.log("updatemainScreenledBrightness");
            state.mainScreenBrightness = action.payload;
            state.isUpdating = true;
        },

        updateledCustomMessage: state=>{
            // console.log("updateledCustomMessage");
            const customMessage:messageNumber = {
                                        mode: state.ledMode,
                                        cycle: state.ledCycle,
                                        cycle2: state.ledCycle2,
                                        delay: state.ledDelay,
                                        brightness: state.ledBrightness,
                                        waitTime: state.ledwaitTime,
                                        waitTimeLen: state.ledwaitTimeLen,
                                    };
            state.ledCustomMessage[state.ledKey] = customMessage;
            state.isUpdating = false;
        },

        updateledwaitTime: (state,action)=>{
            // console.log("updateledwaitTime");
            state.ledwaitTime = action.payload;
            state.isUpdating = true;
        },

        updateledwaitTimeLen: (state,action)=>{
            // console.log("updateledwaitTimeLen");
            state.ledwaitTimeLen = action.payload;
            state.isUpdating = true;
        },

        updateledMessageByData: (state,action)=>{
            state.ledKey = 0;
            state.tabView = 0;
            state.ledCustomMessage = action.payload;
            state.ledMode = state.ledCustomMessage[0]?.mode ?? 0;
            state.ledBrightness = state.ledCustomMessage[0]?.brightness ?? 0;
            state.ledCycle = state.ledCustomMessage[0]?.cycle ?? 1;
            state.ledDelay = state.ledCustomMessage[0]?.delay ?? 0;
            state.ledwaitTime = state.ledCustomMessage[0]?.waitTime ?? 0;
            state.isUpdating = false;
        },

        updateDefault: (state,action) => {
            state.databaseDefault = action.payload;
        },

        uploadTabView: (state,action) => {
            state.tabView = action.payload;
        },

        setledCustomMessage: state =>{
            // console.log("setledCustomMessage");
            const key = state.ledKey;
            state.ledMode = state.ledCustomMessage[key]?.mode ?? 0;
            state.ledBrightness = state.ledCustomMessage[key]?.brightness ?? 0;
            state.ledCycle = state.ledCustomMessage[key]?.cycle ?? 1;
            state.ledDelay = state.ledCustomMessage[key]?.delay ?? 0;
            state.ledwaitTime = state.ledCustomMessage[key]?.waitTime ?? 0;
        },

        resetCustomMessage: state => {
            state.ledCustomMessage = [];
            state.ledBrightness = 0;
            state.ledCycle = 1;
            state.ledKey = 0;
            state.ledMode = 0;
            state.ledwaitTime = 0;
            state.ledDelay = 0;
            state.tabView = 0;
        },

        uploadMessage: (state, _) => {
            state.isUploading = true;
        },

        uploadIsPlay: state => {
            state.isPlaying = !state.isPlaying
        },

        uploadIsTurnOff: state => {
            state.isTurnOff = !state.isTurnOff
        }
    }
})

export const ledActionConstants = {
    UPDATE_KEY: ledReducer.actions.updateledKey.type,
    UPDATE_MODE: ledReducer.actions.updateledMode.type,
    UPDATE_BRIGHTNESS: ledReducer.actions.updateledBrightness.type,
    UPDATE_CYCLE: ledReducer.actions.updateledCycle.type, 
    UPDATE_DELAY: ledReducer.actions.updateledDelay.type,
    UPDATE_WAITTIME: ledReducer.actions.updateledwaitTime.type,
    UPDATE_CUSTOM_MESSAGE: ledReducer.actions.updateledCustomMessage.type,
    SET_LED_CUSTOM_MESSAGE: ledReducer.actions.setledCustomMessage.type,
    UPLOAD_MESSAGE: ledReducer.actions.uploadMessage.type,
  };

export const {
    moveNextStaticMode,
    movePrevStaticMode,
    moveNextCustomIndex,
    movePrevCustomIndex,
    updateCustomNameArray,
    updateledKey,
    updateledMode,
    updateledCycle,
    updateledCycle2,
    updateledDelay,
    updateledBrightness,
    setledCustomMessage,
    uploadMessage,
    updateledMessageByData,
    updateledwaitTime,
    updateledwaitTimeLen,
    updateDefault,
    updateledTitleName,
    updatemainScreenledCycle,
    updatemainScreenledBrightness,
    uploadIsPlay,
    uploadIsTurnOff,
    uploadTabView,
    resetCustomMessage
    } = ledReducer.actions


export default ledReducer;