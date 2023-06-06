import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {BluetoothPeripheral} from '../../models/BluetoothPeripheral'

type BluetoothState = {
  availableDevices: Array<BluetoothPeripheral>;
  isPermissionsEnabled: boolean;
  isScanning: boolean;
  isConnectingToDevice: boolean;
  connectedDevice: string|null;
  deviceName: string|null;
  isStartLEDControl: boolean;
  receiveMessage: number;
  isSendMessage: boolean;
  sendMessage: number;
};

const initialState: BluetoothState = {
  availableDevices: [],
  isPermissionsEnabled: false,
  isScanning: false,
  isConnectingToDevice: false,
  connectedDevice: null,
  deviceName: null,
  isStartLEDControl: false,
  receiveMessage: 0,
  isSendMessage: false,
  sendMessage: 0,
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
    scanForPeripherals: state => {
      state.isScanning = true;
    },
    bluetoothPeripheralsFound: (
      state: BluetoothState,
      action: PayloadAction<BluetoothPeripheral>,
    ) => {
      // Ensure no duplicate devices are added
      const isDuplicate = state.availableDevices.some(
        device => device.id === action.payload.id,
      );
      const isESP32 = action.payload?.name
        ?.toLowerCase()
        ?.includes('esp32_server');
      if (!isDuplicate && isESP32) {
        state.availableDevices = state.availableDevices.concat(action.payload);
      }
    },
    initiateConnection: (state, _) => {
      state.isConnectingToDevice = true;
    },
    connectPeripheral: (state, action) => {
      state.isConnectingToDevice = false;
      state.isScanning = false;
      state.connectedDevice = action.payload.id;
      state.deviceName = action.payload.name;
    },
    startLEDControl: state => {
      state.isStartLEDControl = true;
    },
    receiveMessage: (state, action) => {
      state.receiveMessage = action.payload;
    },
    sendMessage: (state, _) => {
      state.isSendMessage = true;
    },
  },
});

export const sagaActionConstants = {
    REQUEST_PERMISSIONS: bluetoothReducer.actions.requestPermissions.type,
    SCAN_FOR_PERIPHERALS: bluetoothReducer.actions.scanForPeripherals.type,
    ON_DEVICE_DISCOVERED: bluetoothReducer.actions.bluetoothPeripheralsFound.type,
    INITIATE_CONNECTION: bluetoothReducer.actions.initiateConnection.type,
    CONNECTION_SUCCESS: bluetoothReducer.actions.connectPeripheral.type,
    START_RECEIVE_MESSAGE: bluetoothReducer.actions.startLEDControl.type,
    UPDATE_RECEIVE_MESSAGE: bluetoothReducer.actions.receiveMessage.type,
    SEND_MESSAGE: bluetoothReducer.actions.sendMessage.type,
  };

export const {
    requestPermissions,
    bluetoothPeripheralsFound,
    scanForPeripherals,
    initiateConnection,
    connectPeripheral,
    startLEDControl,
    sendMessage,
} = bluetoothReducer.actions

export default bluetoothReducer