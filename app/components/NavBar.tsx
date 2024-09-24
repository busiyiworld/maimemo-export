import { useAtom } from "jotai"
import { ThemeToggle } from "./ThemeToggle"
import { exportStateAtom, initPreviewLib, previewLibAtom } from "~/atom"

export function NavBar() {
  const [previewLib, setPreviewLib] = useAtom(previewLibAtom)
  const [exportState, setExportState] = useAtom(exportStateAtom)
  return (
    <div className="flex-gap-3 items-center flex-wrap flex">
      <button
        type="button"
        className={c("px3 py1 text-base btn-action", previewLib.type === "base" && "btn-action-active")}
        disabled={exportState.status === "running"}
        onClick={() => {
          setPreviewLib({
            ...initPreviewLib,
            type: "base",
          })
          setExportState({
            ...exportState,
            selected: [],
          })
        }}
      >
        <div className=" i-ph:database flex-none " />
        本地词库
      </button>
      <button
        type="button"
        className={c("px3 py1 text-base btn-action", previewLib.type === "cloud" && "btn-action-active")}
        disabled={exportState.status === "running"}
        onClick={() => {
          setPreviewLib({
            ...initPreviewLib,
            type: "cloud",
          })
          setExportState({
            ...exportState,
            selected: [],
          })
        }}
      >
        <div className="i-ph:cloud flex-none" />
        云词库
      </button>
      <a
        href="/"
        className="i-ph:arrow-clockwise-bold op50 hover:op75"
        title="刷新"
      />
      <ThemeToggle />
      <a
        href="https://github.com/busiyiworld/maimemo-export"
        target="_blank"
        className="i-carbon-logo-github text-lg op50 hover:op75"
        rel="noreferrer noopener"
      />
    </div>
  )
}
