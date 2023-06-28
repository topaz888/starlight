/* eslint-disable no-bitwise */
import { useMemo, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
} from "react-native-ble-plx";

// import * as ExpoDevice from "expo-device";

import DeviceInfo from "react-native-device-info";

import base64 from 'react-native-base64';

const ESP32_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const ESP32_CHARACTERISTIC = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';
const ESP32_CHARACTERISTIC2 = '07722847-9d7e-4e80-992b-450df6cddc3c';

import { LogBox } from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

interface BluetoothLowEnergyApi {
  requestPermissions(): Promise<boolean>;
  scanForPeripherals(): void;
  connectToDevice: (deviceId: Device) => Promise<void>;
  disconnectFromDevice: (connectedDevice: Device) => void;
  connectedDevice: Device | null;
  allDevices: Device[];
  rvSignal: number;
  sdSignal(
    device: Device,
    val: number,
  ):Promise<void>;
  signalError: BleError | null;
}

function useBLE(): BluetoothLowEnergyApi {
  const bleManager = useMemo(() => new BleManager(), []);
  const [allDevices, setAllDevices] = useState<Device[]>([]);  
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [rvSignal, setrvSignal] = useState<number>(0);
  const [signalError, setsignalError] = useState<BleError | null>(null)

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );

    return (
      bluetoothScanPermission === "granted" &&
      bluetoothConnectPermission === "granted" &&
      fineLocationPermission === "granted"
    );
  };

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      const apiLevel = await DeviceInfo.getApiLevel();
      if (apiLevel < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "Bluetooth Low Energy requires Location",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionsGranted =
          await requestAndroid31Permissions();

        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  };

  const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

  const scanForPeripherals = () => {
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
      }

      if (device && device.name?.includes("ESP32_SERVER")) {
        setAllDevices((prevState: Device[]) => {
          if (!isDuplicteDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });
  };

  const connectToDevice = async (device: Device) => {
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevice(deviceConnection);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      bleManager.stopDeviceScan();
      startStreamingData(deviceConnection);
    } catch (e) {
      console.log("FAILED TO CONNECT", e);
    }
  };

  const disconnectFromDevice = (connectedDevice: Device) => {
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
      setrvSignal(-1);
    }
  };

  const rvSignalUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null
  ) => {
    if (error) {
      console.log(error);
      return -1; 
    } else if (!characteristic?.value) {
      console.log("No Data was recieved");
      return -1;
    }
    let rvsignal: number = -1;
    const rawData = atob(characteristic.value);
    rvsignal = rawData.charCodeAt(0);
    console.log(`Receive : ${rvsignal}`);

    setrvSignal(rvsignal);
  };

  const startStreamingData = async (device: Device) => {
    if (device) {
        device.monitorCharacteristicForService(
        ESP32_UUID,
        ESP32_CHARACTERISTIC,
        rvSignalUpdate
      );
    } else {
      console.log("No Device Connected");
    }
  };

  const encodeRequest = (val : number) => {
    let rawData = val;
    console.log(`send : ${val}`);
    return rawData;
  }

  const sdSignal =async (
    device: Device,
    val: number,
  ) => {
    const request = encodeRequest(val);
    setsignalError(null);
    try {
      await bleManager.writeCharacteristicWithResponseForDevice(
        device.id,
        ESP32_UUID,
        ESP32_CHARACTERISTIC2,
        btoa(`${request}`),
      ) 
    }
    catch (e) {
        console.log(e);
    };
  }


  return {
    scanForPeripherals,
    requestPermissions,
    connectToDevice,
    allDevices,
    connectedDevice,
    disconnectFromDevice,
    rvSignal,
    sdSignal,
    signalError,
  };
}

export default useBLE;
