import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, View } from "react-native";
import CTAButton from '../../components/buttons/CTAButton';
import DataSlider from "../../components/sliders/DataSlider";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { updateledBrightness, updateledCycle, updateledDelay, updateledKey, setledStaticMessage, uploadMessage, updateledMode, updateledwaitTime, updateledwaitTimeLen, updateledCycle2 } from "../../redux/led/led.reducer";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { handleAddLed } from "../../realm/led/actions/led.actions";
import { useEffect, useMemo, useState } from "react";
import { screenWidth } from "../../components/constant/constant";
import LedToggleButton from "../../components/buttons/ToggleButton";
import ModeToggleButton from "../../components/buttons/ModeToggleButton";
import CustomTab from "../../components/tabbBar/CustomTab";
import BreathToggleButton from "../../components/buttons/BreathToggleButton";
import { messageNumber } from "../../models/LedMessage";

const _screenWidth = screenWidth;

interface LedScreenProps {
    navigation: NavigationProp<any,any>;
    route: RouteProp<any,any>;
  }

const LedCustomScreen = (props:LedScreenProps) =>{
    const modeId = useMemo<string>(()=>{return (props.route.params?.modeId)}, [props.route.params?.modeId])

    const ledKey = useSelector(
        (state: RootState) => state.led.ledKey,
      );

    const ledMode = useSelector(
        (state: RootState) => state.led.ledMode,
      );

    const ledCycle = useSelector(
        (state: RootState) => state.led.ledCycle,
      );
    
    const ledCycle2 = useSelector(
        (state: RootState) => state.led.ledCycle2,
      );

    const ledDelay = useSelector(
        (state: RootState) => state.led.ledDelay,
    );

    const ledBrightness = useSelector(
        (state: RootState) => state.led.ledBrightness,
    );

    const ledMessage = useSelector(
        (state: RootState) => state.led.ledCustomMessage,
    );

    const ledWaitTime = useSelector(
        (state: RootState) => state.led.ledwaitTime,
    );

    const ledWaitTimeLen = useSelector(
        (state: RootState) => state.led.ledwaitTimeLen,
    );

    const dispatch = useDispatch();

    const updataLedKey = (message: string) => {
        dispatch(updateledKey(message));
        dispatch(setledStaticMessage())
    }

    const updateLedMode = (message: string) => {
        dispatch(updateledMode(message));
    }

    const updataLedCycle = (message: string) => {
        dispatch(updateledCycle(message));
    }

    const updataLedCycle2 = (message: string) => {
        dispatch(updateledCycle2(message));
    }

    const updataLedDelay = (message: string) => {
        dispatch(updateledDelay(message));
    }

    const updataLedBrightness = (message: string) => {
        dispatch(updateledBrightness(message));
    }

    const updataLedWaitTime = (message: string) => {
        dispatch(updateledwaitTime(message));
    }

    const updataLedWaitTimeLen = (message: string) => {
        dispatch(updateledwaitTimeLen(message));
    }

    const uploadMessage = async (message: messageNumber[]) => {
        console.log("test1");
        try{
            console.log(message);
            const success = await handleAddLed(modeId??null, message);
            if(!success) throw new Error("Error: Inserting an item");
            else props.navigation.goBack();
        }catch(e){
            console.log(e);
        }
        console.log("test2");
        // const messagePackage: LedMessage = {deviceId: null, message: message};
        // dispatch(uploadMessage(messagePackage));
    }

    const viewLedParameter = () =>{
        return(
            <>{ledMode===0?
                <View style={styles.controlPanel}>
                    <View style={styles.dataContainer}>
                        <Text style={styles.Text}>Brightness</Text>
                        <DataSlider minVal={0} maxVal={1000} step={10} onPress={updataLedBrightness} value={ledBrightness}/>
                    </View>
                </View>
                :
                ledMode===1?
                <View style={styles.controlPanel}>
                    <View style={styles.dataContainer}>
                        <Text style={styles.Text}>Bright Cycle</Text>
                        <DataSlider minVal={0} maxVal={100} step={1} onPress={updataLedCycle} value={ledCycle}/>
                    </View>
                    <View style={styles.dataContainer}>
                        <Text style={styles.Text}>Dark Cycle</Text>
                        <DataSlider minVal={0} maxVal={100} step={1} onPress={updataLedCycle2} value={ledCycle2}/>
                    </View>
                    <View style={styles.dataContainer}>
                        <Text style={styles.Text}>Brightness</Text>
                        <DataSlider minVal={0} maxVal={1000} step={10} onPress={updataLedBrightness} value={ledBrightness}/>
                    </View>
                </View>
                :
                ledMode===2 &&
                <View style={styles.controlPanel}>
                    <View style={styles.dataContainer}>
                        <Text style={styles.Text}>Cycle</Text>
                        <DataSlider minVal={0} maxVal={100} step={1} onPress={updataLedCycle} value={ledCycle}/>
                    </View>
                    <View style={styles.dataContainer}>
                        <Text style={styles.Text}>Delay</Text>
                        <DataSlider minVal={0} maxVal={10} step={2.5} onPress={updataLedDelay} value={ledDelay}/>
                    </View>
                    <View style={styles.dataContainer}>
                        <Text style={styles.Text}>Brightness</Text>
                        <DataSlider minVal={0} maxVal={1000} step={10} onPress={updataLedBrightness} value={ledBrightness}/>
                    </View>
                </View>
            }</>
        )
    }

    const viewLedTimer = () =>{
        return(
            <>{ledMode===0 ?
                <View style={styles.controlPanel}>
                    <View style={styles.dataContainer}>
                        <Text style={styles.Text}>This Mode doesn;t have Timer</Text>
                    </View>
                </View>
                :
                ledMode===1 ?
                <View style={styles.controlPanel}>
                    <View style={styles.dataContainer}>
                    <Text style={styles.Text}>Wait Time</Text>
                        <DataSlider minVal={0} maxVal={100} step={1} onPress={updataLedWaitTime} value={ledWaitTime}/>
                    </View>
                </View>
                :
                ledMode===2 &&
                <View style={styles.controlPanel}>
                    <View style={styles.dataContainer}>
                        <Text style={styles.Text}>Wait Time</Text>
                        <DataSlider minVal={0} maxVal={100} step={1} onPress={updataLedWaitTime} value={ledWaitTime}/>
                    </View>
                    <View style={styles.dataContainer}>
                        <Text style={styles.Text}>Wait At</Text>
                        <BreathToggleButton title={['0', '1/4', '1/2', '3/4', '1']} onPress={updataLedWaitTimeLen} val={ledWaitTimeLen}/>
                    </View>
                </View> 
            }</>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.dataContainer}>
                <LedToggleButton title={[`Light\n One`, `Light\n Two`, `Light\nThree`,`Light\n Four`]} onPress={updataLedKey} theme={'Dark'}/>
            </View>

            <View style={styles.transmissionData}>
                <View style={styles.dataContainer}>
                    <Text style={styles.testText}>modeId</Text>
                    <Text style={styles.TitleText}>{modeId}</Text>
                </View>
                <View style={styles.dataContainer}>
                    <Text style={styles.testText}>key</Text>
                    <Text style={styles.TitleText}>{ledKey}</Text>
                </View>
                <View style={styles.dataContainer}>
                    <Text style={styles.testText}>Mode</Text>
                    <Text style={styles.TitleText}>{ledMode}</Text>
                </View>
                <View style={styles.dataContainer}>
                    <Text style={styles.testText}>Cycle</Text>
                    <Text style={styles.TitleText}>{ledCycle}</Text>
                </View>
                <View style={styles.dataContainer}>
                    <Text style={styles.testText}>Delay</Text>
                    <Text style={styles.TitleText}>{ledDelay}</Text>
                </View>
                <View style={styles.dataContainer}>
                    <Text style={styles.testText}>Brightness</Text>
                    <Text style={styles.TitleText}>{ledBrightness}</Text>
                </View>
            </View>

            <View style={styles.dataContainer}>
                <ModeToggleButton title={['Light', 'Blink', 'Breath']} onPress={updateLedMode} val={ledMode}/>
            </View>

                <View style={styles.dataContainer}>
                    <CustomTab title={['Parameter', `Timer`]} renderView={[viewLedParameter, viewLedTimer]}/>
                </View>
            <View style={styles.buttonContainer}>
                <CTAButton title={'upload'} theme={'Dark'} onPress={async ()=>{await uploadMessage(ledMessage)}}/>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2f2f2",
    },
    buttonContainer: {
        position:'absolute',
        bottom: 20,
        left: _screenWidth/2-150,
    },
    dataContainer: {
        justifyContent: "space-around",
        flexDirection: "row",
        marginVertical: 5,
    },
    transmissionData: {
        marginHorizontal: 25,
        marginVertical: 5,
    },
    controlPanel: {
        marginHorizontal: 25,
        marginVertical: 8,
    },
    TitleText: {
        fontSize: 15,
        fontWeight: "bold",
        textAlign: "center",
        marginHorizontal: 10,
        color: "black",
    },    
    testText: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: 15,
        color: '#215e79',
        textAlign: 'justify',
        textAlignVertical: 'center',
    },
    Text: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: 20,
        color: '#215e79',
        textAlign: 'justify',
        textAlignVertical: 'center',
    },
  });
  
  export default LedCustomScreen;