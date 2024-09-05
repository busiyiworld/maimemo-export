import { useAtom } from "jotai"
import { CheckBox, SettingItem, Switch } from "./Common"
import { ExportAction } from "./ExportAction"
import { exporterOptionsAtom } from "~/atom"
import type { Target } from "@/types"

export function Options() {
  const [options, setOptions] = useAtom(exporterOptionsAtom)
  return (
    <div className="border-base border-b p2">
      <SettingItem label="排除背过的单词">
        <Switch
          checked={options.exculedMemorized}
          className="bg-active"
          onChange={e => setOptions({
            ...options,
            exculedMemorized: e.currentTarget.checked,
          })}
        />
      </SettingItem>
      <SettingItem label="覆盖已存在的词库">
        <Switch
          checked={options.override}
          className="bg-active"
          onChange={e => setOptions({
            ...options,
            override: e.currentTarget.checked,
          })}
        />
      </SettingItem>
      <SettingItem label="目标文件夹">
        <input
          type="text"
          value={options.folderName}
          className="max-w-150px ml-1em px-1 rounded bg-slate bg-op-15 focus:(bg-op-20 ring-0 outline-none)"
          onChange={(e) => {
            setOptions({
              ...options,
              folderName: e.currentTarget.value,
            })
          }}
        />
      </SettingItem>
      <SettingItem label="导出目标" className="items-start!">
        <CheckBox
          options={[
            { key: "word", label: "单词(.txt)", checked: options.target.includes("word") },
            { key: "list", label: "单词和章节(.txt)", checked: options.target.includes("list") },
            { key: "translation", label: "单词和翻译(.csv)", checked: options.target.includes("translation") },
          ]}
          className="accent-primary-600"
          onChange={(e) => {
            const id = e.currentTarget.id as Target
            if (options.target.includes(id))
              setOptions({
                ...options,
                target: options.target.filter(i => i !== id),
              })

            else
              setOptions({
                ...options,
                target: [...options.target, id],
              })
          }}
        />
      </SettingItem>
      <div className="mb-4" />
      <ExportAction />
    </div>
  )
}
