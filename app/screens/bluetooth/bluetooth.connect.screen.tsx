import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import React, { useState } from "react";
import {
    SafeAreaView,
    Text,
    StyleSheet,
    View
  } from 'react-native';
import { scanForPeripherals, initiateConnection } from "../../redux/bluetooth/bluetooth.reducer";
import CTAButton from "../../components/buttons/CTAButton";
import { BluetoothPeripheral } from "../../models/BluetoothPeripheral";
import DeviceModal from "../../components/modals/DeviceConnectionModal";


const BlueToothConnectScreen = () => {
    const dispatch = useDispatch();
    const devices = useSelector(
      (state: RootState) => state.bluetooth.availableDevices,
    );

    const isConnected = useSelector(
      (state: RootState) => !!state.bluetooth.connectedDevice,
    );

    const deviceName = useSelector(
      (state: RootState) => state.bluetooth.deviceName,
    );
    
  const scanForDevices = () => {
      dispatch(scanForPeripherals());
  };

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const closeModal = () => setIsModalVisible(false);

  const connectToPeripheral = (device: BluetoothPeripheral) =>
    dispatch(initiateConnection(device));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heartRateTitleWrapper}>
        {isConnected ? (
          <>
            <Text style={styles.heartRateTitleText}>Connected Decvice: {deviceName}</Text>
          </>
        ) : (
          <Text style={styles.heartRateTitleText}>
            Please Connect to esp32
          </Text>
        )}
      </View>
      <CTAButton
        title="Connect"
        onPress={() => {
          scanForDevices();
          setIsModalVisible(true);
        }}
      />
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
    backgroundColor: '#f2f2f2',
  },
  heartRateTitleWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartRateTitleText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  heartRateText: {
    fontSize: 25,
    marginTop: 15,
  },
});

  export default BlueToothConnectScreen;