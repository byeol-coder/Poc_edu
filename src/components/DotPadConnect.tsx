import { Bluetooth, Loader2, Plug, Unplug, Usb, X } from 'lucide-react'
import type { DotPadController } from '../lib/dotpad/useDotPad'

type Props = {
  dotPad: DotPadController
  /** 'full' shows connect buttons + status; 'pill' shows a compact status chip. */
  variant?: 'full' | 'pill'
}

export default function DotPadConnect({ dotPad, variant = 'full' }: Props) {
  const {
    status,
    bleSupported,
    usbSupported,
    deviceName,
    error,
    connectBle,
    connectUsb,
    disconnect,
  } = dotPad

  if (status === 'unsupported') {
    return (
      <div className="dotpad-connect unsupported" role="status">
        <Plug size={13} />
        <span>Real DotPad output needs Chrome or Edge (Web Bluetooth / USB) over HTTPS.</span>
      </div>
    )
  }

  if (status === 'connected') {
    return (
      <div className={`dotpad-connect connected ${variant}`} role="status">
        <span className="dotpad-dot" />
        <span className="dotpad-connect-name">{deviceName ?? 'DotPad'}</span>
        <span className="dotpad-connect-tag">CONNECTED</span>
        <button type="button" className="dotpad-disconnect" onClick={disconnect}>
          <Unplug size={12} /> Disconnect
        </button>
      </div>
    )
  }

  if (status === 'connecting') {
    return (
      <div className={`dotpad-connect connecting ${variant}`} role="status">
        <Loader2 size={13} className="dotpad-spin" />
        <span>Connecting to DotPad…</span>
      </div>
    )
  }

  // idle or error
  return (
    <div className={`dotpad-connect idle ${variant}`}>
      <div className="dotpad-connect-actions">
        {bleSupported && (
          <button type="button" className="dotpad-connect-btn" onClick={connectBle}>
            <Bluetooth size={13} /> Connect DotPad (Bluetooth)
          </button>
        )}
        {usbSupported && (
          <button type="button" className="dotpad-connect-btn usb" onClick={connectUsb}>
            <Usb size={13} /> USB
          </button>
        )}
      </div>
      {error && (
        <div className="dotpad-connect-error" role="alert">
          <X size={12} /> {error}
        </div>
      )}
    </div>
  )
}
