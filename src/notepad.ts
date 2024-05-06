import { type Database } from "bun:sqlite"
import { BookOption, Word } from "typings"
// 云词库
export class NotePad {
  private notepad: Database
  private maimemo: Database
  constructor(notepad: Database, maimemo: Database) {
    this.notepad = notepad
    this.maimemo = maimemo
  }
  getAllBookName() {
    const res = this.notepad.prepare("SELECT title FROM notepad").all() as {
      title: string
    }[]
    return res.map(k => k.title)
  }
  getAllWordsInfo(book: string, option?: BookOption): Word[] {
    try {
      // 如果没有填写书名，默认是获取背过的单词
      const _ = this.notepad
        .prepare(
          `
        SELECT voc_id, voc_tag, voc_order
        FROM notepad INNER JOIN (
            SELECT tag as voc_tag, "order" as voc_order, voc_id, notepad_id
            FROM notepad_voc
            ) as tmp ON id = tmp.notepad_id
        WHERE title = '${book}'
        ORDER by voc_order
        `
        )
        .all() as {
        voc_id: string
        voc_tag: string
      }[]
      const res = _.map(k => ({
        ...(this.maimemo
          .prepare(
            `SELECT spelling as word FROM VOC_TB WHERE id = '${k.voc_id}'`
          )
          .get() as Word),
        list: k.voc_tag
      })) as Word[]
      const defaultOpt = {
        order: "book",
        reverse: false
      }

      const { order, reverse } = option
        ? { ...defaultOpt, ...option }
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
    } catch (e) {
      console.log(e)
      return []
    }
  }
}
