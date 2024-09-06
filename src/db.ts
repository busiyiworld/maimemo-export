import path from "node:path"
import fs from "fs-extra"
import Database from "libsql"
import { databaseDir } from "./dir"
import type { DatabaseStatus } from "@/types"

const dbOpt = {
  readonly: true,
}

export const databases: Record<"maimemo_base" | "ecdict" | "maimemo_cloud", DatabaseStatus | undefined> = {
  maimemo_base: undefined,
  ecdict: undefined,
  maimemo_cloud: undefined,
}

function c(dbPath: string, testSQL: string): DatabaseStatus {
  if (!fs.existsSync(dbPath)) {
    return {
      status: false,
      path: dbPath,
      error: "Database not found",
    }
  }

  const db = new Database(dbPath, dbOpt)
  try {
    db.prepare(testSQL).get()
  } catch {
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
  databases.maimemo_base = c(r("maimemo_base.db"), `SELECT * FROM  "BK_VOC_TB" ORDER BY "id" LIMIT 2`)
  databases.maimemo_cloud = c(r("maimemo_cloud.db"), `SELECT * FROM  "notepad" ORDER BY "id" LIMIT 2`)
  databases.ecdict = c(r("ecdict_ultimate.db"), `SELECT * FROM  "stardict" ORDER BY "id" LIMIT 2`)
  return databases
}
