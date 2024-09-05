import clsx from "clsx"
import { useAtom, useAtomValue } from "jotai"
import type { HTMLProps } from "react"
import { useCallback, useEffect, useMemo } from "react"
import useWebSocket from "react-use-websocket"
import type { ExportFnProps, ExportLog, WSMessgae } from "@/types"
import { databaseStatusAtom, exportStateAtom, exporterOptionsAtom, previewLibAtom } from "~/atom"

export function ExportAction() {
  const [exportState, setExportState] = useAtom(exportStateAtom)
  const exporterOptions = useAtomValue(exporterOptionsAtom)
  const databaseStatus = useAtomValue(databaseStatusAtom)
  const { sendJsonMessage, lastJsonMessage } = useWebSocket<ExportLog>(`ws://${location.host}/_ws`)
  const [previewLib, setPreviewLib] = useAtom(previewLibAtom)
  useEffect(() => {
    if (lastJsonMessage)
      setExportState({
        ...exportState,
        logs: [lastJsonMessage, ...exportState.logs],
        status: lastJsonMessage.completed === lastJsonMessage.all ? "completed" : "running",
      })
  }, [lastJsonMessage])

  const exportAll = useCallback(() => {
    // 点击开始导出，再点击停止导出
    if (exportState.range === "all" && exportState.status === "running") {
      setExportState({ ...exportState, status: "completed" })
      sendJsonMessage<WSMessgae>({
        type: "stop",
        error: "用户主动停止",
      })
    }
    else {
      setExportState({ ...exportState, range: "all", status: "running", logs: [] })
      // 异步的
      sendJsonMessage<WSMessgae<ExportFnProps>>({
        type: "export",
        data: {
          range: "all",
          type: previewLib.type,
          selected: exportState.selected,
          options: exporterOptions,
        },
      })
      setPreviewLib(prev => ({
        ...prev,
        preview: false,
      }))
    }
  }, [exportState, previewLib.type, exporterOptions])
  const exportSelected = useCallback(() => {
    if (exportState.range === "selected" && exportState.status === "running") {
      setExportState({ ...exportState, status: "completed" })
      sendJsonMessage<WSMessgae>({
        type: "stop",
        error: "用户主动停止",
      })
    }
    else {
      setExportState({ ...exportState, range: "selected", status: "running", logs: [] })
      sendJsonMessage<WSMessgae<ExportFnProps>>({
        type: "export",
        data: {
          range: "selected",
          type: previewLib.type,
          selected: exportState.selected,
          options: exporterOptions,
        },
      })
      setPreviewLib(prev => ({
        ...prev,
        preview: false,
      }))
    }
  }, [exportState, previewLib.type, exporterOptions])
  const selectedStatus = useMemo(() => {
    // 没要选中，或者正在导出全部
    if (!databaseStatus.maimemo_base || (exportState.status === "running" && exportState.range === "all") || exportState.selected.length === 0)
      return "disabled"

    else if (exportState.status === "running" && exportState.range === "selected")
      return "stop"

    else
      return "idle"
  }, [exportState])
  const allStatus = useMemo(() => {
    if (!databaseStatus.maimemo_base || (exportState.status === "running" && exportState.range === "selected"))
      return "disabled"

    else if (exportState.status === "running" && exportState.range === "all")
      return "stop"

    else
      return "idle"
  }, [exportState, databaseStatus.maimemo_base])
  return (
    <div className="flex justify-between">
      <ExportButton status={allStatus} onClick={exportAll} label="导出全部" />
      <ExportButton status={selectedStatus} onClick={exportSelected} label="导出选中" />
    </div>
  )
}

/**
 * disabled: 对面正在导出，或者没有选中
 * stop: 当前正在导出
 * false: 没有导出，正常形态
 */
function ExportButton({ status, onClick, label, ...props }: { status: "disabled" | "stop" | "idle" } & HTMLProps<HTMLButtonElement>) {
  return <button {...props} type="button" onClick={onClick} disabled={status === "disabled"} className={clsx("btn-action", status === "disabled" ? "btn-action" : "btn-action-active", props.className)}>{status === "stop" ? "停止导出" : label}</button>
}
