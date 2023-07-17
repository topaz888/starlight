import React, { useEffect, useMemo, useRef, useState } from 'react';
import {StyleSheet, Text, View} from 'react-native';
import { NavigationProp, RouteProp, useIsFocused } from '@react-navigation/native';
import Gradient from '../../components/GradientColor';
import { screenHeight, screenWidth } from '../../components/constant/constant';
import LedToggleButton from '../../components/buttons/ToggleButton';
import Panel from '../../components/panel/CustomPanel';

interface LedControllerProps {
  navigation: NavigationProp<any,any>;
  route: RouteProp<any,any>;
}
  const _screenWidth = screenWidth;
  const _screenHeight = screenHeight;

const LedControllerScreen = (props:LedControllerProps) => {

  return (
        <View style={styles.container}>
            <Gradient fromColor='#B6B9C7' toColor='#FFFFFF' opacityColor2={0}>
                <View style={styles.container}>
                    <Text>Light Modes</Text>
                    <View style={styles.dataContainer}>
                        <LedToggleButton title={[`Presets`, `Custom`]} onPress={()=>{}} theme={'Dark'}/>
                    </View>
                    <Panel key={"Presets"}/>
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
});

export default LedControllerScreen;