import { useAtomValue } from "jotai"
import { Log } from "./Log"
import { Preview } from "./Preview"
import { exportStateAtom, previewLibAtom } from "~/atom"

export function ShowInfo() {
  const previewLib = useAtomValue(previewLibAtom)
  const exportState = useAtomValue(exportStateAtom)
  if (previewLib.preview)
    return <Preview />
  else if (exportState.status !== "idle")
    return <Log />
}
