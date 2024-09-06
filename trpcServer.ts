import { defineEventHandler, toWebRequest } from "vinxi/http"
import { initTRPC } from "@trpc/server"
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { z } from "zod"
import { ensureExportedFolder } from "src/dir"
import { checkDatabases } from "./src/db"
import { getLibs, previewLibWords } from "./src/query"

const t = initTRPC.create()

const appRouter = t.router({
  databaseStatus: t.procedure.query(() => checkDatabases()),
  libs: t.procedure.input(z.enum(["base", "cloud"])).query(req =>
    getLibs(req.input),
  ),
  folderStatus: t.procedure.query(async () => await ensureExportedFolder()),
  preview: t.procedure.input(z.object({
    id: z.number(),
    type: z.optional(z.enum(["base", "cloud"])).default("base"),
    exculedMemorized: z.optional(z.boolean()).default(false),
    target: z.optional(z.enum(["word", "list", "translation"])).default("word"),
  })).query(req => previewLibWords(req.input)),
})

export type AppRouter = typeof appRouter

export default defineEventHandler((event) => {
  const request = toWebRequest(event)

  return fetchRequestHandler({
    endpoint: "/trpc",
    req: request,
    router: appRouter,
  })
})
