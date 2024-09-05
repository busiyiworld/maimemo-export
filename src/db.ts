import path from "node:path"
import fs, { ensureDir } from "fs-extra"
import Database from "libsql"
import { databaseDir, exportedDir } from "./dir"
import { type DatabaseStatus, type Target, targets } from "@/types"

const dbOpt = {
  readonly: true,
}

export const databases: Record<"maimemo_base" | "ecdict" | "maimemo_cloud", DatabaseStatus | undefined> = {
  maimemo_base: undefined,
  ecdict: undefined,
  maimemo_cloud: undefined,
}

function c(dbPath: string, testSQL: string): DatabaseStatus {
  if (!fs.existsSync(dbPath))
    return {
      status: false,
      path: dbPath,
      error: "Database not found",
    }

  const db = new Database(dbPath, dbOpt)
  try {
    db.prepare(testSQL).get()
  }
  catch {
    return {
      status: false,
      path: dbPath,
      error: "Database not right",
    }
  }
  return {
    path: dbPath,
    db,
    status: true,
  }
}

function r(f: string) {
  return path.join(databaseDir, f)
}

export function checkDatabases() {
  if (databases.maimemo_base?.db === undefined)
    databases.maimemo_base = c(r("maimemo_base.db"), `SELECT * FROM  "BK_VOC_TB" ORDER BY "id" LIMIT 2`)
  if (databases.maimemo_cloud?.db === undefined)
    databases.maimemo_cloud = c(r("maimemo_cloud.db"), `SELECT * FROM  "notepad" ORDER BY "id" LIMIT 2`)
  if (databases.ecdict?.db === undefined)
    databases.ecdict = c(r("ecdict_ultimate.db"), `SELECT * FROM  "stardict" ORDER BY "id" LIMIT 2`)
  return databases
}

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
    folders[target] = path.join(exportedDir, folder, target)
    await ensureDir(folders[target])
  }

  return folders
}
