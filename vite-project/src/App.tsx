
import HeaderApp from "./components/HeaderApp"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Conta from "./pages/Conta"
import NoPage from "./pages/NoPage"
import Themes from "./pages/Themes"

import { Toaster } from "@/components/ui/toaster"

function App() {
  let page
  switch (window.location.pathname) {
    case "/":
    case "/Login":
      page = <Login/>
      break
    case "/Home":
      page = <>
        <HeaderApp />
        <Home/>
      </>
      break
    case "/Conta":
      page = <>
        <HeaderApp />
        <Conta/>
      </>
      break
    case "/Themes":
      page = <>
        <HeaderApp />
        <Themes/>
      </>
      break
    default:
      page = <NoPage/>
      break
  }

  return (
    <>
      <div>
        {page}
        <Toaster />
      </div>
    </>
  )
}

export default App