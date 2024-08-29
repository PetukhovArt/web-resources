import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import icon from '../../../resources/icon.png?asset'
import ChildWindowManager from './child-window'
import {
  Main_Ev,
  MainWindowEvents,
  Renderer_Ev
} from '../../renderer/src/shared/assets/common/constants'

class MainWindowManager {
  private mainWindow: BrowserWindow | null = null
  private childWindowManager: ChildWindowManager

  constructor() {
    this.childWindowManager = new ChildWindowManager()
    app.on('ready', this.createMainWindow)
    app.on('activate', this.onActivate)
    app.on('window-all-closed', this.onWindowAllClosed)
    this.registerIpcListeners()
  }

  get isMainWindowMaximized() {
    if (this.mainWindow) {
      return this.mainWindow.isMaximized()
    }
    return false
  }

  public createMainWindow = () => {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 900,
      minWidth: 800,
      minHeight: 400,
      backgroundColor: '#020617',
      show: false,
      center: true,
      autoHideMenuBar: true,
      frame: false,
      ...(process.platform === 'linux' ? { icon } : {}),
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false,
        devTools: is.dev,
        webSecurity: false,
        backgroundThrottling: false
      }
    })

    this.mainWindow.webContents.setWindowOpenHandler((details) => {
      return this.childWindowManager.handleWindowOpen(details, this.mainWindow)
    })

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      this.mainWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/index.html`)
    } else {
      this.mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }

    if (process.env.NODE_ENV !== 'production') {
      this.mainWindow.webContents.openDevTools({ mode: 'detach' })
    }

    // MAIN PROCESS LISTENERS START ================================================================================

    this.mainWindow.on('ready-to-show', () => {
      this.mainWindow?.show()
    })

    this.mainWindow.on(MainWindowEvents.UNMAXIMIZE, () => {
      this.mainWindow?.webContents.send(Main_Ev.UNMAXIMIZED)
    })

    this.mainWindow.on(MainWindowEvents.MAXIMIZE, () => {
      this.mainWindow?.webContents.send(Main_Ev.MAXIMIZED)
    })
    // MAIN PROCESS LISTENERS END ================================================================================
  }

  private registerIpcListeners = () => {
    // RENDERER PROCESS LISTENERS START ================================================================================
    ipcMain.handle(Renderer_Ev.MINIMIZE_MAIN_W, () => {
      console.log('event from renderer - minimize')
      this.mainWindow?.minimize()
    })

    ipcMain.handle(Renderer_Ev.COLLAPSE_MAIN_W, () => {
      if (this.isMainWindowMaximized) {
        this.mainWindow?.unmaximize()
      } else {
        this.mainWindow?.maximize()
      }
    })

    ipcMain.handle(Renderer_Ev.CLOSE_MAIN_W, () => {
      this.mainWindow?.close()
    })
    ipcMain.handle('minimize-child-window', (_event, windowId) => {
      this.childWindowManager.minimizeWindow(windowId)
    })
    ipcMain.handle(Renderer_Ev.UPDATE_WINDOW_OPTIONS, (...args) => {
      console.log(args)
    })

    // RENDERER PROCESS LISTENERS END ================================================================================
  }

  private onActivate = () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      this.createMainWindow()
    }
  }

  private onWindowAllClosed = () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  }
}

export default new MainWindowManager()
