/// <reference types="vinxi/types/client" />

import ReactDOM from "react-dom/client"

import { QueryClientProvider } from "@tanstack/react-query"
import { App } from "./app"
import { queryClient, trpc, trpcClient } from "./trpcClient"

const rootElement = document.getElementById("root")!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </QueryClientProvider>
    </trpc.Provider>,
  )
}
