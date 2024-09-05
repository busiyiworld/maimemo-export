import { useAtom, useAtomValue } from "jotai"
import { Selector } from "./Common"
import { trpc } from "~/trpcClient"
import type { Target } from "@/types"
import { exporterOptionsAtom, previewLibAtom } from "~/atom"

export function Preview() {
  const options = useAtomValue(exporterOptionsAtom)
  const [previewLib, setPreviewLib] = useAtom(previewLibAtom)
  const queryPreview = trpc.preview.useQuery({
    id: previewLib.id,
    type: previewLib.type,
    exculedMemorized: options.exculedMemorized,
    target: previewLib.target,
  })
  return (
    <div className="pt-2 pl-2 flex flex-col flex-1">
      <div className="text-3 rounded flex justify-between mb2">
        <span className="text-truncate">{ previewLib.name}</span>
        <Selector
          className="w-80px! bg-primary-500/5 mr-2"
          value={previewLib.target}
          onChange={(e) => {
            setPreviewLib({ ...previewLib, target: e.currentTarget.value as Target })
          }}
          options={[
            { value: "word", label: "仅单词" },
            { value: "list", label: "单词和章节" },
            { value: "translation", label: "单词和翻译" },
          ] as {
            value: Target
            label: string
          }[]}
        />
      </div>
      <textarea value={queryPreview.data} disabled className="font-mono resize-none w-full h-full bg-transparent scrollbar-base" />
    </div>
  )
}
