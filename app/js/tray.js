const { Tray, nativeTheme, Menu } = require('electron')
const path = require('path')

// 根据操作系统选择 tray 图标
const getIcon = () => {
  if (process.platform === 'win32') {
    return 'tray/icon-light@2x.ico'
  }
  // 如果系统主题为暗色
  if (nativeTheme.shouldUseDarkColors) {
    return 'tray/Icon-light.png'
  }
  return 'tray/Icon.png'
}

// 更新托盘上下文菜单
const updateTrayContextMenu = (tray) => {
  const menu = Menu.buildFromTemplate([
    {
      label: 'Setting'
    },
    { type: 'separator' },
    {
      label: 'Quit',
      accelerator: 'CommandOrControl+Q',
      click() {
        app.quit()
      }
    }
  ])

  tray.setContextMenu(menu)
}

const createTray = () => {
  // 创建应用托盘
  const tray = new Tray(path.join(__dirname, `../${getIcon()}`))

  // 鼠标悬停在托盘图标上的提示
  tray.setToolTip('Tomator')
  // 创建托盘图标的上下文菜单（右击）
  updateTrayContextMenu(tray)

  return tray
}

module.exports = createTray