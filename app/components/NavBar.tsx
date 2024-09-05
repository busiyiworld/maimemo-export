import { useAtom } from "jotai"
import { ThemeToggle } from "./ThemeToggle"
import { initPreviewLib, previewLibAtom } from "~/atom"

export function NavBar() {
  const [previewLib, setPreviewLib] = useAtom(previewLibAtom)
  return (
    <div className="flex-gap-3 items-center flex-wrap flex">
      <button
        className={c("px3 py1 text-base btn-action", previewLib.type === "base" && "btn-action-active")}
        onClick={() => {
          setPreviewLib({
            ...initPreviewLib,
            type: "base",
          })
        }}
      >
        <div className=" i-ph:database flex-none " />
        本地词库
      </button>
      <button
        className={c("px3 py1 text-base btn-action", previewLib.type === "cloud" && "btn-action-active")}
        onClick={() => {
          setPreviewLib({
            ...initPreviewLib,
            type: "cloud",
          })
        }}
      >
        <div className="i-ph:cloud flex-none" />
        云词库
      </button>
      <ThemeToggle />
      <a
        href="https://github.com/busiyiworld/maimemo-export"
        target="_blank"
        className="i-carbon-logo-github text-lg op50 hover:op75"
      />
    </div>
  )
}
