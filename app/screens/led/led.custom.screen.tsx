import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, StyleSheet, View } from "react-native";
import CTAButton from '../../components/buttons/CTAButton';
import DataSlider from "../../components/sliders/DataSlider";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { updateledBrightness, updateledCycle, updateledDelay, updateledKey, setledCustomMessage, updateledMode, updateledwaitTime, uploadTabView, uploadIsPlay } from "../../redux/led/led.reducer";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { handleAddLed, handleRemoveLed } from "../../realm/led/actions/led.actions";
import { useMemo } from "react";
import { screenWidth } from "../../components/constant/constant";
import LedToggleButton from "../../components/buttons/ToggleButton";
import ModeToggleButton from "../../components/buttons/ModeToggleButton";
import CustomTab from "../../components/tabbBar/CustomTab";
import { messageNumber } from "../../models/LedMessage";
import Gradient from "../../components/GradientColor";
import CustomText from "../../components/text/CustomText";
import DataList from "../../language/EN/language.data";

const _screenWidth = screenWidth;

interface LedScreenProps {
    navigation: NavigationProp<any,any>;
    route: RouteProp<any,any>;
  }

const LedCustomScreen = (props:LedScreenProps) =>{
    const modeId = useMemo<string>(()=>{return (props.route.params?.modeId)}, [props.route.params?.modeId])

    const ledKey = useSelector(
        (state: RootState) => state.led.ledKey,
    )

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

    const IsPlay = useSelector(
        (state: RootState) => state.led.isPlaying,
    )

    const tabView = useSelector(
        (state: RootState) => state.led.tabView,
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

    const updataTabView = (message: number) => {
        dispatch(uploadTabView(message));
    }


    const handleClose = () => {
        props.navigation.navigate({ name: 'Light Mode', params: { ...props.route.params} })
    }

    const handleSave = async () => {
        await uploadMessage(ledMessage);
        if(IsPlay){
            dispatch(uploadIsPlay())
        }
    }

    const handleDelete = () =>
    Alert.alert(DataList.LedCustomScreen.Text[0], DataList.LedCustomScreen.Text[1], [
      {
        text: DataList.LedCustomScreen.Text[2],
        style: 'cancel',
      },
      { text: DataList.LedCustomScreen.Text[3], 
        onPress: async () => {await handleRemoveLed(modeId)
                              handleClose()}
      },
    ])

    const uploadMessage = async (message: messageNumber[]) => {
        try{
            const success = await handleAddLed(modeId, message);
            if(!success) Alert.alert(DataList.LedCustomScreen.Text[4], DataList.LedCustomScreen.Text[5], [
                    {
                      text: DataList.LedCustomScreen.Text[2],
                      onPress: () => {},
                      style: 'cancel',
                    }]
            );
            else props.navigation.navigate({name: 'Light Mode',params: {...props.route.params} });
        }catch(e){
            console.log(e);
        }
    }

    const viewLedParameter = () =>{
        return(
            <>{ledMode===0?
                <View style={styles.controlPanel}>
                    <View style={styles.dataContainer}>
                        <CustomText style={styles.Text}>{DataList.LedCustomScreen.Text[6]}</CustomText>
                        <DataSlider minVal={0} maxVal={100} step={10} onPress={updataLedBrightness} value={ledBrightness}/>
                    </View>
                </View>
                :
                ledMode===1?
                <View style={styles.controlPanel}>
                    <View style={styles.dataContainer}>
                        <CustomText style={styles.Text}>{DataList.LedCustomScreen.Text[7]}</CustomText>
                        <DataSlider minVal={1} maxVal={20} step={2} onPress={updataLedCycle} value={ledCycle}/>
                    </View>
                    <View style={styles.dataContainer}>
                        <CustomText style={styles.Text}>{DataList.LedCustomScreen.Text[6]}</CustomText>
                        <DataSlider minVal={0} maxVal={100} step={10} onPress={updataLedBrightness} value={ledBrightness}/>
                    </View>
                </View>
                :
                ledMode===2 &&
                <View style={styles.controlPanel}>
                    <View style={styles.dataContainer}>
                        <CustomText style={styles.Text}>{DataList.LedCustomScreen.Text[7]}</CustomText>
                        <DataSlider minVal={1} maxVal={40} step={2} onPress={updataLedCycle} value={ledCycle}/>
                    </View>
                    <View style={styles.dataContainer}>
                        <CustomText style={styles.Text}>{DataList.LedCustomScreen.Text[8]}</CustomText>
                        <DataSlider minVal={0} maxVal={10} step={2.5} onPress={updataLedDelay} value={ledDelay}/>
                    </View>
                    <View style={styles.dataContainer}>
                        <CustomText style={styles.Text}>{DataList.LedCustomScreen.Text[6]}</CustomText>
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
                        <CustomText style={styles.Text}>{DataList.LedCustomScreen.Text[9]}</CustomText>
                    </View>
                </View>
                :
                <View style={styles.controlPanel}>
                    <View style={styles.dataContainer}>
                    <CustomText style={styles.Text}>{DataList.LedCustomScreen.Text[10]}</CustomText>
                        <DataSlider minVal={0} maxVal={40} step={1} onPress={updataLedWaitTime} value={ledWaitTime}/>
                    </View>
                </View>
            }</>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <Gradient fromColor='#B6B9C7' toColor='#FFFFFF' opacityColor2={0}>
            <CustomText style={styles.titleText}>{DataList.LedCustomScreen.Text[11]}</CustomText>
                <View style={styles.dataContainer}>
                    <LedToggleButton title={[DataList.LedCustomScreen.Text[12], 
                        DataList.LedCustomScreen.Text[13], DataList.LedCustomScreen.Text[14], 
                        DataList.LedCustomScreen.Text[15]]} onPress={updataLedKey} theme={'White'} val={ledKey}/>
                </View>

                <View style={styles.dataContainer}>
                    <ModeToggleButton title={[DataList.LedCustomScreen.Text[16], 
                        DataList.LedCustomScreen.Text[17], 
                        DataList.LedCustomScreen.Text[18]]} onPress={updateLedMode} val={ledMode}/>
                </View>

                    <View style={styles.dataContainer}>
                        <CustomTab title={[DataList.LedCustomScreen.Text[19],
                             DataList.LedCustomScreen.Text[20]]} renderView={[viewLedParameter, viewLedTimer]} onPress={updataTabView} value={tabView}/>
                    </View>
                <View style={styles.buttonContainer}>
                    <View style={styles.sideButtonContainer}>
                        <CTAButton title={DataList.LedCustomScreen.Text[21]} theme={'Dark'} onPress={() => { handleDelete()} } width={140} height={50}/>
                        <CTAButton title={DataList.LedCustomScreen.Text[22]} theme={'Dark'} onPress={() => {handleClose()}} width={140} height={50}/>
                    </View>
                    <CTAButton title={DataList.LedCustomScreen.Text[23]} theme={'Dark'} onPress={async () => {await handleSave()} } width={300} height={50}/>
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
        fontSize: 18,
        color: '#215e79',
        textAlign: 'justify',
        textAlignVertical: 'center',
    },
  });
  
  export default LedCustomScreen;