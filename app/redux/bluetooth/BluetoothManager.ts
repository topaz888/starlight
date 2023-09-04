import {BleError, BleManager, Characteristic, Device} from 'react-native-ble-plx';
import blemanager from 'react-native-ble-manager';
import { Buffer } from "buffer";
import { LogBox, PermissionsAndroid, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { ESP32_CHARACTERISTIC, ESP32_CHARACTERISTIC2, ESP32_UUID, Server_Name } from '../../components/constant/constant';
import { Message } from '../../models/BluetoothPeripheral';
import { getUUIDios, handleAddBTuuid } from '../../realm/led/actions/led.actions';
import plugin from '@realm/babel-plugin';

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

  //extract bluetooth state from the device
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
    this.bleManager.startDeviceScan([ESP32_UUID], null, (error, scannedDevice) => {
      onDeviceFound({payload: scannedDevice ?? error});
      return;
    });
    return () => {
      //run this action to stop
      this.bleManager.stopDeviceScan();
    };
  };

  //try to actively bond device [android ONLY] (not using anymore)
  BondingPeripherals = async (identifier: string) => {
    if(identifier){
      if(this.device) return false
      blemanager.createBond(identifier).then(() => {
          console.log('createBond success or there is already an existing one');
          return true
      })
      .catch((e) => {
          console.log("Error: " + e);
      })}
      return false
  };

  //looking for bonded-devices list, first, then if there is one device avialble, it will connect directly. 
  getBondedPeripherals = async() => {
    try{
      if(Platform.OS === 'ios'){
        const peripheralsArray = await this.bleManager.connectedDevices([ESP32_UUID]);
        var Device = peripheralsArray.filter(peripheral => {return peripheral.name?.toLowerCase()?.includes(Server_Name);})
        if(Device.length!=0){
          this.setIosUUID(Device[0].id, Device[0].name??Server_Name)
          var resultIos = Device.map(({id, name})=>({id, name}))
          return resultIos
        }else{
          const uuid = await getUUIDios()
          return uuid
        }
      }
      else if(Platform.OS === 'android'){
        const peripheralsArray = await blemanager.getBondedPeripherals();
        var peripheral = peripheralsArray.filter(peripheral => {return peripheral.name?.toLowerCase()?.includes(Server_Name);})
        if(peripheral.length!=0){
          return peripheral;
        }
      }
    }catch(e){
      console.log(e);
    }
  }

  isbonded = async (id: string) =>{
    if(Platform.OS === 'android'){
      const peripheralsArray = await blemanager.getBondedPeripherals();
      var peripheral = peripheralsArray.filter(peripheral => {return peripheral.id?.toLowerCase()?.includes(id.toLowerCase());})
      if(peripheral.length!=0){
        return true
      }
    }else{
      return true
    }
    return false
  }

  stopScanningForPeripherals = () => {
    this.bleManager.stopDeviceScan();
  }

  disconnectToPeripheral = async (identifier: string) => {
    try{
      this.device = null;
      if(identifier){
        if(await this.isDeviceConnected(identifier))
          await this.bleManager.cancelDeviceConnection(identifier);
      }
    }catch(e){
      console.log("disconnectToPeripheral", e);
    }
  };

  //decouping uuid setup [ios only]
  setIosUUID = async (identifier:string, name:string) => {
    if(Platform.OS === 'ios')
    await handleAddBTuuid(identifier, name)
  }

  connectToPeripheral = async (identifier: string) => {
    if(identifier){
      if(this.device) return false
      try{
        const connectedDevice = await this.bleManager.connectToDevice(identifier);
        if(connectedDevice){
          this.device = connectedDevice;
          const result = this.isDeviceConnected(this.device.id)
          return result
        }
      }catch(e){
        console.log("connection error",e);
      }
    }
    return false
  };

  isDeviceConnected = async (identifier:string ) => {
    const result = await this.bleManager.isDeviceConnected(identifier)
    return result
  }
  

  //subscribe a listener and ckeck it weather or not keeping connection
  addConnectListener = (identifier:string, emit: (payload: boolean) => void) => {
    try{
      var subscription = this.bleManager.onDeviceDisconnected(identifier, (error) => {
        if (error) {
          console.log("addConnectListener", error)
          emit(true)
        }else{
          emit(true)
        }
      })
      return subscription
    }catch(e){
      console.log("addConnectListener", e)
      emit(true)
    }
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
      // console.log(error);
      return -1;
    } else if (!characteristic?.value) {
      return -1;
    }
    if(characteristic.value){
      let rvsignal: number = -1;
      const rawData = this.decodeRequest(characteristic.value);
      rvsignal = rawData.charCodeAt(0);
      emitter({payload: rvsignal})
    }
  };

  startStreamingData = async (emitter: (arg0: {payload: number | BleError}) => void,
  ) => {
          await this.device?.discoverAllServicesAndCharacteristics()
          const subscription = this.device?.monitorCharacteristicForService(
          ESP32_UUID,
          ESP32_CHARACTERISTIC,
          (error, characteristic) =>
          this.rvSignalUpdate(error, characteristic, emitter),
          );
          return subscription
  }; 

  encodeRequest = (message : Message) => {
    let val = message.message;
    if(typeof val == 'string'){
      val = +val;
    }
    let rawData = '';
    try{
      rawData = Buffer.from(`${val.toString(16)}`, 'utf-8').toString('base64');
      // console.log(`send: ${val.toString(16)} => ${rawData}`);
    }catch(e){
      console.log("encodeRequest", e)
    }
    return rawData;
  }

  sendSignal = async (message: Message) => {
    const request = this.encodeRequest(message);
    if(message.deviceId!=null){
        try {
            await this.device?.discoverAllServicesAndCharacteristics();
            if(Platform.OS==='android')
            this.bleManager.writeCharacteristicWithoutResponseForDevice(
              message.deviceId,
              ESP32_UUID,
              ESP32_CHARACTERISTIC2,
              `${request}`,
            )
            else if(Platform.OS==='ios'){
              this.bleManager.writeCharacteristicWithResponseForDevice(
                message.deviceId,
                ESP32_UUID,
                ESP32_CHARACTERISTIC2,
                `${request}`,
              )
            }
        }
        catch (e) {
            console.log("sendSignal", e);
        };
      }
  }
}

const bluetoothLeManager = new BluetoothLeManager();

export default bluetoothLeManager;