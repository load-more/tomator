const { app, globalShortcut } = require('electron')

const createGlobalShortcut = () => {
  const quitAppShortcut = globalShortcut.register(
    'CommandOrControl+Q',
    () => { app.quit() }
  )
  // 如果快捷键冲突，注册失败
  if (!quitAppShortcut) {
    console.error('Global quit App Shortcut failed to register.')
  }
}

module.exports = createGlobalShortcut