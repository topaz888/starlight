import React, { useEffect } from 'react';
import {StyleSheet, Text, View} from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import Gradient from '../../components/GradientColor';
import { screenHeight, screenWidth } from '../../components/constant/constant';
import LedToggleButton from '../../components/buttons/ToggleButton';
import Panel from '../../components/panel/CustomPanel';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { moveNextMode, movePrevMode, updateledBrightness, updateledCycle, updateledTitleName, uploadMessage } from '../../redux/led/led.reducer';
import { getLedArrayByModeId, getStaticMessageByModeId } from '../../realm/led/actions/led.actions';
import { messageNumber, ledArray, LedMessage } from '../../models/LedMessage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CTAButton from '../../components/buttons/CTAButton';

interface LedControllerProps {
  navigation: NavigationProp<any,any>;
  route: RouteProp<any,any>;
}
  const _screenWidth = screenWidth;
  const _screenHeight = screenHeight;

const LedControllerScreen = (props:LedControllerProps) => {
    const dispatch = useDispatch();

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
        (state: RootState) => state.led.ledCycle,
    )
    
    const ledBrightness = useSelector(
        (state: RootState) => state.led.ledBrightness,
    )

    const handleTitleName = (titleId: Number) => {
        dispatch(updateledTitleName(titleId));
    }

    const handleForwardButton = () => {
        dispatch(moveNextMode());
    }

    const handleBackButton = () => {
        dispatch(movePrevMode());
    }

    const handlePlayButton = () => {
        dispatch(uploadMessage(modeId.toString()));
    }

    const updataLedCycle = (message: number) => {
        dispatch(updateledCycle(message));
    }

    const updataLedBrightness = (message: number) => {
        dispatch(updateledBrightness(message));
    }

    useEffect(() => {
        if(!ledConnectedDevice){
            console.log(`modeId : ${modeId}`)
            getStaticMessageByModeId(modeId.toString(), dispatch);
        }
      },[modeId])
  return (
        <View style={styles.container}>
            <Gradient fromColor='#B6B9C7' toColor='#FFFFFF' opacityColor2={0}>
                {ledConnectedDevice?
                <Text>Light Modes</Text>
                :
                <Text>Not Connected</Text>
                }
                    <View style={styles.dataContainer}>
                        <LedToggleButton title={[`Presets`, `Custom`]} onPress={handleTitleName} theme={'Dark'}/>
                    </View>
                    <Panel titleName={titleName === 0 ? 'Presets' : `Custom`}
                        modeId={modeId.toString()}
                        backward={() => handleBackButton()}
                        forward={() => handleForwardButton()}
                        play={() => handlePlayButton()}
                        cycle={ledCycle}
                        brightness={ledBrightness} 
                        updataLedCycle={updataLedCycle} 
                        updataLedBrightness={updataLedBrightness} />
                    <View style={styles.buttonContainer}>
                        <CTAButton title={'Add Custom Mode'} theme={'White'} onPress={() => {} } />
                    </View>
            </Gradient>
        </View>
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
        alignItems: 'center',
        marginVertical: 40,
    }
});

export default LedControllerScreen;