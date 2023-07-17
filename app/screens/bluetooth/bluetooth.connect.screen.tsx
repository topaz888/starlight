import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import React, { useState } from "react";
import {
    SafeAreaView,
    Text,
    StyleSheet,
    View,
    Image
  } from 'react-native';
import { scanForPeripherals, initiateConnection, disconnectPeripheral } from "../../redux/bluetooth/bluetooth.reducer";
import CTAButton from "../../components/buttons/CTAButton";
import { BluetoothPeripheral } from "../../models/BluetoothPeripheral";
import DeviceModal from "../../components/modals/DeviceConnectionModal";
import { screenWidth } from "../../components/constant/constant";
import { NavigationProp, RouteProp } from "@react-navigation/native";

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

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const closeModal = () => setIsModalVisible(false);

  const connectToPeripheral = (device: BluetoothPeripheral) =>
    dispatch(initiateConnection(device));

  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.blueToothPic} source={require('../../../assets/image/bluetooth.png')}/>
      <View style={styles.titleWrapper}>
        {isConnected ? (
          <>
            <Text style={styles.titleText}>Connected Decvice: {deviceName}</Text>
          </>
        ) : (
          <Text style={styles.titleText}>
            Please search for Your pannel by clicking on "Find My Starlight Pannel"
          </Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
      {isConnected ? 
      <CTAButton
      title="Disconnect"
      theme={'Dark'}
      onPress={() => {
        Disconnct(isConnected);
      }}
      />
      :
      <CTAButton
        title="Find My Starlight Panel"
        theme={'Dark'}
        onPress={() => {
          scanForDevices();
          setIsModalVisible(true);
        }}
      />
      }
      </View>
      <DeviceModal
        devices={devices}
        visible={isModalVisible}
        closeModal={closeModal}
        connectToPeripheral={connectToPeripheral}
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
    bottom: 100,
},
  titleText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#285476',
  },
});

  export default BlueToothConnectScreen;