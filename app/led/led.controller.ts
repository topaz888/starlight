import React, { useState } from 'react';

interface ledControllerApi {
    nextButton(): void;
    prevButton(): void;
    ledStaticMode:number;
}

const ledController = () : ledControllerApi =>{
    const [ledStaticMode, setLedStaticMode] = useState<number>(0);
    let maxMode: number = 30;
    let minMode: number = 1;
    const nextButton = () =>{
        setLedStaticMode((currentMode:number) => {
            if(currentMode < maxMode)
                currentMode = currentMode + Number(1);
            else if(currentMode == maxMode)
                currentMode = minMode;
            return currentMode;
        });
    }
    const prevButton = () =>{
        setLedStaticMode((currentMode:number) => {
            if(currentMode > minMode)
                currentMode = currentMode - Number(1);
            else if(currentMode == minMode)
                currentMode = maxMode;
            return currentMode;
        });
    }
    return{
        nextButton,
        prevButton,
        ledStaticMode
    }
}

export default ledController;