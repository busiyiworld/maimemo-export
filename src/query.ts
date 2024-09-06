import { sql } from "./sql"
import { translateByDict } from "./translate"
import { transform } from "./transform"
import { databases } from "./db"
import type { LibType, Library, Target, Word } from "@/types"

let memorizedWords: string[] = []
export function getLibs(type: LibType = "base"): Library[] {
  if (!databases.maimemo_base?.db)
    return []
  if (type === "base") {
    return databases
      .maimemo_base
      .db
      .prepare(sql.base.queryBaseLibs)
      .all() as Library[]
  } else if (type === "cloud" && databases.maimemo_cloud?.db) {
    return (databases.maimemo_cloud.db.prepare(sql.cloud.queryCloudLibs).all() as Library[]).map(k => ({
      ...k,
      name: k.name.replace(/[\\/]/g, " "),
    }))
  }

  return []
}

interface Props {
  id: number
  type: LibType
  exculedMemorized: boolean
  target: Target
}

/**
 * 主要用于预览
 */
export function previewLibWords({
  id,
  type = "base",
  exculedMemorized = false,
  target = "word",
}: Props) {
  const words = getLibWords({ id, type, exculedMemorized })
  if (target === "translation") {
    if (!databases.maimemo_base?.db)
      return ""
    else
      return transform(translateAll(words), target)
  } else {
    return transform(words, target)
  }
}

/**
 * 不包括 translation，比较耗时
 */
export function getLibWords({
  id,
  type = "base",
  exculedMemorized = false,
}: Omit<Props, "target">): Word[] {
  try {
    if (!id || !databases.maimemo_base?.db)
      return []
    let words: Word[] = []
    if (type === "base") {
      words = databases.maimemo_base.db.prepare(sql.base.queryBaseLibWordsByID).all(id) as Word[]
    } else if (type === "cloud" && databases.maimemo_cloud?.db) {
      const raw = databases.maimemo_cloud.db.prepare(sql.cloud.queryCloudLibWordsIDByID).all(id) as {
        id: string
        list: string
      }[]
      const preparedSQL = databases.maimemo_base.db.prepare(sql.base.queryWordByID)
      raw.forEach((k) => {
        const result = preparedSQL.get(k.id) as { word: string }
        if (result) {
          words.push({
            word: result.word,
            list: k.list,
          } as Word)
        }
      })
    }

    if (exculedMemorized) {
      if (memorizedWords.length === 0)
        memorizedWords = (databases.maimemo_base.db.prepare(sql.base.queryMemorizedWords).all() as { word: string }[]).map(k => k.word)

      words = words.filter(k => !memorizedWords.includes(k.word))
    }

    return words
  } catch (e) {
    console.error(e)
    return []
  }
}

export function translateAll(words: Word[]) {
  return words.map(k => ({
    ...k,
    translation: translateByDict(k.word),
  }))
}
