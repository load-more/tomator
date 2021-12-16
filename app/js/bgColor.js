class BgColor {
  constructor(element, status, duration, intervalTime) {
    this.element = element
    this.status = status
    this.opacityValue = 1 // 不透明度值，例如：rgba(r, g, b, a)
    this.intervalOpacity = 1 / duration / 1000 * intervalTime // 每次刷新减少的不透明度值

    // 初始化背景颜色
    this.element.style.backgroundColor = '#fff'
  }
  reduceOpacity() {
    // 减淡背景颜色不透明度
    if (this.status === 'working') {
      this.element.style.backgroundColor = `rgba(255,0,0,${this.opacityValue})`
    } else {
      this.element.style.backgroundColor = `rgba(0,200,0,${this.opacityValue})`
    }
    this.opacityValue -= this.intervalOpacity
  }
}

module.exports = BgColor