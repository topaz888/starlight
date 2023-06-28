import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import CTAButton from '../../components/buttons/CTAButton';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { screenHeight, screenWidth } from '../../components/constant/constant';

interface LedScreenProps {
    navigation: NavigationProp<any,any>;
    route: RouteProp<any,any>;
  }

  const _screenWidth = screenWidth;
  const _screenHeight = screenHeight;

const LedStartScreen = (props:LedScreenProps) =>{
    return(
        <View style={styles.container}>
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
    buttonContainer: {
        position:'absolute',
        bottom: 50,
        left: _screenWidth/2-150,
    },
    background: {
        width: _screenWidth,
        height: _screenHeight,
    },
  });

  export default LedStartScreen;