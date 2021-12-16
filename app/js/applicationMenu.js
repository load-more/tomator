const { Menu } = require('electron')

const createApplicationMenu = () => {
  const template = [
    {
      label: '&File', // 在 Windows 上使用 alt + F 激活菜单
      submenu: [
        {
          label: 'Setting',
          click() {
            console.log('Open Setting Window.')
          }
        },
        {
          type: 'separator'
        },
        {
          role: 'quit',
          accelerator: 'CommandOrControl+Q'
        }
      ]
    },
    {
      label: '&View',
      role: 'viewMenu'
    },
    {
      label: '&Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    }
  ]

  return Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

module.exports = createApplicationMenu