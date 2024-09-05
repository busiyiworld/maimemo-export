import { useAtomValue } from "jotai"
import { useMemo } from "react"
import { exportStateAtom } from "~/atom"

export function Log() {
  const exportState = useAtomValue(exportStateAtom)
  const content = useMemo(() => {
    const logs = exportState.logs
    if (logs.length === 0) {
      return {
        content: "",
        score: <></>,
      }
    }

    return {
      content: logs.sort(a => a.status.includes("🔴") ? -1 : 1).map(l => `${l.status.join(" ")} ${l.time}\n${l.name}`).join("\n\n"),
      score:
        <>
          {!!logs[0].failed && (
            <span>
              <span className="color-red">{`${logs[0].failed}`}</span>
              { " / " }
            </span>
          )}
          <span>{ `${logs[0].completed} / ${logs[0].all}`}</span>
        </>,
    }
  }, [exportState.logs])
  return (
    <div className="pt-2 pl-2 flex flex-col flex-1 relative">
      <div className="absolute right-2 px-2 rounded bg-base">{content.score}</div>
      <textarea value={content.content} disabled className="font-mono resize-none w-full h-full bg-transparent scrollbar-base" />
    </div>
  )
}
