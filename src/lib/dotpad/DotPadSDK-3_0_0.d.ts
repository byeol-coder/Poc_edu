// Minimal type surface for the bundled DotPad Web SDK 3.0.0 (DotPadSDK-3_0_0.js).
// Only the members used by this PoC are declared.

export const DataCodes: Readonly<{
  Connected: 'Connected'
  ConnectedFail: 'ConnectedFail'
  Disconnected: 'Disconnected'
  BoardInfo: 'BoardInfo'
  BleMacAddress: 'BleMacAddress'
  DeviceName: 'DeviceName'
  DeviceFWVersion: 'DeviceFWVersion'
  DeviceHWVersion: 'DeviceHWVersion'
  ResponseDisplayLineAck: 'ResponseDisplayLineAck'
  ResponseDisplayLineNonAck: 'ResponseDisplayLineNonAck'
  ResponseDisplayLineComplete: 'ResponseDisplayLineComplete'
  CommandError: 'CommandError'
  CommandNone: 'CommandNone'
}>

export const DeviceInfo: Readonly<{
  DeviceName: 'DeviceName'
  FirmwareVersion: 'FirmwareVersion'
  HardwareVersion: 'HardwareVersion'
}>

export const DisplayMode: Readonly<{
  GraphicMode: 'GraphicMode'
  TextMode: 'TextMode'
}>

export const KeyCodes: Readonly<Record<string, string>>

export class DotDevice {
  readonly isConnect: boolean
  readonly connectDevice: unknown
  readonly cellType: string
  readonly numberCellRows: number
  readonly numberCellColumns: number
  readonly numberBrailleCellColumns: number
  disconnect(): Promise<void>
  displayGraphicData(hex: string, startLine?: number, startCell?: number, mode?: string): void
  displayTextData(hex: string, startCell?: number, mode?: string): void
}

export type DotMessageCallback = (
  device: DotDevice,
  code: string,
  value: string,
) => void

export type DotKeyCallback = (
  device: DotDevice,
  keyCode: string,
  value: string,
) => void

export class DotPadSDK {
  getConnectedDevices(): DotDevice[]
  connectBleDevice(device: BluetoothDevice): Promise<DotDevice | null>
  connectUsbDevice(port: SerialPort): Promise<DotDevice | null>
  disconnect(device?: DotDevice | null): void
  displayGraphicData(hex: string, device?: DotDevice | null, mode?: string): void
  displayTextData(hex: string, device?: DotDevice | null, mode?: string): void
  displayAllUp(device?: DotDevice | null): void
  displayAllDown(device?: DotDevice | null): void
  setCallBack(message: DotMessageCallback, key: DotKeyCallback): void
}

export class DotPadScanner {
  startBleScan(): Promise<BluetoothDevice | undefined>
  startUsbScan(): Promise<SerialPort | undefined>
}
