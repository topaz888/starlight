import {BleError, BleManager, Characteristic, Device} from 'react-native-ble-plx';
import { Buffer } from "buffer";
import { LogBox, PermissionsAndroid, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { ESP32_CHARACTERISTIC, ESP32_CHARACTERISTIC2, ESP32_UUID } from '../../components/constant/constant';
import { Message } from '../../models/BluetoothPeripheral';

LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message

class BluetoothLeManager {
  bleManager: BleManager;
  device: Device | null;

  constructor() {
    this.bleManager = new BleManager();
    this.device = null;
  }

  requestAndroid31Permissions = async () => {
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

  requestPermissions = async () => {
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
          await this.requestAndroid31Permissions();
        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  };

  scanForPeripherals = (
    //argument that will be state and store in saga later
    onDeviceFound: (arg: {
      payload: BleError | Device | null;
    }) => void,
  ) => {
    this.bleManager.startDeviceScan(null, null, (error, scannedDevice) => {
      onDeviceFound({payload: scannedDevice ?? error});
      return;
    });
    return () => {
      //run this action to stop
      this.bleManager.stopDeviceScan();
      console.log("stop scan");
    };
  };

  stopScanningForPeripherals = () => {
    this.bleManager.stopDeviceScan();
  };

  connectToPeripheral = async (identifier: string) => {
    if(this.device?.id != identifier)
      this.device = await this.bleManager.connectToDevice(identifier);
  };

  decodeRequest = (val : string) => {
    let rawData = Buffer.from(val, 'base64').toString('utf8');
    return rawData;
  }

  rvSignalUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null,
    emitter: (arg0: {payload: number | BleError}) => void,
  ) => {
    if (error) {
      console.log(error);
      return -1; 
    } else if (!characteristic?.value) {
      console.log("No Data was recieved");
      return -1;
    }
    let rvsignal: number = -1;
    const rawData = this.decodeRequest(characteristic.value);
    rvsignal = rawData.charCodeAt(0);
    console.log(`send : ${rvsignal}`);
    emitter({payload: rvsignal})
    console.log(`Receive : ${rvsignal}`);
  };

  startStreamingData = async (emitter: (arg0: {payload: number | BleError}) => void,
  ) => {
        await this.device?.discoverAllServicesAndCharacteristics();
        this.device?.monitorCharacteristicForService(
        ESP32_UUID,
        ESP32_CHARACTERISTIC,
        (error, characteristic) =>
        this.rvSignalUpdate(error, characteristic, emitter),
      );
  }; 

  encodeRequest = (val : number) => {
    console.log(`send : ${val}`);
    let rawData = Buffer.from(`${val}`, 'utf8').toString('base64');
    return rawData;
  }

  sendSignal =async (
    message: Message
  ) => {
    const request = this.encodeRequest(message.message);
    if(message.deviceId!=null){
        try {
            await this.device?.discoverAllServicesAndCharacteristics();
            this.bleManager.writeCharacteristicWithResponseForDevice(
              message.deviceId,
              ESP32_UUID,
              ESP32_CHARACTERISTIC2,
              `${request}`,
            ) 
        }
        catch (e) {
            console.log(e);
        };
      }
    }
}

const bluetoothLeManager = new BluetoothLeManager();

export default bluetoothLeManager;