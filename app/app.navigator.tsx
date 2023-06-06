import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './screens/home/home.screen';
import BTScreen from './screens/BT/BT.screen';
import BlueToothConnectScreen from './screens/bluetooth/bluetooth.connect.screen';
import LEDScreen from './screens/led/led.screen';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen}></Stack.Screen>
                <Stack.Screen name="BT" component={BTScreen}></Stack.Screen>
                <Stack.Screen name="BTC" component={BlueToothConnectScreen}></Stack.Screen>
                <Stack.Screen name="LED" component={LEDScreen}></Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default AppNavigator;