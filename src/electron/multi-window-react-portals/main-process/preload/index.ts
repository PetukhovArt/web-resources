import { BrowserWindowConstructorOptions, contextBridge, ipcRenderer } from 'electron'
import { Main_Ev, Renderer_Ev } from '../renderer/src/shared/assets/common/constants'

type Options = BrowserWindowConstructorOptions
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('mainAPI', {
      minimize: () => ipcRenderer.invoke(Renderer_Ev.MINIMIZE_MAIN_W),
      collapse: () => ipcRenderer.invoke(Renderer_Ev.COLLAPSE_MAIN_W),
      close: () => ipcRenderer.invoke(Renderer_Ev.CLOSE_MAIN_W),
      onMaximizedMain: (cb: () => void) => ipcRenderer.on(Main_Ev.MAXIMIZED, () => cb()),
      unMaximizedMain: (cb: () => void) => ipcRenderer.on(Main_Ev.UNMAXIMIZED, () => cb()),
      onCloseMain: (cb: () => void) => ipcRenderer.on(Main_Ev.WINDOW_CLOSED, () => cb())
    })

    contextBridge.exposeInMainWorld('childAPI', {
      //add custom child-window events
      minimize: (id: string) => ipcRenderer.invoke('minimize-child-window', id),
      minimizeAll: () => ipcRenderer.invoke('minimize-all-child-windows'),

      //evgen events from lesson (need refactor)
      updateWindowOptions: (id: string, options: Options) => {
        return ipcRenderer.invoke('updateOptions', id, options)
      },
      removeWindowClosed: (onClose: (_: unknown, id: string) => void) => {
        ipcRenderer.removeListener('window-closed', onClose)
      },
      onWindowClosed: (onClose: (_: unknown, id: string) => void) => {
        ipcRenderer.once('window-closed', onClose)
      }
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // window.api = api
}
