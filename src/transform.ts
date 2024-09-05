import { stringify } from "csv-stringify/sync"
import type { Target, Word } from "@/types"

export function transform(words: Word[], traget: Target): string {
  if (traget === "list") {
    let list = words[0]?.list
    if (list) {
      return words
        .reduce(
          (acc, cur) => {
            if (cur.list !== list) {
              list = cur.list!
              acc.push(`#${list}`)
            }
            acc.push(cur.word)
            return acc
          },
          [`#${list}`],
        )
        .join("\n")
    }
  } else if (traget === "translation") {
    return stringify(words.map(k => ({
      word: k.word,
      translation: k.translation,
    })))
  }
  // target = word
  return words.map(obj => obj.word).join("\n")
}
