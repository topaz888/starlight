export type BluetoothPeripheral = {
    id: string;
    name: string;
    serviceUUIDs: Array<string>;
  }

export type Message = {
    deviceId: string | null;
    message: number | string;
}