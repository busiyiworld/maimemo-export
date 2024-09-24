import { checkDatabases, databases } from "src/db"
import { getLibWords, getLibs } from "src/query"
import { beforeAll, expect, it } from "vitest"

beforeAll(() => {
  checkDatabases()
})

it("db status", async () => {
  expect(databases.ecdict?.status).toBe(true)
  expect(databases.maimemo_base?.status).toBe(true)
  expect(databases.maimemo_cloud?.status).toBe(true)
})

it("get libs", () => {
  expect(getLibs("base").length).toBeGreaterThan(0)
  expect(getLibs("cloud").length).toBeGreaterThan(0)
})

it("get lib words", () => {
  const words = getLibWords({ id: 13110210, type: "base", exculedMemorized: false })
  expect(words.length).toBeGreaterThan(0)
  expect(getLibWords({ id: 13110210, type: "base", exculedMemorized: true }).length).toBeLessThan(words.length)
  expect(getLibWords({ id: 458595, type: "cloud", exculedMemorized: false }).length).toBeGreaterThan(0)
})
