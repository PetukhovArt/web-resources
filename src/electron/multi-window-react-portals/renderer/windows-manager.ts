import { BrowserWindowConstructorOptions } from 'electron'
import { makeAutoObservable, observable } from 'mobx'

export type WindowId = string

export class ChildWindow {
  private window: Window | null
  private closeHandler: (_unknown: unknown, windowId: string) => void

  constructor(
    public readonly id: WindowId,
    private options: BrowserWindowConstructorOptions,
    private onClosed: () => void
  ) {
    makeAutoObservable<ChildWindow, 'window'>(this, {
      window: observable.ref
    })
    this.window = window.open(
      'about:blank',
      '_blank',
      `config=${btoa(JSON.stringify({ options: options, id: id }))}`
    )

    this.closeHandler = (_, windowId: string) => {
      if (windowId === id) {
        this.close()
      }
    }

    window.childAPI.onWindowClosed(this.closeHandler)
  }

  getWindow() {
    return this.window
  }

  close() {
    this.window?.close()
    this.onClosed()
    window.childAPI.removeWindowClosed(this.closeHandler)
  }
  minimize() {
    if (this.window) {
      window.childAPI.minimize(this.id)
    }
  }
  updateOptions(options: BrowserWindowConstructorOptions) {
    this.options = options
    // window.childAPI.updateWindowOptions(this.id,options)
  }
}

export class ChildWindowsManager {
  private windows: Record<WindowId, ChildWindow> = {}

  constructor() {
    makeAutoObservable<ChildWindowsManager, 'windows'>(this, {
      windows: observable.shallow
    })
  }

  get windowIds() {
    return Object.keys(this.windows)
  }
  getWindow(id: WindowId) {
    const childWindow = this.windows[id]
    if (childWindow) {
      return childWindow.getWindow()
    }
    return null
  }

  getWindowIsOpen(id: WindowId) {
    const childWindow = this.windows[id]
    if (childWindow) {
      return childWindow.getWindow() !== null
    }
    return false
  }

  createWindow(id: WindowId, options: BrowserWindowConstructorOptions) {
    this.windows[id] = new ChildWindow(id, options, () => {
      this.removeWindow(id)
    })
  }

  minimizeAllWindows() {
    window.childAPI.minimizeAll()
  }
  minimizeWindow(id: WindowId) {
    const childWindow = this.windows[id]
    if (childWindow) {
      childWindow.minimize()
    }
  }

  closeWindow(id: WindowId) {
    const childWindow = this.windows[id]
    if (childWindow) {
      childWindow.close()
      this.removeWindow(id)
    }
  }

  updateWindowOptions(id: WindowId, options: BrowserWindowConstructorOptions) {
    const childWindow = this.windows[id]
    if (childWindow) {
      childWindow.updateOptions(options)
    }
  }

  private removeWindow(id: WindowId) {
    delete this.windows[id]
  }
}

export const childWindowsManager = new ChildWindowsManager()
