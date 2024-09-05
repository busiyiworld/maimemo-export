import { getLibs } from "src/get"
import { markdownTable } from "markdown-table"
import fs from "fs-extra"
import type { Target } from "@/types"

const fileName = "词库.md"
function genDownloadURL(name: string, target: Target) {
  const suffix = target === "translation" ? "csv" : "txt"
  return `[⬇️](https://github.com/busiyiworld/maimemo-export/blob/main/exported/${target}/${encodeURIComponent(name)}.${suffix})`
}
async function main() {
  const libs = getLibs("base")
  const content = markdownTable([
    ["词库名", "仅单词", "单词和章节", "单词和翻译"],
    ...libs.map(k => [k.name, genDownloadURL(k.name, "word"), genDownloadURL(k.name, "list"), genDownloadURL(k.name, "translation")]),
  ], { align: ["l", "c", "c", "c"] })
  await fs.writeFile(fileName, content)
}

main().catch(console.error)
