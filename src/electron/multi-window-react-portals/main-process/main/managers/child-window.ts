import { app, BrowserWindow, BrowserWindowConstructorOptions, shell } from 'electron'
import { join } from 'path'
import { z } from 'zod'
import HandlerDetails = Electron.HandlerDetails

type WindowOpen =
  | { action: 'deny' }
  | {
      action: 'allow'
      outlivesOpener?: boolean
      overrideBrowserWindowOptions?: BrowserWindowConstructorOptions
    }

class ChildWindowManager {
  private windows: Record<string, BrowserWindow> = {}

  public handleWindowOpen(details: HandlerDetails, parentWindow: BrowserWindow | null): WindowOpen {
    if (details.url === 'about:blank') {
      const { electronWindowOptions, windowId } = this.parseWindowFeatures(details.features)

      app.once('browser-window-created', (_, newWindow) => {
        this.windows[windowId] = newWindow

        newWindow.on('closed', () => {
          parentWindow?.webContents.send('window-closed', windowId)
          delete this.windows[windowId]
        })
      })

      return {
        action: 'allow',
        overrideBrowserWindowOptions: {
          ...electronWindowOptions,
          webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            backgroundThrottling: false,
            preload: join(__dirname, '../preload/index.ts')
          }
        }
      }
    }
    shell.openExternal(details.url)
    return { action: 'deny' }
  }

  private parseWindowFeatures(features: string) {
    const parsedFeatures = features
      .split(',')
      .map((item) => item.trim().split('='))
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})

    const config = JSON.parse(atob(parsedFeatures['config']))

    const { id, options } = z.object({ id: z.string(), options: z.record(z.any()) }).parse(config)
    return { windowId: id, electronWindowOptions: options }
  }

  public minimizeWindow(windowId: string) {
    const window = this.windows[windowId]
    if (window) {
      window.minimize()
    } else {
      console.error(`No window found with ID: ${windowId}`, window)
    }
  }
}

export default ChildWindowManager
