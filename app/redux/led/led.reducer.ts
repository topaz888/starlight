import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type ledState = {
    ledStaticMode: number;
}

const initialState:ledState = {
    ledStaticMode: 1,
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
    }
})

export const {
    moveNextMode,
    movePrevMode,
} = ledReducer.actions


export default ledReducer;