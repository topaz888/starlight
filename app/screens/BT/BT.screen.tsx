import React, { useState, useEffect }from 'react';
import { Text, Button, Alert, SafeAreaView, View } from  'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { HeaderBackButton } from '@react-navigation/elements';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import Slider from '@react-native-community/slider';

interface BTScreenProps {
    navigation: NavigationProp<any,any>;
    route: RouteProp<any,any>;
}


const BTScreen = (props:BTScreenProps) => {
    useEffect( () => {
        props.navigation.setOptions({headerShown: true, headerLeft: () => (
                                        <HeaderBackButton {...props} 
                                        onPress={() => {
                                            props.navigation.navigate({name: 'Home',
                                                                       params: {  ...props.route.params }});
                                        }}/>
                                    )});
    }); 

    return (
        <View>
             <TouchableOpacity onPress={() => Alert.alert('Button 1')}>
                <Text>Button 1</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => Alert.alert('Button 2')}>
                <Text>Button 2</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => Alert.alert('Button 3')}>
                <Text>Button 3</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => Alert.alert('Button 4')}>
                <Text>Button 4</Text>
            </TouchableOpacity>

            <Slider
  style={{width: 200, height: 40}}
  minimumValue={0}
  maximumValue={1}
  minimumTrackTintColor="#FFFFFF"
  maximumTrackTintColor="#000000"
/>
        </View>
    );
}

export default BTScreen;