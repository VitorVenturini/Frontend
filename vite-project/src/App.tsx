
import HeaderApp from "./components/HeaderApp"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Conta from "./pages/Conta"
import NoPage from "./pages/NoPage"
import Themes from "./pages/Themes"


function App() {
  let page
  switch (window.location.pathname) {
    case "/Home":
      page = <Home/>
      break
    case "/Login":
      page = <Login/>
      break
    case "/Conta":
      page = <Conta/>
      break
    case "/Themes":
      page = <Themes/>
      break
    default:
      page = <NoPage/>
      break
  }

  return (
    <>
      <div>
        <HeaderApp />
        {page}
      </div>
    
    </>
  )
}

export default App
