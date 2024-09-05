import { fileURLToPath } from "node:url"
import { join } from "node:path"

// 在 esm 中 import.meta.url 应该是模块文件原始的位置，比较方便用于定位。
export const projectDir = fileURLToPath(new URL("..", import.meta.url))
export const databaseDir = join(projectDir, "database")
export const exportedDir = join(projectDir, "exported")
