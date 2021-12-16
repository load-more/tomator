const BgColor = require('./bgColor')

class ProgressCircle {
  constructor(window, document, canvas, status, duration) {
    this.status = status
    // 设置画笔
    this.ctx = canvas.getContext('2d')
    // 解决 canvas 中的锯齿问题
    this.width = canvas.width
    this.height=canvas.height
    if (window.devicePixelRatio) {
      canvas.style.width = this.width + "px"
      canvas.style.height = this.height + "px"
      // 重置画布，清除之前绘制的图形
      canvas.width = this.width * window.devicePixelRatio
      canvas.height = this.height * window.devicePixelRatio
      this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    this.ctx.strokeStyle = this.status === 'working' ? 'red' : '#bfc'
    this.ctx.lineWidth = 8
    this.ctx.lineCap = 'round'

    this.ctx.beginPath()
    this.ctx.translate(this.width / 2, this.height / 2)
    this.ctx.save()
  
    this.startAngle = -Math.PI / 2 // 起始角度
    this.intervalTime = 16 // 间隔 16ms 刷新一次
    this.intervalAngle = Math.PI * 2 / duration / 1000 * this.intervalTime // 每次刷新增加的角度

    this.bgColor = new BgColor(document.querySelector('.display'), status, duration, this.intervalTime)

    this.intervalTimer = null
  }
  startDrawing() {
    this.intervalTimer = setInterval(() => {
      // 绘制圆弧
      const endAngle = this.startAngle + this.intervalAngle
      this.ctx.arc(0, 0, (this.width - this.ctx.lineWidth) / 2, this.startAngle, endAngle, false)
      this.ctx.stroke()
      this.startAngle = endAngle

      // 减淡背景颜色
      this.bgColor.reduceOpacity()
  }, this.intervalTime)
  }
  pauseDrawing() {
    clearTimeout(this.intervalTimer)
  }
  stopDrawing() {
    clearTimeout(this.intervalTimer)
  }
}

module.exports = ProgressCircle