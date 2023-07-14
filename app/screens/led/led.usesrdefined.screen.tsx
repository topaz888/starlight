import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, View } from "react-native";

import CTAButton from '../../components/buttons/CTAButton';
import DataSlider from "../../components/sliders/DataSlider";
import ModeToggleButton from "../../components/buttons/ToggleButton";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { updateledBrightness, updateledCycle, updateledDelay, updateledKey, setledStaticMessage, uploadMessage, updateledCycle2 } from "../../redux/led/led.reducer";
import { LedMessage, LedStaticModeMessage } from "../../models/LedMessage";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { handleAddLed } from "../../realm/led/actions/led.actions";
import { useEffect, useState } from "react";
import { screenWidth } from "../../components/constant/constant";
import LedToggleButton from "../../components/buttons/ToggleButton";

const _screenWidth = screenWidth;

interface LedScreenProps {
    navigation: NavigationProp<any,any>;
    route: RouteProp<any,any>;
  }

const LedUserDefinedScreen = (props:LedScreenProps) =>{
    const [modeId, setModeId] = useState();
    const [title, setTitle] = useState();
    useEffect(() =>{
        let tempModeId = props.route?.params?.modeId;
        let temptitle = props.route?.params?.title;
        if (tempModeId!=null) {
            setModeId(tempModeId);
            setTitle(temptitle);
        }
      },[props]); 

    const LedKey = useSelector(
        (state: RootState) => state.led.ledKey,
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
        (state: RootState) => state.led.ledStaticMessage,
    );

    const dispatch = useDispatch();

    const updataLedKey = (message: string) => {
        dispatch(updateledKey(message));
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

    const setMessage = () => {
        dispatch(setledStaticMessage());
    }

    const uploadStaticMessage = (message: { mode:number, cycle: number; delay: number|null; brightness: number; }[]) => {
        console.log("test1");
        try{
            console.log("modeId " + modeId);
            if(!modeId) throw new Error("Error:MODEID IS NULL");
            console.log(message);
            // handleAddLed(modeId, message);
        }catch(e){
            console.log(e);
        }
        console.log("test2");

        // const messagePackage: LedMessage = {deviceId: null, message: message};
        // dispatch(uploadMessage(messagePackage));
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.dataContainer}>
                <LedToggleButton title={[`Light\n One`, `Light\n Two`, `Light\nThree`,`Light\n Four`]} onPress={updataLedKey}/>
            </View>
            <View style={styles.transmissionData}>
                <Text style={styles.TitleText}>Recive Data</Text> 
                <View style={styles.dataContainer}>
                    <Text style={styles.Text}>key</Text>
                    <Text style={styles.TitleText}>{LedKey}</Text>
                </View>           
                <View style={styles.dataContainer}>
                    <Text style={styles.Text}>Cycle</Text>
                    <Text style={styles.TitleText}>{ledCycle}</Text>
                </View>
                <View style={styles.dataContainer}>
                    <Text style={styles.Text}>Delay</Text>
                    <Text style={styles.TitleText}>{ledDelay}</Text>
                </View>
                <View style={styles.dataContainer}>
                    <Text style={styles.Text}>Brightness</Text>
                    <Text style={styles.TitleText}>{ledBrightness}</Text>
                </View>
            </View>

            <View style={styles.controlContainer}>
                <Text style={styles.TitleText}>Send Data</Text>
                {title==='Light'?
                <View style={styles.controlPanel}>
                    <View style={styles.dataContainer}>
                        <Text style={styles.Text}>Brightness</Text>
                        <DataSlider minVal={0} maxVal={1000} step={10} onPress={updataLedBrightness} value={ledBrightness}/>
                    </View>
                </View>
                :
                title==='Blink'?
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
                title==='Breath' &&
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
            }
            </View>
            <View style={styles.buttonContainer}>
                <CTAButton title={'upload'} onPress={()=>{uploadStaticMessage(ledMessage)}}/>
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
    controlContainer:{
        flexDirection: 'column',
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
        marginHorizontal: 20,
        marginVertical: 8,
    },
    TitleText: {
        fontSize: 15,
        fontWeight: "bold",
        textAlign: "center",
        marginHorizontal: 10,
        color: "black",
    },    
    Text: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: 20,
        color: '#215e79',
        // textAlign: 'justify',
        textAlignVertical: 'center',
    },
  });
  
  export default LedUserDefinedScreen;