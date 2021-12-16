const Timer = require('timer.js')
const ProgressCircle = require('./js/canvas')
const { ipcRenderer } = require('electron')

const workingDuration = 1800 // 工作 30min
const restingDuration = 300 // 休息 5min

const statusText = document.getElementById('status')
const startOrPauseButton = document.getElementById('startOrPause')
const retimeButton = document.getElementById('stop')
const displayTime = document.getElementById('time')
const canvas = document.getElementById('circle')

const workingTitle = 'Working'
const restingTitle = 'Resting'
const initialTime = '00:00:00:00'
const workingStartButtonLabel = 'start working'
const workingPauseButtonLabel = 'pause working'
const restingStartButtonLabel = 'start resting'
const restingPauseButtonLabel = 'pause resting'
const stopButtonLabel = 'retime'
const workedNotificationTitle = 'Working Done'
const workedNotificationBody = `You have worked for ${workingDuration} s.`
const restedNotificationTitle = 'Resting Done'
const restedNotificationBody = `You have rested for ${restingDuration} s.`

let currentStatus = 'working'
let progressCircle = null

const timer = new Timer({
  tick: 0.04,
  ontick(ms) {
    displayTime.innerText = formatTime(ms)
  },
  onend() {
    displayTime.innerText = initialTime

    showNotification(currentStatus)

    progressCircle.stopDrawing() // 清除计时器，避免内存泄漏

    currentStatus = currentStatus === 'working' ? 'resting' : 'working'

    updateUI(currentStatus)
  }
})

const showNotification = (status) => {
  const title = status === 'working' ? workedNotificationTitle : restedNotificationTitle
  const body = status === 'working' ? workedNotificationBody : restedNotificationBody
  const notification = new Notification(title, {
    body
  })

  notification.addEventListener('click', () => {
    ipcRenderer.send('focus-window')
  })

  // notification.addEventListener('close', () => {
  //   console.log('close')
  // })
}

const updateUI = (status) => {
  if (status === 'working') {
    statusText.innerText = workingTitle
    displayTime.innerText = formatTime(workingDuration * 1000)
    startOrPauseButton.innerText = workingStartButtonLabel
    retimeButton.innerText = stopButtonLabel
  } else {
    statusText.innerText = restingTitle
    displayTime.innerText = formatTime(restingDuration * 1000)
    startOrPauseButton.innerText = restingStartButtonLabel
    retimeButton.innerText = stopButtonLabel
  }
}

// 格式化时间字符串
const formatTime = (ms) => {
  const msDigit = Math.floor((ms % 1000) / 10).toString().padStart(2, 0)
  const seconds = Math.floor(ms / 1000)
  const secDigit = (seconds % 60).toString().padStart(2, 0)
  const minutes = Math.floor(seconds / 60)
  const minuDigit = (minutes % 60).toString().padStart(2, 0)
  // 不能超过 24 小时
  const hourDigit = Math.floor(minutes / 60).toString().padStart(2, 0)
  return `${hourDigit}:${minuDigit}:${secDigit}:${msDigit}`
}

startOrPauseButton.addEventListener('click', () => {
  const label = startOrPauseButton.innerText
  if (label === workingStartButtonLabel || label === restingStartButtonLabel) {
    const isWorking = label === workingStartButtonLabel
    const timerStatus = timer.getStatus()
    if (timerStatus === 'initialized' || timerStatus === 'stopped') {
      timer.start(isWorking ? workingDuration : restingDuration) // 开始计时
      progressCircle = new ProgressCircle(window, document, canvas, currentStatus, isWorking ? workingDuration : restingDuration)
    } else if (timerStatus === 'paused') {
      timer.start() // 继续计时
    }
    progressCircle.startDrawing()
    startOrPauseButton.innerText = isWorking ? workingPauseButtonLabel : restingPauseButtonLabel
  } else {
    const isWorking = label === workingPauseButtonLabel
    timer.pause() // 停止计时
    progressCircle.pauseDrawing()
    startOrPauseButton.innerText = isWorking ? workingStartButtonLabel : restingStartButtonLabel
  }
})

retimeButton.addEventListener('click', () => {
  const isWorking = currentStatus === 'working'
  timer.stop() // 重新计时
  updateUI(currentStatus)
  progressCircle.stopDrawing() // 清除计时器，防止内存泄漏
  progressCircle = new ProgressCircle(window, document, canvas, currentStatus, isWorking ? workingDuration : restingDuration)
})

// 初次更新视图
updateUI(currentStatus)