import type { ColumnDef, FilterFn, RowSelectionState } from "@tanstack/react-table"
import { flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from "@tanstack/react-table"
import { rankItem } from "@tanstack/match-sorter-utils"
import { useEffect, useMemo, useRef, useState } from "react"
import clsx from "clsx"
import { useAtom, useSetAtom } from "jotai"
import { useWindowSize } from "react-use"
import { DebouncedInput, IndeterminateCheckbox } from "./Common"
import type { Library } from "@/types"
import { trpc } from "~/trpcClient"
import { exportStateAtom, previewLibAtom } from "~/atom"

declare module "@tanstack/react-table" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({
    itemRank,
  })
  return itemRank.passed
}

export function WordTable() {
  const [previewLib, setPreviewLib] = useAtom(previewLibAtom)
  const queryLibs = trpc.libs.useQuery(previewLib.type)
  const libs = useMemo(() => queryLibs.data ?? [], [queryLibs.data])
  const [globalFilter, setGlobalFilter] = useState("")
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const { height: windowHeight } = useWindowSize()
  const tableRef = useRef<HTMLTableElement>(null)
  const setExportState = useSetAtom(exportStateAtom)
  const [exportState] = useAtom(exportStateAtom)

  useEffect(() => {
    (
      setExportState(prev => ({
        ...prev,
        selected: [...Object.entries(rowSelection).filter(([_, v]) => v).map(([k]) => libs.find(l => l.id === Number(k))!),
        ],
      }),
      ))
  }, [rowSelection])

  useEffect(() => {
    setRowSelection({})
  }, [previewLib.type])

  useEffect(() => {
    if (tableRef.current) {
      const mainElement = document.querySelector("#main")!
      const widthWithPaddings = mainElement?.clientHeight
      const elementComputedStyle = window.getComputedStyle(mainElement, null)
      // parseFloat 可以自动删除多余字符，比如 px
      const height = widthWithPaddings - Number.parseFloat(elementComputedStyle.paddingBottom)
      const tableBound = tableRef.current.getBoundingClientRect()
      tableRef.current.style.height = `${height - tableBound.y}px`
    }
  }, [windowHeight, tableRef])

  const columns = useMemo<ColumnDef<Library, any>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <IndeterminateCheckbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            hidden={!table.getIsAllRowsSelected() && !table.getIsSomeRowsSelected()}
          />
        ),
        cell: ({ row }) => (
          <div className={clsx("px-2 group-hover:visible invisible", row.getIsSelected() && "visible!")}>
            <IndeterminateCheckbox
              checked={row.getIsSelected()}
              disabled={!row.getCanSelect()}
              indeterminate={row.getIsSomeSelected()}
              onChange={row.getToggleSelectedHandler()}
            />
          </div>
        ),
      },
      {
        accessorKey: "name",
        header: "词库",
      },
    ],
    [],
  )

  const table = useReactTable({
    data: libs,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    onRowSelectionChange: setRowSelection,
    getRowId: row => String(row.id),
    state: {
      globalFilter,
      rowSelection,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "fuzzy",
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="flex flex-col flex-1">
      <div className="flex relative border-base border-b">
        <DebouncedInput
          value={globalFilter ?? ""}
          onChange={value => setGlobalFilter(String(value))}
          className="bg-transparent py2 pl8 pr-2 outline-none w-full"
          placeholder={`在 ${libs.length} 个词库中搜索`}
        />
        <div className="i-ph-magnifying-glass-duotone absolute left-2 top-3 flex op50" />
      </div>
      <table ref={tableRef} className="block relative scrollbar-base">
        <thead className="sticky z-10 top-0 bg-base shadow-gray-500/15 shadow">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {!header.isPlaceholder && (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </div>
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr
                key={row.id}
                className="hover:bg-slate hover:bg-op-10 group border-base border-t"
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td
                      key={cell.id}
                      onClick={() => {
                        if (cell.column.id === "name") {
                          if (Object.values(rowSelection).filter(v => v).length <= 1) {
                            setRowSelection({
                              [row.id]: !row.getIsSelected(),
                            })
                          }
                        }

                        setPreviewLib({
                          ...previewLib,
                          name: row.original.name,
                          id: row.original.id,
                          preview: exportState.status !== "running",
                        })
                        if (exportState.status === "completed") {
                          setExportState({
                            ...exportState,
                            status: "idle",
                          })
                        }
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/**
 *  table
 *  - thead
 *    - tr
 *      - th
 *  - tbody
 *    - tr
 *      - td
 */
