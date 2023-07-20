import React from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './screens/home/home.screen';
import BTScreen from './screens/BT/BT.screen';
import BlueToothConnectScreen from './screens/bluetooth/bluetooth.connect.screen';
import LedScreen from './screens/led/led.screen';
import LedUserDefinedScreen from './screens/led/led.usesrdefined.screen';
import LedChoiceScreen from './screens/led/led.choice.screen';
import LedStartScreen from './screens/led/led.start.screen';
import LedCustomScreen from './screens/led/led.custom.screen';
import LedControlScreen from './screens/led/led.control.screeen';
import LedControllerScreen from './screens/led/led.controller.screen';
import { createStackNavigator } from '@react-navigation/stack';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home" 
            // screenOptions={{headerShown: false}}
            >
                <Stack.Screen name="Home" component={HomeScreen}></Stack.Screen>
                <Stack.Screen name="BT" component={BTScreen}></Stack.Screen>
                <Stack.Screen name="LEDS" component={LedStartScreen}></Stack.Screen>
                <Stack.Screen name="BTC" component={BlueToothConnectScreen}></Stack.Screen>
                <Stack.Screen name="LED" component={LedScreen}></Stack.Screen>
                <Stack.Screen name="LEDUD" component={LedUserDefinedScreen}></Stack.Screen>
                <Stack.Screen name="LEDC" component={LedChoiceScreen}></Stack.Screen>
                <Stack.Screen name="LEDCO" component={LedControlScreen}></Stack.Screen>
                <Stack.Screen name="LEDCOL" component={LedControllerScreen}></Stack.Screen>
                <Stack.Screen name="LEDCU" component={LedCustomScreen}></Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default AppNavigator;