import React, {useState} from 'react';
import { Text, Alert, View } from  'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationProp, RouteProp } from '@react-navigation/native';

interface HomeScreenProps {
    navigation: NavigationProp<any,any>;
    route: RouteProp<any,any>;
}

const HomeScreen = (props: HomeScreenProps) => {
    return (
        <View>
            <TouchableOpacity onPress={() => props.navigation.navigate({name: 'LEDS',params: {  ...props.route.params }})}>
                <Text>Start</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => props.navigation.navigate({name: 'BTC',params: {  ...props.route.params }})}>
                <Text>BTConnect</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => props.navigation.navigate({name: 'LED',params: {  ...props.route.params }})}>
                <Text>LightController</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => props.navigation.navigate({name: 'LEDCOL',params: {  ...props.route.params }})}>
                <Text>LightController2</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => props.navigation.navigate({name: 'LEDC',params: {  ...props.route.params }})}>
                <Text>Choose</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => props.navigation.navigate({name: 'LEDUD',params: {  ...props.route.params }})}>
                <Text>UserDefine</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => props.navigation.navigate({name: 'LEDCO',params: {  ...props.route.params }})}>
                <Text>Control</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => props.navigation.navigate({name: 'LEDCU',params: {  ...props.route.params }})}>
                <Text>Custom</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => props.navigation.navigate({name: 'BT',params: {  ...props.route.params }})}>
                <Text>BlueTooth</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => Alert.alert('Wifi Undefined')}>
                <Text>Wifi</Text>
            </TouchableOpacity>
        </View>
    );
}

export default HomeScreen;