import { Toaster } from "./components/ui/toaster";
import { ThemeProvider } from "./components/theme-provider";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import { lazy, Suspense } from 'react';
import { AccountProvider } from "./components/AccountContext";

const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const UserLayout = lazy(() => import("./pages/user/UserLayout"));
const LoginPage = lazy(() => import("./pages/LoginPageN"));

function App() {
  localStorage.setItem("isLogged", "false");
  localStorage.setItem("isAdmin", "false");
  const isLogged = localStorage.getItem('isLogged') === 'true';
  const isAdmin = localStorage.getItem('isAdmin') === 'true'|| false;

  return (
    <ThemeProvider>
      <AccountProvider>
      <Routes>
          <Route path="/login" element={<LoginPage />} />
          {isLogged ? (
            <>
              <Route path="/user" element={<UserLayout />} />
              {isAdmin && <Route path="/admin" element={<AdminLayout />} />}
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      <Toaster />
      </AccountProvider>
    </ThemeProvider>
  );
}


export default App;