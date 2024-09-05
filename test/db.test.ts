import { it } from "vitest"
import { exportLib } from "../src/db"

it.skip("db", async () => {
  const r = {
    status: "selected",
    selected: [{ id: 76, name: "2012雅思词汇加强版" }],
    type: "base",
    options: {
      target: ["word", "translation", "list"],
      previewTarget: "word",
      exculedMemorized: false,
      folderName: "",
      override: true,
    },
  }
  await exportLib(r.status, r.selected, r.type, r.options, (info: string) => {
    console.log(info)
    return false
  })
})

it("test", () => {
  const date = new Date()
  console.log(new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000))
})
