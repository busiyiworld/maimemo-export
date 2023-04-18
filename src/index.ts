import Database from "better-sqlite3"
import { exportLibrary } from "export"
import { MaimemoDB } from "maimemo"
import { NotePad } from "notepad"

const dbOpt = {
  fileMustExist: true,
  readonly: true
  //   verbose: console.log
}

const maimemoDB = new Database("./database/maimemo.db", dbOpt)
const notepadDB = new Database("./database/notepad.db", dbOpt)
const maimemo = new MaimemoDB(maimemoDB)
const notepad = new NotePad(notepadDB, maimemoDB)
const memorizedWords = maimemo.getAllWordsInfo().map(k => k.word)

exportLibrary(maimemo.getAllBookName(), maimemo)

// exportLibrary(notepad.getAllBookName(), notepad, {
//   dir: "云词库"
// })
