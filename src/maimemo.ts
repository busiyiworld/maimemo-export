import { type Database } from "libsql"
import { BookOption, Word } from "typings"
// 本地词库
export class MaimemoDB {
  private db: Database
  constructor(db: Database) {
    this.db = db
  }
  // 获取所有书名
  getAllBookName() {
    const res = this.db
      .prepare("SELECT name FROM BK_TB ORDER BY name")
      .all() as { name: string }[]
    return res.map(k => k.name)
  }
  getAllWordsInfo(book?: string, option?: BookOption) {
    try {
      // 如果没有填写书名，默认是获取背过的单词
      const res = this.db
        .prepare(
          book
            ? `
            SELECT spelling as word, list, "order"
            FROM VOC_TB
            INNER JOIN(
                SELECT title as list, voc_origin_id, chapter_origin_id, "order"
                FROM BK_VOC_TB AS V
                  INNER JOIN BK_CHAPTER_TB AS C ON V.chapter_origin_id = C.id
                  AND V.book_origin_id IN ( SELECT origin_id FROM BK_TB WHERE name = '${book}' )
                ) AS tmp ON VOC_TB.origin_id = tmp.voc_origin_id
            ORDER BY "order"
        `
            : `
        SELECT spelling as word
        FROM LSR_TB AS LT INNER JOIN VOC_TB AS VT ON LT.lsr_new_voc_id = VT.id
        ORDER BY word
        `
        )
        .all() as Word[]

      const defaultOpt = {
        order: "book",
        reverse: false
      }

      const { order, reverse } = option
        ? Object.assign(defaultOpt, option)
        : defaultOpt

      const sorted = (() => {
        switch (order) {
          case "initials":
            return res.sort((x, y) => (x.word > y.word ? 1 : -1))
          case "book":
            return res
          default:
            return res
        }
      })()
      return reverse ? sorted.reverse() : sorted
    } catch {
      console.error("没找到这本书")
      return []
    }
  }
}
