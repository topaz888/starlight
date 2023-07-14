import React, { useMemo } from 'react';
import {View, Image, StyleSheet, Text} from 'react-native';
import CTAButton from '../../components/buttons/CTAButton';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { screenHeight, screenWidth } from '../../components/constant/constant';
import DataSlider from '../../components/sliders/DataSlider';
import { useDispatch, useSelector } from 'react-redux';
import { updateledBrightness, updateledCycle, uploadMessage } from '../../redux/led/led.reducer';
import { RootState } from '../../redux/store';
import { LedMessage, brightAndCycleNumber, messageNumber } from '../../models/LedMessage';
import { handlePersistAddLed } from '../../realm/led/actions/led.actions';

interface LedScreenProps {
    navigation: NavigationProp<any,any>;
    route: RouteProp<any,any>;
  }

  const _screenWidth = screenWidth;
  const _screenHeight = screenHeight;

const LedStartScreen = (props:LedScreenProps) =>{
    const modeId = useMemo<string>(()=>{return (props.route.params?.modeId)}, [props.route.params?.modeId])
    const dispatch = useDispatch();

    const ledCycle = useSelector(
        (state: RootState) => state.led.ledCycle,
      );

    const ledBrightness = useSelector(
        (state: RootState) => state.led.ledBrightness,
    );

    const updataLedCycle = (message: string) => {
        dispatch(updateledCycle(message));
    }

    const updataLedBrightness = (message: string) => {
        dispatch(updateledBrightness(message));
    }

    const uploadChangeMessage = async () => {
          var result = await handlePersistAddLed(modeId, {cycle: ledCycle, brightness: ledBrightness});
          console.log(result);
          if(!!result){
            var messages: messageNumber[] = [];
            for(let i=0; i<4; i++){
                var temp: messageNumber = {
                    mode: null,
                    delay: null,
                    brightness: result.brightness[i],
                    cycle: result.cycle[i],
                    cycle2: result.cycle2[i],
                    waitTime: null,
                    waitTimeLen: null
                }
                messages.push(temp);
            }
            const messagePackage: LedMessage = {deviceId: null, messages: messages};
            dispatch(uploadMessage(messagePackage));
         }
      }

    return(
        <View style={styles.container}>
        {modeId &&
                <View style={styles.controlPanel}>
                     <Text style={styles.TitleText}>{`Current mode: ${modeId}`}</Text>
                    {+modeId>7 &&<View style={styles.dataContainer}>
                        <Text style={styles.Text}>Cycle</Text>
                        <DataSlider minVal={0} maxVal={100} step={1} onPress={updataLedCycle} value={ledCycle}/>
                    </View>}
                    <View style={styles.dataContainer}>
                        <Text style={styles.Text}>Brightness</Text>
                        <DataSlider minVal={0} maxVal={100} step={1  } onPress={updataLedBrightness} value={ledBrightness}/>
                    </View>
                    <CTAButton title={'Save'} onPress={async ()=>{ uploadChangeMessage()}}/>
                </View>}
        <Image
            style={styles.background}
            source={require('../../../assets/image/startScreen.jpg')}
        />
            <View style={styles.buttonContainer}>
                <CTAButton title={'Start'} onPress={()=>{}}/>
                <CTAButton title={'Choose'} onPress={()=>{props.navigation.navigate({name: 'LEDC',params: {  ...props.route.params }})}}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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

  export default LedStartScreen;
