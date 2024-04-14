import Database from "libsql"
const db = new Database("./database/ultimate.db", {
  fileMustExist: true,
  readonly: true
  //  verbose: console.log
})
export const translateByDict = (word: string) => {
  // 缩写
  word = word.replace(/sb\.|sth\./g, "...")
  const sw = word.replace(/\W/g, "")
  const sql =
    word === sw
      ? `SELECT translation,word FROM stardict WHERE word = '${word}'`
      : `SELECT translation,word FROM stardict WHERE sw = '${sw}'`
  const res = db.prepare(sql).all() as {
    translation: string
    word: string
  }[]
  if (!res.length) return "找不到解释"
  const info = res.find(k => k.word === word)
  if (!info || !info.translation) return "找不到解释"
  let { translation } = info
  if (translation.includes("\n")) {
    return translation
      .split("\n")
      .filter(k => k && !k.includes("人名"))
      .join("\n")
      .replace(/[\[〈〔【].+?[】〕〉\]]/g, "")
  } else return translation.replace(/[\[〈〔【].+?[】〕〉\]]/g, "")
}

// console.log(translateByDict("put trust in sb."))
