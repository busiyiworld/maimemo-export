import { Title } from "./components/Title"
import { StatusBar } from "./components/StatusBar"
import { NavBar } from "./components/NavBar"
import { Options } from "./components/Options"
import { ShowInfo } from "./components/ShowInfo"
import { WordTable } from "~/components/WordTable"

import "./styles/globals.css"
import "virtual:uno.css"
import "@unocss/reset/tailwind.css"

export function App() {
  return (
    <div className="max-w-screen-lg mx-auto">
      <div id="main" className="flex flex-col h-100vh px4 py6 lg:py10 gap4">
        <Title />
        <StatusBar />
        <NavBar />
        <div className="grid grid-cols-5 border-base border rounded">
          <div className="col-span-3 border-base border-r">
            <WordTable />
          </div>
          <div className="col-span-2 flex flex-col">
            <Options />
            <ShowInfo />
          </div>
        </div>
      </div>
      {/* <ReactQueryDevtools position="right" /> */}
    </div>
  )
}
