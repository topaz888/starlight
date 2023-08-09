import {BleError, BleManager, Characteristic, Device} from 'react-native-ble-plx';
import blemanager from 'react-native-ble-manager';
import { Buffer } from "buffer";
import { LogBox, PermissionsAndroid, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { ESP32_CHARACTERISTIC, ESP32_CHARACTERISTIC2, ESP32_UUID, Server_Name } from '../../components/constant/constant';
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
  getBluetoothState = async () => {
    const state = await this.bleManager.state();
    if(state==='PoweredOn') return true;
    else return false;
  }

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

  BondingPeripherals = async (identifier: string) => {
    console.log("BondingPeripherals");
    var peripheral = await this.getBondedPeripherals()
    if(!peripheral){
      console.log("start to bond")
      blemanager.createBond(identifier).then(() => {
          console.log('createBond success or there is already an existing one');
      })
      .catch((e) => {
          console.log("Error: " + e);
      })}
  };

  getBondedPeripherals = async() => {
    console.log("getBondedPeripherals");
    try{
      const peripheralsArray = await blemanager.getBondedPeripherals();
      console.log(peripheralsArray)
      var peripheral = peripheralsArray.filter(peripheral => {return peripheral.name?.toLowerCase()?.includes(Server_Name);})
      if(peripheral.length!=0){
        console.log("Found Bonded Peripherals: " + peripheral[0]?.id??"UnkownName");
        return peripheral[0];
      }else{
        console.log("Found Bond Peripherals: Nothing is Bonded")
      }
    }catch(e){
      console.log(e);
    }
  }

  stopScanningForPeripherals = () => {
    this.bleManager.stopDeviceScan();
  };

  disconnectToPeripheral = async (identifier: string) => {
    try{
      if(identifier){
        await this.bleManager.cancelDeviceConnection(identifier);
      }
      this.device = null;
    }catch(e){
      console.log(e);
    }
  };

  connectToPeripheral = async (identifier: string) => {
    if(identifier){
      try{this.device = await this.bleManager.connectToDevice(identifier);
        console.log("Conect Peripherals: " + this.device.id??"UnkownName")
        return true
      }catch(e){
        console.log('Device is disconnected');
      }
    }
    return false
  };
  
  addConnectListener = (identifier:string, emit: (payload: boolean) => void) => {
    console.log("addConnectListener")
    var subscription = this.bleManager.onDeviceDisconnected(identifier, (error) => {
      if (error) {
        this.device = null;
        emit(true)
      }else{
        emit(true)
      }
    })
    return subscription
  }

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

  encodeRequest = (message : Message) => {
    let val = message.message;
    if(typeof val == 'string'){
      val = +val;
    }
    let rawData = '';
    try{
      rawData = Buffer.from(`${val.toString(16)}`, 'utf-8').toString('base64');
      console.log(`send: ${val.toString(16)} => ${rawData}`);
    }catch(e){
      console.log(e)
    }
    return rawData;
  }

  sendSignal = async (message: Message) => {
    // console.log(message.message);
    const request = this.encodeRequest(message);
    // console.log(request);
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
            console.log("sned signal"+e);
        };
      }
  }
}

const bluetoothLeManager = new BluetoothLeManager();

export default bluetoothLeManager;