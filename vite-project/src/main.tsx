import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import Loader from "./components/Loader"; // Supondo que você tenha um componente Loader

function Main() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 4000);
  }, []);

  return <BrowserRouter>{isLoading ? <Loader /> : <App />}</BrowserRouter>;
}

ReactDOM.createRoot(document.getElementById("root")!).render(<Main />);
