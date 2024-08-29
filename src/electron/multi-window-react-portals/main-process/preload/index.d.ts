import { BrowserWindowConstructorOptions } from 'electron'

declare global {
  interface Window {
    mainAPI: {
      minimize: () => void
      collapse: () => void
      close: () => void
      onMaximizedMain: (cb: () => void) => void
      unMaximizedMain: (cb: () => void) => void
      onCloseMain: (cb: () => void) => void
    }
    childAPI: {
      minimize: (id: string) => void
      minimizeAll: () => void
      //
      onWindowClosed: (onClose: (_: unknown, id: string) => void) => void // ?
      removeWindowClosed: (onClose: (_: unknown, id: string) => void) => void // ?
      updateWindowOptions: (id: string, options: BrowserWindowConstructorOptions) => void
    }
  }
}
