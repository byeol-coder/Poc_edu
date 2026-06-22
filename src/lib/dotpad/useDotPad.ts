import { useCallback, useEffect, useRef, useState } from 'react'
import {
  DataCodes,
  DisplayMode,
  DotPadSDK,
  DotPadScanner,
  type DotDevice,
} from './DotPadSDK-3_0_0'
import { encodeGraphicHex } from './encode'
import type { TactileMatrix } from './encode'

export type DotPadStatus =
  | 'unsupported'
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'error'

export type DotPadTransport = 'ble' | 'usb'

export type DotPadState = {
  status: DotPadStatus
  /** Web Bluetooth available in this browser. */
  bleSupported: boolean
  /** Web Serial (USB) available in this browser. */
  usbSupported: boolean
  transport: DotPadTransport | null
  deviceName: string | null
  /** Last hardware key the user pressed on the device. */
  lastKey: string | null
  error: string | null
}

export type DotPadController = DotPadState & {
  connectBle: () => Promise<void>
  connectUsb: () => Promise<void>
  disconnect: () => void
  /** Push a 60 x 40 tactile matrix to the connected device. Returns true if sent. */
  sendMatrix: (matrix: TactileMatrix) => boolean
  raiseAll: () => void
  clearAll: () => void
}

const hasBle = () =>
  typeof navigator !== 'undefined' && 'bluetooth' in navigator
const hasUsb = () =>
  typeof navigator !== 'undefined' && 'serial' in navigator

export function useDotPad(): DotPadController {
  const sdkRef = useRef<DotPadSDK | null>(null)
  const scannerRef = useRef<DotPadScanner | null>(null)
  const deviceRef = useRef<DotDevice | null>(null)

  const [state, setState] = useState<DotPadState>(() => ({
    status: hasBle() || hasUsb() ? 'idle' : 'unsupported',
    bleSupported: hasBle(),
    usbSupported: hasUsb(),
    transport: null,
    deviceName: null,
    lastKey: null,
    error: null,
  }))

  // Lazily build the SDK + scanner and wire device/key callbacks once.
  const ensureSdk = useCallback(() => {
    if (sdkRef.current) return sdkRef.current

    const sdk = new DotPadSDK()
    sdk.setCallBack(
      (device, code, value) => {
        switch (code) {
          case DataCodes.Connected:
            deviceRef.current = device
            setState((prev) => ({ ...prev, status: 'connected', error: null }))
            break
          case DataCodes.DeviceName:
            setState((prev) => ({ ...prev, deviceName: value }))
            break
          case DataCodes.ConnectedFail:
            setState((prev) => ({
              ...prev,
              status: 'error',
              error: 'DotPad connection failed.',
            }))
            break
          case DataCodes.Disconnected:
            deviceRef.current = null
            setState((prev) => ({
              ...prev,
              status: 'idle',
              transport: null,
              deviceName: null,
            }))
            break
          default:
            break
        }
      },
      (_device, keyCode) => {
        setState((prev) => ({ ...prev, lastKey: keyCode }))
      },
    )

    sdkRef.current = sdk
    scannerRef.current = new DotPadScanner()
    return sdk
  }, [])

  const connect = useCallback(
    async (transport: DotPadTransport) => {
      const supported = transport === 'ble' ? hasBle() : hasUsb()
      if (!supported) {
        setState((prev) => ({
          ...prev,
          status: 'error',
          error:
            transport === 'ble'
              ? 'This browser does not support Web Bluetooth. Use Chrome or Edge over HTTPS.'
              : 'This browser does not support Web Serial (USB). Use Chrome or Edge over HTTPS.',
        }))
        return
      }

      const sdk = ensureSdk()
      const scanner = scannerRef.current!
      setState((prev) => ({ ...prev, status: 'connecting', transport, error: null }))

      try {
        if (transport === 'ble') {
          const device = await scanner.startBleScan()
          if (!device) {
            // User dismissed the chooser.
            setState((prev) => ({ ...prev, status: 'idle', transport: null }))
            return
          }
          const dot = await sdk.connectBleDevice(device)
          if (!dot) throw new Error('Could not open the selected DotPad.')
        } else {
          const port = await scanner.startUsbScan()
          if (!port) {
            setState((prev) => ({ ...prev, status: 'idle', transport: null }))
            return
          }
          const dot = await sdk.connectUsbDevice(port)
          if (!dot) throw new Error('Could not open the selected DotPad.')
        }
        // Final 'connected' status is set by the Connected callback above.
      } catch (err) {
        setState((prev) => ({
          ...prev,
          status: 'error',
          transport: null,
          error: err instanceof Error ? err.message : 'DotPad connection failed.',
        }))
      }
    },
    [ensureSdk],
  )

  const connectBle = useCallback(() => connect('ble'), [connect])
  const connectUsb = useCallback(() => connect('usb'), [connect])

  const disconnect = useCallback(() => {
    sdkRef.current?.disconnect()
    deviceRef.current = null
    setState((prev) => ({
      ...prev,
      status: 'idle',
      transport: null,
      deviceName: null,
    }))
  }, [])

  const sendMatrix = useCallback((matrix: TactileMatrix) => {
    const sdk = sdkRef.current
    const device = deviceRef.current
    if (!sdk || !device) return false
    try {
      sdk.displayGraphicData(encodeGraphicHex(matrix), device, DisplayMode.GraphicMode)
      return true
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to send scene to DotPad.',
      }))
      return false
    }
  }, [])

  const raiseAll = useCallback(() => {
    const sdk = sdkRef.current
    const device = deviceRef.current
    if (sdk && device) sdk.displayAllUp(device)
  }, [])

  const clearAll = useCallback(() => {
    const sdk = sdkRef.current
    const device = deviceRef.current
    if (sdk && device) sdk.displayAllDown(device)
  }, [])

  // Disconnect cleanly when the component using the hook unmounts.
  useEffect(() => {
    return () => {
      sdkRef.current?.disconnect()
      deviceRef.current = null
    }
  }, [])

  return {
    ...state,
    connectBle,
    connectUsb,
    disconnect,
    sendMatrix,
    raiseAll,
    clearAll,
  }
}
