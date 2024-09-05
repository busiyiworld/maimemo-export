import { QueryClient } from "@tanstack/react-query"
import { httpBatchLink } from "@trpc/client"
import { createTRPCQueryUtils, createTRPCReact } from "@trpc/react-query"
import type { AppRouter } from "../trpcServer"

export const queryClient = new QueryClient()
export const trpc = createTRPCReact<AppRouter>({})

export default trpc

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/trpc",
    }),
  ],
})

export const trpcQueryUtils = createTRPCQueryUtils({
  queryClient,
  client: trpcClient,
})
