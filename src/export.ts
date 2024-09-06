import { join } from "node:path"
import fs from "fs-extra"
import { getLibWords, getLibs, translateAll } from "./query"
import { checkDatabases, databases } from "./db"
import { transform } from "./transform"
import { ensureTargetFolders } from "./dir"
import type { ExportFnProps, ExportLog, Target, TrafficLights, Word } from "@/types"

export async function exportLib({ selected, range, type, options, fnEvery }: ExportFnProps & { fnEvery: (log: ExportLog) => Promise<boolean> }) {
  checkDatabases()
  const targetFolders = await ensureTargetFolders(options.folderName)

  let libs = selected
  if (range === "all") {
    libs = getLibs(type).map(k => ({
      id: k.id,
      name: k.name,
    }))
  }

  const initStatus = {
    word: "🟡",
    list: "🟡",
    translation: "🟡",
  } as Record<Target, TrafficLights>
  const score = {
    failed: 0,
    completed: 0,
    status: { ...initStatus },
  }

  for (const lib of libs) {
    const words = getLibWords({
      id: lib.id,
      type,
      exculedMemorized: options.exculedMemorized,
    })
    for (const target of options.target) {
      try {
        let path = join(targetFolders[target], `${lib.name}.txt`)
        if (target === "translation")
          path = join(targetFolders[target], `${lib.name}.csv`)
        if (!options.override && fs.existsSync(path)) {
          score.status[target] = "🟡"
          continue
        }
        if (!words.length) throw new Error("No words found")

        let content = ""
        if (target === "translation") {
          if (databases.ecdict?.db) {
            content = transform(translateAll(words), target)
          } else {
            throw new Error("No ecdict database found")
          }
        } else {
          content = transform(words, target)
        }
        await fs.writeFile(path, content)
        score.status[target] = "🟢"
      } catch (e) {
        console.error(e)
        score.status[target] = "🔴"
      }
    }
    const status = [score.status.word, score.status.list, score.status.translation] as ExportLog["status"]
    score.completed++
    if (status.includes("🔴")) score.failed++

    const log: ExportLog = {
      completed: score.completed,
      failed: score.failed,
      status,
      name: lib.name,
      all: libs.length,
      time: new Date().toLocaleString(),
    }
    if (await fnEvery(log)) return
    score.status = { ...initStatus }
  }
}
