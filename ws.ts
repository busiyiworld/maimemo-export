import { defineWebSocket, eventHandler } from "vinxi/http"
import { exportLib } from "src/export"
import type { ExportFnProps, WSMessgae } from "@/types"
import { delay } from "@/utils"

let stop = false

export default eventHandler({
  handler: () => { },
  websocket: defineWebSocket({
    async open() {
      console.log("webSocket opened")
    },
    async message(peer, message) {
      const msg = JSON.parse(message.text()) as WSMessgae<ExportFnProps>
      let last = 0
      switch (msg.type) {
        case "export":
          stop = false
          exportLib({
            ...msg.data!,
            async fnEvery(log) {
              // 留 100 ms 接收 stop，并且确保不要发送太快，避免 UI 刷新不及时
              const now = Date.now()
              await delay(now - last > 100 ? 1 : 100)
              peer.send({
                ...log,
                stop,
              })
              last = now
              return stop
            },
          })
          break
        case "stop":
          stop = true
          break
      }
    },
    async close() {
      console.log("webSocket closed")
    },
    async error() {
      console.log("webSocket error")
    },
  }),
})
