import type BetterSqlite3 from "better-sqlite3"
import { BookOption, Word } from "typings"
// 云词库
export class NotePad {
  private notepad: BetterSqlite3.Database
  private maimemo: BetterSqlite3.Database
  constructor(
    notepad: BetterSqlite3.Database,
    maimemo: BetterSqlite3.Database
  ) {
    this.notepad = notepad
    this.maimemo = maimemo
  }
  getAllBookName() {
    const res = this.notepad.prepare("SELECT ub_name FROM UB_TB").all() as {
      ub_name: string
    }[]
    return res.map(k => k.ub_name)
  }
  getAllWordsInfo(book: string, option?: BookOption): Word[] {
    try {
      // 如果没有填写书名，默认是获取背过的单词
      const _ = this.notepad
        .prepare(
          `
        SELECT ubv_voc_id, ubv_tag
        FROM UB_TB INNER JOIN UB_VOC_TB ON ub_id = ubv_userbook_id
        WHERE ub_name = '${book}'
        ORDER BY ubv_order
        `
        )
        .all() as {
        ubv_voc_id: string
        ubv_tag: string
      }[]
      const res = _.map(k =>
        Object.assign(
          this.maimemo
            .prepare(`SELECT * FROM VOC_TB WHERE vc_id = '${k.ubv_voc_id}'`)
            .get(),
          { list: k.ubv_tag }
        )
      ) as Word[]

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
            return res.sort((x, y) =>
              x.vc_vocabulary > y.vc_vocabulary ? 1 : -1
            )
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
