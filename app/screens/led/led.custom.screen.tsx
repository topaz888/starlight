import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, StyleSheet, Text, View } from "react-native";
import CTAButton from '../../components/buttons/CTAButton';
import DataSlider from "../../components/sliders/DataSlider";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { updateledBrightness, updateledCycle, updateledDelay, updateledKey, setledCustomMessage, updateledMode, updateledwaitTime } from "../../redux/led/led.reducer";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { handleAddLed, handleRemoveLed } from "../../realm/led/actions/led.actions";
import { useMemo } from "react";
import { screenHeight, screenWidth } from "../../components/constant/constant";
import LedToggleButton from "../../components/buttons/ToggleButton";
import ModeToggleButton from "../../components/buttons/ModeToggleButton";
import CustomTab from "../../components/tabbBar/CustomTab";
import { messageNumber } from "../../models/LedMessage";
import Gradient from "../../components/GradientColor";

const _screenWidth = screenWidth;
const _screenHeight = screenHeight;

interface LedScreenProps {
    navigation: NavigationProp<any,any>;
    route: RouteProp<any,any>;
  }

const LedCustomScreen = (props:LedScreenProps) =>{
    const modeId = useMemo<string>(()=>{return (props.route.params?.modeId)}, [props.route.params?.modeId])

    const ledMode = useSelector(
        (state: RootState) => state.led.ledMode,
    )

    const ledDelay = useSelector(
        (state: RootState) => state.led.ledDelay,
    )

    const ledCycle = useSelector(
        (state: RootState) => state.led.ledCycle,
    )
    
    const ledBrightness = useSelector(
        (state: RootState) => state.led.ledBrightness,
    )

    const ledWaitTime = useSelector(
        (state: RootState) => state.led.ledwaitTime,
    )

    const ledMessage = useSelector(
        (state: RootState) => state.led.ledCustomMessage,
    )

    const dispatch = useDispatch();

    const updataLedKey = (message: number) => {
        dispatch(updateledKey(message));
        dispatch(setledCustomMessage())
    }

    const updateLedMode = (message: number) => {
        dispatch(updateledMode(message));
    }

    const updataLedCycle = (message: number) => {
        dispatch(updateledCycle(message));
    }

    const updataLedDelay = (message: number) => {
        dispatch(updateledDelay(message));
    }

    const updataLedBrightness = (message: number) => {
        dispatch(updateledBrightness(message))
    }

    const updataLedWaitTime = (message: number) => {
        dispatch(updateledwaitTime(message));
    }

    const handleClose = () => {
        props.navigation.navigate({ name: 'Light Mode', params: { ...props.route.params} })
    }

    const handleSave = async () => {
        await uploadMessage(ledMessage); 
    }

    const handleDelete = () =>
    Alert.alert('Warning', 'If you choose Yes, this setting is deleted.', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'Yes', 
        onPress: async () => {await handleRemoveLed(modeId)
                              handleClose()}
      },
    ])

    const uploadMessage = async (message: messageNumber[]) => {
        console.log("test1");
        try{
            console.log(message);
            const success = await handleAddLed(modeId??"unknown", message);
            if(!success) Alert.alert('Error', 'Failed to create the new Star Mode', [
                    {
                      text: 'Cancel',
                      onPress: () => {},
                      style: 'cancel',
                    }]
            );
            else props.navigation.navigate({name: 'Light Mode',params: {...props.route.params} });
        }catch(e){
            console.log(e);
        }
        console.log("test2");
    }

    const viewLedParameter = () =>{
        return(
            <>{ledMode===0?
                <View style={styles.controlPanel}>
                    <View style={styles.dataContainer}>
                        <Text style={styles.Text}>Brightness</Text>
                        <DataSlider minVal={0} maxVal={100} step={10} onPress={updataLedBrightness} value={ledBrightness}/>
                    </View>
                </View>
                :
                ledMode===1?
                <View style={styles.controlPanel}>
                    <View style={styles.dataContainer}>
                        <Text style={styles.Text}>Cycle</Text>
                        <DataSlider minVal={0} maxVal={100} step={1} onPress={updataLedCycle} value={ledCycle}/>
                    </View>
                    <View style={styles.dataContainer}>
                        <Text style={styles.Text}>Brightness</Text>
                        <DataSlider minVal={0} maxVal={100} step={10} onPress={updataLedBrightness} value={ledBrightness}/>
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
                        <DataSlider minVal={0} maxVal={100} step={10} onPress={updataLedBrightness} value={ledBrightness}/>
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
                        <Text style={styles.Text}>This Mode doesn't have Timer</Text>
                    </View>
                </View>
                :
                <View style={styles.controlPanel}>
                    <View style={styles.dataContainer}>
                    <Text style={styles.Text}>Wait Time</Text>
                        <DataSlider minVal={0} maxVal={100} step={1} onPress={updataLedWaitTime} value={ledWaitTime}/>
                    </View>
                </View>
            }</>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <Gradient fromColor='#B6B9C7' toColor='#FFFFFF' opacityColor2={0}>
            <Text style={styles.titleText}>Customized your Own Star Mode</Text>
                <View style={styles.dataContainer}>
                    <LedToggleButton title={['1st', '2nd', '3rd', '4th']} onPress={updataLedKey} theme={'White'}/>
                </View>

                <View style={styles.dataContainer}>
                    <ModeToggleButton title={['Light', 'Blink', 'Breath']} onPress={updateLedMode} val={ledMode}/>
                </View>

                    <View style={styles.dataContainer}>
                        <CustomTab title={['Parameter', `Timer`]} renderView={[viewLedParameter, viewLedTimer]}/>
                    </View>
                <View style={styles.buttonContainer}>
                    <View style={styles.sideButtonContainer}>
                        <CTAButton title={'Delete'} theme={'Dark'} onPress={() => { handleDelete()} } width={140} height={50}/>
                        <CTAButton title={'close'} theme={'Dark'} onPress={() => {handleClose()}} width={140} height={50}/>
                    </View>
                    <CTAButton title={'Save'} theme={'Dark'} onPress={async () => {await handleSave()} } width={300} height={50}/>
                </View>
            </Gradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonContainer: {
        position:'absolute',
        bottom:20,
        marginHorizontal:_screenWidth/2 - 150
    },
    sideButtonContainer: {
        flexDirection:'row',
        justifyContent:'space-between'
    },
    titleText: {
        fontSize: 30,
        fontWeight: '400',
        color: '#285476',
        marginHorizontal: 25,
        marginVertical: 8,
      },
    dataContainer: {
        justifyContent: "space-around",
        flexDirection: "row",
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