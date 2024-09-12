import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import Loader from "./components/Loader"; // Supondo que você tenha um componente Loader

function Main() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    var loader = document.getElementById("loader");
    if (loader) {
      loader.style.display = "none";
      var imgLogo = loader.children[0];
      imgLogo.setAttribute("style", "display:none");
      setIsLoading(false);
    }
  }, []);

  return <BrowserRouter>{isLoading ? <Loader /> : <App />}</BrowserRouter>;
}

ReactDOM.createRoot(document.getElementById("root")!).render(<Main />);
