import React, { useEffect, useState } from 'react';
import {View, StyleSheet, ImageBackground} from 'react-native';
import CTAButton from '../../components/buttons/CTAButton';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { screenHeight, screenWidth } from '../../components/constant/constant';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { autoPair } from '../../redux/bluetooth/bluetooth.reducer';
import { loadStaticData } from '../../realm/led/actions/led.actions';
import { uploadIsTurnOff, uploadMessage } from '../../redux/led/led.reducer';
import CustomText from '../../components/text/CustomText';

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
        (state: RootState) => state.led.isTurnOff,
    )

    useEffect(() => {
        console.log("LedStartScreen");
        (async()=>await loadStaticData())()
        if(renderAtBegin){
            dispatch(autoPair());
            setRenderAtBegin(false);
        }
      }, [])


    const handleTurnOffButton = () =>{
        console.log(isTurnOff)
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
            <ImageBackground source={require('../../../assets/image/fontPage.jpg')} resizeMode="cover" style={styles.bgPic}>
                <CustomText style={styles.versionText}> Version: 1.5.4</CustomText>
            <View style={styles.buttonContainer}>
            {ledConnectedDevice ?
                <>
                    <CTAButton title={isTurnOff?'Turn On' : 'Turn Off'} theme={'White'} onPress={() => {handleTurnOffButton()} } width={300} height={50} />
                    <CTAButton title={'Choose'} theme={'White'} onPress={() => { props.navigation.navigate({ name: 'Light Mode', params: { ...props.route.params } }); } } width={300} height={50} />
                </>
                :
                <CTAButton title={'Connect Your Starlight'} theme={'White'} onPress={() => { props.navigation.navigate({ name: 'Settings', params: { ...props.route.params } }); } } width={300} height={50} />
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
    versionText:{
        fontSize: 16,
        color: '#ffffff',
        fontWeight: '400',
        position:'absolute',
        left: _screenWidth/2-50,
        top: _screenHeight/2-190
    }
  });

  export default LedStartScreen;
