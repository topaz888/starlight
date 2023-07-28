import React, { useEffect, useMemo, useState } from 'react';
import {View, Image, StyleSheet, Text, Alert, ActivityIndicator, ImageBackground} from 'react-native';
import CTAButton from '../../components/buttons/CTAButton';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { screenHeight, screenWidth } from '../../components/constant/constant';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { autoPair } from '../../redux/bluetooth/bluetooth.reducer';
import { delay } from 'redux-saga/effects';
import Loading from '../../components/loading/CustomLoading';
import { loadStaticData } from '../../realm/led/actions/led.actions';

interface LedScreenProps {
    navigation: NavigationProp<any,any>;
    route: RouteProp<any,any>;
  }
  const _screenWidth = screenWidth;
  const _screenHeight = screenHeight;

const LedStartScreen = (props:LedScreenProps) =>{
    const [renderAtBegin, setRenderAtBegin] = useState<boolean>(true);
    const [loadingDone, setLoadingDone] = useState<boolean>(false);
    const dispatch = useDispatch();

    const ledConnectedDevice = useSelector(
        (state: RootState) => state.bluetooth.connectedDevice,
    )

    const bondedDevice = useSelector(
        (state: RootState) => state.bluetooth.isNotBondedDevice,
    )

    useEffect(() => {
        console.log("LedStartScreen");
        var done = (async()=>await loadStaticData())()
        setLoadingDone(!!done);
        if(renderAtBegin){
            dispatch(autoPair());
            setRenderAtBegin(false);
        }
        if(!bondedDevice){
            // AutoPairAlert();
        }
      }, [,bondedDevice])

    const AutoPairAlert = () =>{    
        return Alert.alert('Warning', 'BlueTooth Pairing Request', [
        {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
        },
        {   text: 'Yes', 
            onPress: () => props.navigation.navigate({name: 'BTC',params: {  ...props.route.params }})
        },
        ])
    }

    return(
        <View style={styles.container}>
            <ImageBackground source={require('../../../assets/image/fontPage.jpg')} resizeMode="cover" style={styles.bgPic}>
            {!loadingDone &&<Loading timer={2}/>}
            <View style={styles.buttonContainer}>
            {ledConnectedDevice ?
                <CTAButton title={'Choose'} theme={'White'} onPress={() => { props.navigation.navigate({ name: 'Light Mode', params: { ...props.route.params } }); } } width={300} height={50} />
                :
                <CTAButton title={'Conect Your Statlight'} theme={'White'} onPress={() => { props.navigation.navigate({ name: 'Settings', params: { ...props.route.params } }); } } width={300} height={50} />
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
        backgroundColor: '#132D3E',
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
  });

  export default LedStartScreen;
