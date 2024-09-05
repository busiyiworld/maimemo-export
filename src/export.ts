import { join } from "node:path"
import fs from "fs-extra"
import { getLibWords, getLibs, translateAll } from "./get"
import { checkDatabases, databases, ensureTargetFolders } from "./db"
import { transform } from "./transform"
import type { ExportFnProps, ExportLog, Target, TrafficLights } from "@/types"

export async function exportLib({ selected, range, type, options, fnEvery }: ExportFnProps & { fnEvery: (log: ExportLog) => Promise<boolean> }) {
  checkDatabases()
  const targetFolders = await ensureTargetFolders(options.folderName)

  let libs = selected
  if (range === "all")
    libs = getLibs(type).map(k => ({
      id: k.id,
      name: k.name,
    }))

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
      let path = join(targetFolders[target], `${lib.name}.txt`)
      if (target === "translation")
        path = join(targetFolders[target], `${lib.name}.csv`)

      if (!options.override && fs.existsSync(path)) {
        score.status[target] = "🟡"
        continue
      }

      let content = ""
      if (target === "translation")
        if (databases.ecdict?.db)
          content = transform(translateAll(words), target)
        else
          continue
      else
        content = transform(words, target)

      if (!content) {
        score.status[target] = "🔴"
        score.failed++
        continue
      }
      await fs.writeFile(path, content)
      score.status[target] = "🟢"
    }
    score.completed++
    const log: ExportLog = {
      completed: score.completed,
      failed: score.failed,
      status: [score.status.word, score.status.list, score.status.translation],
      name: lib.name,
      all: libs.length,
      time: new Date().toLocaleString(),
    }
    if (await fnEvery(log))
      return
    score.status = { ...initStatus }
  }
}
