import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {BluetoothPeripheral} from '../../models/BluetoothPeripheral'

type BluetoothState = {
  availableDevices: Array<BluetoothPeripheral>;
  shawdomDevices: Array<BluetoothPeripheral>;
  timerFlag: boolean;
  isBluetoothEnable:boolean;
  isPermissionsEnabled: boolean;
  isScanning: boolean;
  isAutoPairing: boolean;
  isConnectingToDevice: boolean;
  connectedDevice: string|null;
  deviceName: string|null;
  isStartLEDListen: boolean;
  receiveMessage: number;
  isSendMessage: boolean;
  sendMessage: number;
  isDisconnecting: boolean;
  isTurnOff: boolean;
  isLoading: boolean;
};

const initialState: BluetoothState = {
  availableDevices: [],
  shawdomDevices: [],
  timerFlag:false,
  isBluetoothEnable:false,
  isPermissionsEnabled: false,
  isScanning: false,
  isAutoPairing: false,
  isConnectingToDevice: false,
  connectedDevice: null,
  deviceName: null,
  isStartLEDListen: false,
  receiveMessage: 0,
  isSendMessage: false,
  sendMessage: 0,
  isDisconnecting:false,
  isTurnOff: false,
  isLoading: false,
};

const bluetoothReducer = createSlice({
  name: 'bluetooth',
  initialState: initialState,
  reducers: {
    requestPermissions: (
      state: BluetoothState,
      action: PayloadAction<boolean>,
    ) => {
      state.isPermissionsEnabled = action.payload;
    },
    requestBluetoothState: (
      state: BluetoothState,
      action: PayloadAction<boolean>,
    ) => {
      state.isBluetoothEnable = action.payload;
      state.availableDevices = []
    },
    scanForPeripherals: state => {
      state.isScanning = true;
      state.timerFlag = false;
    },
    autoPair: state => {
      // console.log("autopair");
      state.isAutoPairing = true;
    },
    updateTimerFlag: (state, action) => {
      state.timerFlag = action.payload;
    },
    refreshAvilableDevice:(state)=>{
        // console.log("refreshAvilableDevice")
        if(state.availableDevices.length!=state.shawdomDevices.length){
          state.availableDevices = state.shawdomDevices;
        }
        state.shawdomDevices = []
    },
    bluetoothPeripheralsFound: (
      state: BluetoothState,
      action: PayloadAction<BluetoothPeripheral>,
    ) => {
      // Ensure no duplicate devices are added
      const isDuplicate = state.availableDevices.some(
        device => device.id === action.payload.id,
      );
      const isShawdomDuplicate = state.shawdomDevices.some(
        device => device.id === action.payload.id,
      );
      const isESP32 = action.payload?.name
        ?.toLowerCase()
        ?.includes('starlight');
      if (!isDuplicate && isESP32) {
        state.availableDevices = state.availableDevices.concat(action.payload);
      }
      if (!isShawdomDuplicate && isESP32) {
        state.shawdomDevices = state.shawdomDevices.concat(action.payload);
      }
    },
    initiateConnection: (state, _) => {
      state.isConnectingToDevice = true;
      state.timerFlag = true;
      state.timerFlag = true;
    },
    connectPeripheral: (state, action) => {
      state.isConnectingToDevice = false;
      state.isScanning = false;
      state.connectedDevice = action.payload.id;
      state.deviceName = action.payload.name;
    },

    displayLoading: (state, action) =>{
      state.isLoading = action.payload;
    },

    disconnectPeripheral: (state, _) => {
      state.isDisconnecting = true;
    },

    disconnectSuccess: (state) => {
      state.connectedDevice = null;
      state.deviceName = null;
      state.isStartLEDListen = false; 
    },

    startPeripheralListen: state => {
      state.isStartLEDListen = true;
    },
    receiveMessage: (state, action) => {
      state.receiveMessage = action.payload;
      if(+action.payload===31){
        state.isTurnOff = false;
      }
      if(+action.payload===32){
        state.isTurnOff = true
      };
      state.isLoading = false;
      console.log("receiveMessage");
      console.log(action.payload)
    },
    sendMessage: (state, action) => {
      state.isSendMessage = true;
      if(action.payload.deviceId == null)
        action.payload.deviceId = state.connectedDevice;
    },
    uploadIsTurnOff: state => {
      state.isTurnOff = !state.isTurnOff
    }
  },
});

export const bluetoothActionConstants = {
    REQUEST_PERMISSIONS: bluetoothReducer.actions.requestPermissions.type,
    REQUEST_BLUETOOTH: bluetoothReducer.actions.requestBluetoothState.type,
    SCAN_FOR_PERIPHERALS: bluetoothReducer.actions.scanForPeripherals.type,
    REFRESH_FOR_PERIPHERALS: bluetoothReducer.actions.refreshAvilableDevice.type,
    ON_DEVICE_DISCOVERED: bluetoothReducer.actions.bluetoothPeripheralsFound.type,
    INITIATE_CONNECTION: bluetoothReducer.actions.initiateConnection.type,
    CONNECTION_SUCCESS: bluetoothReducer.actions.connectPeripheral.type,
    DISCONNECTION_PERIPHERAL: bluetoothReducer.actions.disconnectPeripheral.type,
    DISCONNECTION_SUCCESSS: bluetoothReducer.actions.disconnectSuccess.type,
    START_RECEIVE_MESSAGE: bluetoothReducer.actions.startPeripheralListen.type,
    UPDATE_RECEIVE_MESSAGE: bluetoothReducer.actions.receiveMessage.type,
    SEND_MESSAGE: bluetoothReducer.actions.sendMessage.type,
    AUTO_PAIRING: bluetoothReducer.actions.autoPair.type,
    DISPLAY_LOADING: bluetoothReducer.actions.displayLoading.type,
  };

export const {
    bluetoothPeripheralsFound,
    updateTimerFlag,
    scanForPeripherals,
    initiateConnection,
    connectPeripheral,
    disconnectPeripheral,
    startPeripheralListen,
    sendMessage,
    autoPair,
    uploadIsTurnOff,
    displayLoading,
} = bluetoothReducer.actions

export default bluetoothReducer