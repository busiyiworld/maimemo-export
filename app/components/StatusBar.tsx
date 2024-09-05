import { useSetAtom } from "jotai"
import { useEffect, useMemo } from "react"
import { trpc } from "~/trpcClient"
import { databaseStatusAtom } from "~/atom"

export function StatusBar() {
  const queryDatabaseStatus = trpc.databaseStatus.useQuery()
  const queryFolderStatus = trpc.folderStatus.useQuery()
  const databases = queryDatabaseStatus.data
  const status = useMemo<{
    label: string
    status?: boolean
    path?: string
    error?: string
  }[]>(() => ([
    {
      label: "基础数据库",
      ...databases?.maimemo_base,
    },
    { label: "云词库数据库", ...databases?.maimemo_cloud },
    { label: "ECDict 词典数据库", ...databases?.ecdict },
    { label: "导出词库文件夹", ...queryFolderStatus.data },
  ]), [databases])

  const setDatabaseStatus = useSetAtom(databaseStatusAtom)
  useEffect(() => {
    setDatabaseStatus({
      maimemo_base: !!databases?.maimemo_base?.status,
      maimemo_cloud: !!databases?.maimemo_cloud?.status,
      ecdict: !!databases?.ecdict?.status,
    })
  }, [databases])

  return (
    <div>
      {status.map(({ label, status, path, error }) => (
        <div key={label} className="flex justify-between">
          <span>{label}</span>
          <div className="flex items-center">
            <span className={c(!status && "line-through", "op50 hover:op80 overflow-revert-layer")}>{path}</span>
            <span title={error} className={c("inline-block  ml-1", status ? " i-ph:circle-wavy-check-light color-primary-500" : " i-ph:warning-duotone color-red-500")} />
          </div>
        </div>
      ))}
    </div>
  )
}
