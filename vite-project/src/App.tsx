import { Toaster } from "./components/ui/toaster";
import { ThemeProvider } from "./components/theme-provider";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import NoPage from "./pages/NoPage";
import LoginPage from "./pages/LoginPageN";
import AdminLayout from "./pages/admin/AdminLayout";
import UserLayout from "./pages/user/UserLayout";
import { AccountProvider } from "./components/AccountContext";

function App() {
  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("isAdmin")
      ? localStorage.getItem("isAdmin") === "true"
      : false
  );
  const [isLogged, setIsLogged] = useState(
    localStorage.getItem("isLogged")
      ? localStorage.getItem("isLogged") === "true"
      : false
  );
  useEffect(() => {

    // Inicializa isAdmin e isLogged como false no localStorage
    if (localStorage.getItem("isAdmin") === null) {
      localStorage.setItem("isAdmin", "false");
      setIsAdmin(false);
    }
    if (localStorage.getItem("isLogged") === null) {
      localStorage.setItem("isLogged", "false");
      setIsLogged(false);
    }

    const handleStorageChange = () => {
      setIsAdmin(localStorage.getItem("isAdmin") === "true");
      setIsLogged(localStorage.getItem("isLogged") === "true");
      console.log(isLogged, isAdmin);
    };

    window.addEventListener("storage", handleStorageChange);

    // Limpeza na desmontagem
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <ThemeProvider>
      <AccountProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              localStorage.getItem("isLogged") === "true" && localStorage.getItem("isAdmin") === "true" ? <AdminLayout /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/user"
            element={
              localStorage.getItem("isLogged") === "true" && localStorage.getItem("isAdmin") === "false" ? <UserLayout /> : <Navigate to="/login" />
            }
          />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </AccountProvider>
    </ThemeProvider>
  );
}

export default App;
