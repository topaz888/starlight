import React, { useEffect, useMemo } from 'react';
import {View, Image, StyleSheet, Text} from 'react-native';
import CTAButton from '../../components/buttons/CTAButton';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { screenHeight, screenWidth } from '../../components/constant/constant';
import DataSlider from '../../components/sliders/DataSlider';
import { useDispatch, useSelector } from 'react-redux';
import { updateledBrightness, updateledCycle, uploadMessage } from '../../redux/led/led.reducer';
import { RootState } from '../../redux/store';
import { LedMessage, ledArray, messageNumber } from '../../models/LedMessage';
import { getLedArrayByModeId, handlePersistAddLed } from '../../realm/led/actions/led.actions';

interface LedScreenProps {
    navigation: NavigationProp<any,any>;
    route: RouteProp<any,any>;
  }
  const _screenWidth = screenWidth;
  const _screenHeight = screenHeight;

const LedControlScreen = (props:LedScreenProps) =>{
    const modeId = useMemo<string>(()=>{return (props.route.params?.modeId)}, [props.route.params?.modeId])
    const dispatch = useDispatch();

    const ledConnectedDevice = useSelector(
        (state: RootState) => state.bluetooth.connectedDevice,
    )

    const ledCycle = useSelector(
        (state: RootState) => state.led.ledCycle,
    )
    
    const ledBrightness = useSelector(
        (state: RootState) => state.led.ledBrightness,
    )

    const databaseDefault = useSelector(
        (state: RootState) => state.led.databaseDefault,
    )

    const updataLedCycle = (message: string) => {
        dispatch(updateledCycle(message));
    }

    const updataLedBrightness = (message: string) => {
        dispatch(updateledBrightness(message));
    }

    useEffect(() => {
        console.log("LedControlScreen" + databaseDefault  );
        if(!databaseDefault){
            uploadSettingMessage();
        }
      }, [])

    const uploadSettingMessage = async () => {
        var ledArray:ledArray = await getLedArrayByModeId(modeId)
          var messages: messageNumber[] = [];
          for(let i=0; i<4; i++){
              var temp: messageNumber = {
                  mode: null,
                  delay: null,
                  brightness: ledArray.brightness?.length? +ledArray.brightness[i] * ledBrightness:null,
                  cycle: ledArray.cycle?.length? +ledArray.cycle[i] * ledCycle:null,
                  cycle2: ledArray.cycle2?.length? +ledArray.cycle2[i] * ledCycle:null,
                  waitTime: null,
                  waitTimeLen: null
              }
              messages.push(temp);
          }
          const messagePackage: LedMessage = {deviceId: null, messages: messages};
          dispatch(uploadMessage(messagePackage));
    }

    const handleChangeMessage = async () => {
          var result = await handlePersistAddLed(modeId, {cycle: ledCycle, brightness: ledBrightness});
          if(result){
            uploadSettingMessage();
          }
    }

    return(
        <View style={styles.container}>
            {modeId &&
                <View style={styles.controlPanel}>
                    <Text style={styles.TitleText}>{`Current mode: ${modeId}`}</Text>
                    {+modeId > 7 && 
                        <View style={styles.dataContainer}>
                            <Text style={styles.Text}>Cycle</Text>
                            <DataSlider minVal={0} maxVal={100} step={1} onPress={updataLedCycle} value={ledCycle} />
                        </View>
                    }
                    <View style={styles.dataContainer}>
                        <Text style={styles.Text}>Brightness</Text>
                        <DataSlider minVal={0} maxVal={100} step={1} onPress={updataLedBrightness} value={ledBrightness} />
                    </View>
                    <CTAButton title={'Save'} theme={'Dark'} onPress={async () => { handleChangeMessage(); } } />
                </View>
            }
            <View style={styles.buttonContainer}>
            {ledConnectedDevice ?
                <CTAButton title={'Choose'} theme={'Dark'} onPress={() => { props.navigation.navigate({ name: 'LEDC', params: { ...props.route.params } }); } } />
                :
                <CTAButton title={'Conect Your Statlight'} theme={'Dark'} onPress={() => { console.log("STARTPAGE"); } } />
            }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "none",
        zIndex: 0,
        justifyContent: 'center',
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
    buttonContainer: {
        position:'absolute',
        bottom: 50,
        left: _screenWidth/2-150,
    },
    background: {
        width: _screenWidth,
        height: _screenHeight,
    },
    TitleText: {
        fontSize: 25,
        fontWeight: "bold",
        textAlign: "center",
        marginHorizontal: 10,
        color: '#215e79',
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

  export default LedControlScreen;
