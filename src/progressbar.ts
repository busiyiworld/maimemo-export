import { stdout as slog } from "single-line-log"

// 封装的 ProgressBar 工具
class ProgressBar {
  length: number
  constructor(length = 25) {
    this.length = length
  }
  render(description: string, opts: { completed: number; total: number }) {
    const percent = Number((opts.completed / opts.total).toFixed(4)) // 计算进度(子任务的 完成数 除以 总数)
    const cell_num = Math.floor(percent * this.length) // 计算需要多少个 █ 符号来拼凑图案

    // 拼接黑色条
    let cell = ""
    for (var i = 0; i < cell_num; i++) {
      cell += "█"
    }

    // 拼接灰色条
    let empty = ""
    for (var i = 0; i < this.length - cell_num; i++) {
      empty += "░"
    }

    slog(
      `${cell + empty} ${String(opts.completed).padStart(
        String(opts.total).length,
        " "
      )}/${opts.total}   ${description}`
    )
  }
}

export default ProgressBar
