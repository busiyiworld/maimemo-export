import { checkDatabases, databases } from "./db"

export function translateByDict(word: string): string {
  checkDatabases()
  if (databases.ecdict?.db === undefined)
    throw new Error("ecdict database not found")
  // 缩写
  word = word.replace(/sb\.|sth\./g, "...")
  const sw = word.replace(/\W/g, "")
  const sql
    = word === sw
      ? `SELECT translation,word FROM stardict WHERE word = '${word}'`
      : `SELECT translation,word FROM stardict WHERE sw = '${sw}'`
  const res = databases.ecdict.db.prepare(sql).all() as {
    translation: string
    word: string
  }[]
  if (!res.length)
    return ""
  const info = res.find(k => k.word === word)
  if (!info || !info.translation)
    return ""
  const { translation } = info
  if (translation.includes("\n")) {
    return translation
      .split("\n")
      .filter(k => k && !k.includes("人名"))
      .join("\n")
      .replace(/[[〈〔【].+?[】〕〉\]]/g, "")
  } else {
    return translation.replace(/[[〈〔【].+?[】〕〉\]]/g, "")
  }
}
