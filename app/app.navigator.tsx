import React from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import BlueToothConnectScreen from './screens/bluetooth/bluetooth.connect.screen';
import LedStartScreen from './screens/led/led.start.screen';
import LedCustomScreen from './screens/led/led.custom.screen';
import LedControllerScreen from './screens/led/led.controller.screen';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StyleSheet } from 'react-native';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigation = () => {
    return (
        <Tab.Navigator
        screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
                backgroundColor:"#285576",
                height: 60,
            },
            tabBarLabelStyle: {
                fontSize: 12,
                bottom: 6,
              },
            tabBarIcon: ({ focused, color }) => {
              let iconName = "ellipsis1";
  
              if (route.name === 'Home') {
                iconName = focused
                  ? 'ios-information-circle'
                  : 'ios-information-circle-outline';
              } else if (route.name === 'Settings') {
                iconName = focused ? 'ios-list' : 'ios-list-outline';
              } else if (route.name === 'Light Mode') {
                iconName = focused ? 'ios-star' : 'ios-star-outline';
              }
  
              // You can return any component that you like here!
              return <Ionicons name={iconName} size={36} color={color} />;
            },
            tabBarActiveTintColor: 'white',
            tabBarInactiveTintColor: 'gray',
          })}>
            <Tab.Screen name="Home" component={LedStartScreen} 
                                                options={() => ({
                                                tabBarStyle: {
                                                    display: "none",
                                                }})}
            />
            <Tab.Screen name="Light Mode" component={LedControllerScreen} />
            <Tab.Screen name="Settings" component={BlueToothConnectScreen} />
            <Tab.Screen name="Custom" component={LedCustomScreen} 
                                                options={() => ({
                                                tabBarStyle: {
                                                    display: "none",
                                                },
                                                tabBarButton: () => null,})}
            />
        </Tab.Navigator>
    )
}

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="TAB" 
            screenOptions={{headerShown: false}}
            >
                <Stack.Screen name="TAB" component={TabNavigation}></Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default AppNavigator;