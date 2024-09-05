/**
 * Database
 * Library
 * Word
 * SelectedLibs
 * PreviewLib
 * Options
 * ExportState
 */

export interface DatabaseStatus {
  path: string
  db?: import("libsql").Database
  status: boolean
  error?: string
}

export interface PreviewLib {
  name: string
  id: number
  target: Target
  type: LibType
  preview: boolean
}

export interface Library {
  name: string
  id: number
}

export interface Word {
  word: string
  list?: string
  translation?: string
}

export interface ExportState {
  status: "idle" | "running" | "completed"
  range: Range
  logs: ExportLog[]
  selected: SelectedLib[]
}

export type TrafficLights = "🟢" | "🟡" | "🔴"
export interface ExportLog {
  all: number
  completed: number
  failed: number
  status: [TrafficLights, TrafficLights, TrafficLights]
  // 可以通过三个圆点 word list translation 🚥
  // 🟢 🟡 🔴 绿=成功 黄=跳过或者没导出 红=失败
  name: string
  time: string
  stop?: boolean
}
export interface SelectedLib {
  id: number
  name: string
}

export type LibType = "base" | "cloud"

export const targets = ["word", "list", "translation"] as const

export type Target = (typeof targets)[number]

export type Range = "all" | "selected"

export interface ExportOptions {
  target: Target[]
  folderName: string
  exculedMemorized: boolean
  override: boolean
}

export interface ExportFnProps {
  range: Range
  type: LibType
  options: ExportOptions
  selected: SelectedLib[]
}

export interface WSMessgae<T = undefined> {
  type: "stop" | "export"
  data?: T
  error?: string
}
