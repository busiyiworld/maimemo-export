import { fileURLToPath } from "node:url"
import { join } from "node:path"
import { ensureDir } from "fs-extra"
import { type Target, targets } from "@/types"

// 在 esm 中 import.meta.url 应该是模块文件原始的位置，比较方便用于定位。
export const projectDir = fileURLToPath(new URL("..", import.meta.url))
export const databaseDir = join(projectDir, "database")
export const exportedDir = join(projectDir, "exported")

export async function ensureExportedFolder() {
  await ensureDir(exportedDir)
  return {
    path: exportedDir,
    status: true,
  }
}

export async function ensureTargetFolders(folder: string) {
  const folders: Record<Target, string> = {
    word: "",
    list: "",
    translation: "",
  }
  for (const target of targets) {
    folders[target] = join(exportedDir, folder, target)
    await ensureDir(folders[target])
  }

  return folders
}
