import React, { useEffect, useState } from 'react';
import {View, StyleSheet, ImageBackground, SafeAreaView} from 'react-native';
import CTAButton from '../../components/buttons/CTAButton';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { screenHeight, screenWidth } from '../../components/constant/constant';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { autoPair, sendMessage, uploadIsTurnOff } from '../../redux/bluetooth/bluetooth.reducer';
import { loadStaticData } from '../../realm/led/actions/led.actions';
import { uploadMessage } from '../../redux/led/led.reducer';
import CustomText from '../../components/text/CustomText';
import DataList from '../../language/EN/language.data';
import { Message } from '../../models/BluetoothPeripheral';
import { delay } from 'redux-saga/effects';

interface LedScreenProps {
    navigation: NavigationProp<any,any>;
    route: RouteProp<any,any>;
  }
  const _screenWidth = screenWidth;
  const _screenHeight = screenHeight;

const LedStartScreen = (props:LedScreenProps) =>{
    const [renderAtBegin, setRenderAtBegin] = useState<boolean>(true);
    const dispatch = useDispatch();

    const ledConnectedDevice = useSelector(
        (state: RootState) => state.bluetooth.connectedDevice,
    )

    const isTurnOff = useSelector(
        (state: RootState) => state.bluetooth.isTurnOff,
    )

    const isloading = useSelector(
        (state: RootState) => state.bluetooth.isLoading,
    )

    useEffect(() => {
        (async()=>await loadStaticData())()
        if(renderAtBegin){
            dispatch(autoPair());
            setRenderAtBegin(false);
        }
      }, [])

      useEffect(() => {
        if(ledConnectedDevice && !isloading){
            delay(1000)
            dispatch(uploadMessage(Number(33).toFixed()))
        }
      }, [ledConnectedDevice])

    const handleTurnOffButton = () =>{
        if(isTurnOff){
            dispatch(uploadIsTurnOff())
            dispatch(uploadMessage(Number(31).toFixed()))
        }else{
            dispatch(uploadIsTurnOff())
            dispatch(uploadMessage(Number(32).toFixed()))
        }
    }

    return(
        <View style={styles.container}>
            <ImageBackground source={require('../../../assets/image/frontPage.png')} resizeMode="cover" style={styles.bgPic}>
                <CustomText style={styles.versionText}>{DataList.LedStartScreen.Text[4]}</CustomText>
            <View style={styles.buttonContainer}>
            {ledConnectedDevice ?
                <>
                    <CTAButton title={isTurnOff?DataList.LedStartScreen.Text[0]:DataList.LedStartScreen.Text[1]} theme={'White'} onPress={() => {handleTurnOffButton()} } width={300} height={50} />
                    <CTAButton title={DataList.LedStartScreen.Text[2]} theme={'White'} onPress={() => { props.navigation.navigate({ name: 'Light Mode', params: { ...props.route.params } }); } } width={300} height={50} />
                </>
                :
                <CTAButton title={DataList.LedStartScreen.Text[3]} theme={'White'} onPress={() => { props.navigation.navigate({ name: 'Settings', params: { ...props.route.params } }); } } width={300} height={50} />
            }
            </View>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    bgPic: {
        width: _screenWidth,
        height: _screenHeight,
        resizeMode: 'stretch',
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
    versionText:{
        fontSize: 16,
        color: '#ffffff',
        fontWeight: '400',
        position:'absolute',
        left: _screenWidth/2-50,
        top: _screenHeight/2-100
    }
  });

  export default LedStartScreen;
