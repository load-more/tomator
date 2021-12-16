const { app, BrowserWindow, Tray, ipcMain } = require('electron')
const path = require('path')
const createApplicationMenu = require('./js/applicationMenu')
const createTray = require('./js/tray')
const createGlobalShortcut = require('./js/globalShortcut')

// 需要设置为外部变量，否则会被垃圾回收器回收，导致窗口或托盘消失
let mainWindow = null
let tray = null

const createWindow = () => {
  const win = new BrowserWindow({
    width: 420,
    height: 480,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  win.loadFile(path.join(__dirname, 'index.html'))

  return win
}

// 设置窗口最小化后，页面不被冻结（动画效果仍然存在）
app.commandLine.appendSwitch('disable-background-timer-throttling')

app.on('ready', () => {
  mainWindow = createWindow()

  ipcMain.on('focus-window', () => {
    mainWindow.focus()
  })

  // 创建应用菜单
  createApplicationMenu()

  // 创建应用托盘
  tray = createTray()

  // 创建全局快捷键
  createGlobalShortcut()

  // Windows
  if (process.platform === 'win32') {
    // 点击托盘，聚焦窗口
    tray.on('click', () => {
      mainWindow.focus()
    })
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.setAppUserModelId(process.execPath)