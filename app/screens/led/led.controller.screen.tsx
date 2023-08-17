import React, { useEffect, useRef, useState } from 'react';
import {Alert, SafeAreaView, StyleSheet, View} from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import Gradient from '../../components/GradientColor';
import LedToggleButton from '../../components/buttons/ToggleButton';
import Panel from '../../components/panel/CustomPanel';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { moveNextCustomIndex, moveNextStaticMode, movePrevCustomIndex, movePrevStaticMode, resetCustomMessage, updateledMessageByData, updateledTitleName, updatemainScreenledBrightness, updatemainScreenledCycle, uploadIsPlay, uploadMessage } from '../../redux/led/led.reducer';
import { bindListener, getCustomMessageByModeId, getCustomPackageByModeId, getStaticMessageByModeId, getStaticPackageByModeId, handleBacktoDefault, handleCustomAddLed, handlePersistAddLed, removeListener } from '../../realm/led/actions/led.actions';
import CTAButton from '../../components/buttons/CTAButton';
import DialogInput from '../../components/dialogInput/CustomDialogInput';
import { LedMessage, messageNumber } from '../../models/LedMessage';
import CustomText from '../../components/text/CustomText';
import DataList from '../../language/EN/language.data';

interface LedControllerProps {
  navigation: NavigationProp<any,any>;
  route: RouteProp<any,any>;
}

const LedControllerScreen = (props:LedControllerProps) => {
    const dispatch = useDispatch();
    const [visible, setVisible] = useState(false);
    const premiumRef = useRef<boolean>(true);
    
    const modeId = useSelector(
        (state: RootState) => state.led.ledStaticMode
    )
    
    const titleName = useSelector(
        (state: RootState) => state.led.ledTitleName
    )

    const ledConnectedDevice = useSelector(
        (state: RootState) => state.bluetooth.connectedDevice,
    )

    const ledCycle = useSelector(
        (state: RootState) => state.led.mainScreenledCycle,
    )
    
    const ledBrightness = useSelector(
        (state: RootState) => state.led.mainScreenBrightness,
    )

    const customNameArray = useSelector(
        (state: RootState) => state.led.customNameArray,
    )

    const IsPlay = useSelector(
        (state: RootState) => state.led.isPlaying,
    )

    const Index = useSelector(
        (state: RootState) => state.led.customNameIndex,
    )

    const handleTitleName = (titleId: number) => {
        dispatch(updateledTitleName(titleId));
    }

    const handleForwardButton = () => {
        dispatch(moveNextStaticMode());
    }

    const handleCustomForwardButton = () => {
        dispatch(moveNextCustomIndex());
    }

    const handleBackButton = () => {
        dispatch(movePrevStaticMode());
    }

    const handleCustomBackButton = () => {
        dispatch(movePrevCustomIndex());
    }

    const handleStaticPlayButton = async () => {
        dispatch(uploadIsPlay())
        if(!IsPlay){
            dispatch(uploadMessage(modeId.toString()));
            await getStaticMessageByModeId(modeId.toString(), dispatch);
            await sendPackageBymodeId(modeId.toString())
        }else{
            if(modeId > 7)
                dispatch(uploadMessage(Number(33).toString()));
        }
    }

    const handleCustomPlayButton = async () => {
        dispatch(uploadIsPlay())
        if(customNameArray[Index]){
            if(!IsPlay){
                if(customNameArray[Index]){
                    await getCustomMessageByModeId(customNameArray[Index], dispatch);
                    await sendPackageBymodeId(customNameArray[Index])
                }
            }else{
                dispatch(uploadMessage(Number(33).toString()));
            }
        }
    }

    const handleEditPage = async (modeId: string) => {
        if(modeId){
            try{
                var message = await getCustomPackageByModeId(modeId)
                if(message){
                    dispatch(updateledMessageByData(message))
                    props.navigation.navigate({name: 'Custom',params: {...props.route.params, modeId:modeId}})
                }
            }catch(e){
                console.log(e)
            }
        }
    }

    const saveBrightnessAndCycle = async (cycle: number, brightness: number) =>{
        if(IsPlay){
            try{
                titleName === 0?
                await handlePersistAddLed(modeId.toString(), {cycle:cycle, brightness: brightness})
                :
                await handleCustomAddLed(customNameArray[Index], {cycle:cycle, brightness:brightness})
                var result:messageNumber[] = titleName === 0?
                                            await getStaticPackageByModeId(modeId.toString())
                                            :
                                            await getCustomPackageByModeId(customNameArray[Index])
                if(result.length>0){
                    const messagePackage: LedMessage = {deviceId: null, messages: result};
                    dispatch(uploadMessage(messagePackage));
                }
            }catch(e){
                console.log(e)
            }
        }
    }

    const updataLedCycle = (message: number) => {
        dispatch(updatemainScreenledCycle(message));
        saveBrightnessAndCycle(message,ledBrightness);
    }

    const updataLedBrightness = (message: number) => {
        dispatch(updatemainScreenledBrightness(message));
        saveBrightnessAndCycle(ledCycle,message);
    }

    const sendPackageBymodeId = async (modeId: string) => {
        var result:messageNumber[]
        if(titleName===0){
            dispatch(uploadMessage(modeId));
            result = await getStaticPackageByModeId(modeId)
        }
        else
            result = await getCustomPackageByModeId(modeId)
        if(result.length>0){
            const messagePackage: LedMessage = {deviceId: null, messages: result};
            dispatch(uploadMessage(messagePackage));
        }
    }

    const getStaticMessage = async () => {
        try{
            if(ledConnectedDevice && IsPlay){
                await getStaticMessageByModeId(modeId.toString(), dispatch);
                await sendPackageBymodeId(modeId.toString())
            }
        }catch(e){
            console.log(e)
        }
    }

    const getCustomMessage = async () => {
        try{
            if(ledConnectedDevice && IsPlay){
                if(customNameArray[Index]){
                    await getCustomMessageByModeId(customNameArray[Index], dispatch);
                    await sendPackageBymodeId(customNameArray[Index])
                }
            }
        }catch(e){
            console.log(e)
        }
    }

    const setDefaultSetting = async (index: number) => {
        if(IsPlay){
            Alert.alert(DataList.LedControllerScreen.Text[0], DataList.LedControllerScreen.Text[1], [
                {
                text: DataList.LedControllerScreen.Text[2],
                style: 'cancel',
                },
                { text: DataList.LedControllerScreen.Text[3], 
                onPress: async () => { await handleBacktoDefault(index),
                    await getStaticMessageByModeId(modeId.toString(), dispatch);
                    await sendPackageBymodeId(modeId.toString())
                }
                },
            ])
        }
    }

    const fetchCustomData = async () => {
        try{
            await bindListener(dispatch);
        }
        catch(e){
            console.log(e);
        }
    }

    useEffect (() => {
        if(!ledConnectedDevice && IsPlay){
            dispatch(uploadIsPlay())
        }
      },[ledConnectedDevice])

    useEffect (() => {
        getStaticMessage()
      },[modeId])

      useEffect (() => {
        getCustomMessage()
      },[Index])

      useEffect (() => {
        titleName===0?getStaticMessage():getCustomMessage()
      },[titleName])

      useEffect (() => {
        if (premiumRef.current) {
            (async ()=> {await fetchCustomData()})()
            premiumRef.current = false;
        }
        return() => {
            if (!premiumRef.current){
                (async ()=> {await removeListener()})()
                premiumRef.current = true;
        }}
      },[])
  return (
        <SafeAreaView style={styles.container}>
            <Gradient fromColor='#B6B9C7' toColor='#FFFFFF' opacityColor2={0}>
                {ledConnectedDevice?
                <CustomText style={styles.titleText}>{DataList.LedControllerScreen.Text[4]}</CustomText>
                :
                <CustomText style={styles.titleText}>{DataList.LedControllerScreen.Text[5]}</CustomText>
                }
                    <View style={styles.dataContainer}>
                        <LedToggleButton title={[DataList.LedControllerScreen.Text[6], DataList.LedControllerScreen.Text[7]]} 
                        onPress={handleTitleName} theme={'Dark'} val={0}/>
                    </View>
                    <Panel titleName={titleName === 0 ? DataList.LedControllerScreen.Text[6] : DataList.LedControllerScreen.Text[7]}
                        modeId={titleName === 0 ? modeId.toString() : customNameArray[Index]}
                        backward={() => titleName === 0 ? handleBackButton() : handleCustomBackButton()}
                        forward={() => titleName === 0 ? handleForwardButton() : handleCustomForwardButton()}
                        play={() => {if(ledConnectedDevice) titleName === 0 ? handleStaticPlayButton() : handleCustomPlayButton()}}
                        cycle={titleName === 0?ledCycle:customNameArray[Index]?ledCycle:0}
                        brightness={titleName === 0?ledBrightness:customNameArray[Index]?ledBrightness:0}
                        updataLedCycle={updataLedCycle}
                        updataLedBrightness={updataLedBrightness} isPlay={IsPlay} />
                    <View style={styles.buttonContainer}>
                        {titleName === 0?
                        <><CTAButton title={DataList.LedControllerScreen.Text[8]} theme={'White'} onPress={() => { setDefaultSetting(modeId) } } width={160} height={50} />
                        <CTAButton title={DataList.LedControllerScreen.Text[9]} theme={'White'} onPress={() => { setVisible(true); } } width={160} height={50} /></>
                        :
                        <><CTAButton title={DataList.LedControllerScreen.Text[10]} theme={'White'} onPress={() => { handleEditPage(customNameArray[Index]) } } width={160} height={50} />
                        <CTAButton title={DataList.LedControllerScreen.Text[9]} theme={'White'} onPress={() => { setVisible(true); } } width={160} height={50} /></>
                        }
                    </View>
                <DialogInput 
                    isDialogVisible={visible}
                    title={DataList.LedControllerScreen.Text[11]}
                    message={DataList.LedControllerScreen.Text[12]}
                    hintInput ={DataList.LedControllerScreen.Text[13]}
                    errorMessage={DataList.LedControllerScreen.Text[16]}
                    submitInput={ (inputText) => {
                    if(customNameArray.includes(inputText)) return(Alert.alert(DataList.LedControllerScreen.Text[14],DataList.LedControllerScreen.Text[15].replace("{VARIABLE}", inputText)), setVisible(false))
                    return (
                            dispatch(resetCustomMessage()),
                            props.navigation.navigate({name: 'Custom',params: {...props.route.params, modeId:inputText} }),
                            setVisible(false)
                    )
                    }}
                    closeDialog={() => setVisible(false)}></DialogInput>
            </Gradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex:1,
    },
    dataContainer: {
        justifyContent: 'center',
        flexDirection: "row",
        marginVertical: 5,
    },
    buttonContainer:{
        flexDirection:'row',
        justifyContent: 'center',
        marginVertical: '2%',
    },
    titleText: {
        fontSize: 30,
        fontWeight: '400',
        color: '#285476',
        marginHorizontal: 25,
        marginVertical: 8,
      },
});

export default LedControllerScreen;