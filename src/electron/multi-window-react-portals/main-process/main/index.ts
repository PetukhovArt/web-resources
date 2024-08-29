import { app, ipcMain, Menu } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import MainWindowManager from './managers/main-window'
app
  .whenReady()
  .then(() => {
    electronApp.setAppUserModelId('com.electron')

    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    if (process.platform === 'darwin') {
      Menu.setApplicationMenu(Menu.buildFromTemplate([]))
    }
  })
  .catch((error) => console.error(error))

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('signed-in', () => MainWindowManager.createMainWindow())
ipcMain.handle('destroy', (event: any) => event.sender.destroy())
