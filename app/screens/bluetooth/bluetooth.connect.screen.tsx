import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import React, { useEffect, useState } from "react";
import {
    SafeAreaView,
    StyleSheet,
    View,
    Image
  } from 'react-native';
import { scanForPeripherals, initiateConnection, disconnectPeripheral, updateTimerFlag } from "../../redux/bluetooth/bluetooth.reducer";
import CTAButton from "../../components/buttons/CTAButton";
import { BluetoothPeripheral } from "../../models/BluetoothPeripheral";
import DeviceModal from "../../components/modals/DeviceConnectionModal";
import { screenWidth } from "../../components/constant/constant";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import CustomText from "../../components/text/CustomText";
import DataList from "../../language/EN/language.data";

interface BluetoothScreenProps {
  navigation: NavigationProp<any,any>;
  route: RouteProp<any,any>;
}

const _screenWidth = screenWidth;
const BlueToothConnectScreen = (props: BluetoothScreenProps) => {
    const dispatch = useDispatch();
    const devices = useSelector(
      (state: RootState) => state.bluetooth.availableDevices,
    );

    const isBluetoothEnable = useSelector(
      (state: RootState) => state.bluetooth.isBluetoothEnable,
    );

    const isConnected = useSelector(
      (state: RootState) => state.bluetooth.connectedDevice,
    );

    const deviceName = useSelector(
      (state: RootState) => state.bluetooth.deviceName,
    );
    
  const scanForDevices = () => {
      dispatch(scanForPeripherals());
  };

  const Disconnct = (id: string) => {
    dispatch(disconnectPeripheral(id));
};

useEffect(()=>{
  if(isConnected){
    props.navigation.navigate({name: 'Light Mode',params: {...props.route.params} })
  }
},[isConnected])

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const closeModal = () => {
      setIsModalVisible(false);
      dispatch(updateTimerFlag(true));
  }

  const connectToPeripheral = (device: BluetoothPeripheral) => {
    dispatch(initiateConnection(device));
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.blueToothPic} source={require('../../../assets/image/bluetooth.png')}/>
      <View style={styles.titleWrapper}>
        {isConnected ? (
          <>
            <CustomText style={styles.titleText}>{DataList.BlueToothConnectScreen.Text[0]}{deviceName}</CustomText>
          </>
        ) : (
          <CustomText style={styles.titleText}>
            {DataList.BlueToothConnectScreen.Text[1]}
          </CustomText>
        )}
      </View>
      <View style={styles.buttonContainer}>
      {isConnected ? 
      <CTAButton
            title={DataList.BlueToothConnectScreen.Text[2]}
            theme={'Dark'}
            onPress={() => {
              Disconnct(isConnected);
            } } width={260} height={50}/>
      :
      <CTAButton
            title={DataList.BlueToothConnectScreen.Text[3]}
            theme={'Dark'}
            onPress={() => {
              scanForDevices();
              setIsModalVisible(true);
            } } width={260} height={50}/>
      }
      </View>
      <DeviceModal
        devices={devices}
        visible={isModalVisible}
        closeModal={closeModal}
        connectToPeripheral={connectToPeripheral}
        enableState={isBluetoothEnable}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  blueToothPic: {
    width: 300,
    height: 300,
    margin: 30,
  },
  titleWrapper: {
    flex: 1,
  },
  buttonContainer: {
    bottom: 40,
},
  titleText: {
    fontSize: 26,
    fontWeight: '500',
    textAlign: 'center',
    color: '#285476',
  },
});

  export default BlueToothConnectScreen;