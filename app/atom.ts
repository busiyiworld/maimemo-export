import type { PrimitiveAtom } from "jotai"
import { atom } from "jotai"
import type { ExportOptions, ExportState, PreviewLib } from "@/types"

function atomWithLocalStorage<T>(key: string, initialValue: T): PrimitiveAtom<T> {
  const getInitialValue = () => {
    const item = localStorage.getItem(key)
    if (item !== null)
      return JSON.parse(item)

    return initialValue
  }
  const baseAtom = atom(getInitialValue())
  const derivedAtom = atom(
    get => get(baseAtom),
    (get, set, update) => {
      const nextValue
        = typeof update === "function" ? update(get(baseAtom)) : update
      set(baseAtom, nextValue)
      localStorage.setItem(key, JSON.stringify(nextValue))
    },
  )
  return derivedAtom
}

export const initPreviewLib: PreviewLib = {
  name: "",
  id: 0,
  target: "word",
  type: "base",
  preview: false,
}
export const previewLibAtom = atom<PreviewLib>({
  ...initPreviewLib,
})

export const exporterOptionsAtom = atomWithLocalStorage<ExportOptions>("options", {
  target: ["word", "list", "translation"],
  exculedMemorized: false,
  folderName: "",
  override: false,
})

export const exportStateAtom = atom<ExportState>({
  status: "idle",
  range: "all",
  logs: [],
  selected: [],
})

export const databaseStatusAtom = atom({
  maimemo_base: false,
  maimemo_cloud: false,
  ecdict: false,
})
