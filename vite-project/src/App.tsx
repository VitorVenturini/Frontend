import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import {
  AccountProvider,
  AccountContext,
  useAccount,
} from "./components/account/AccountContext";
import UserLayout from "./pages/user/UserLayout";
import LoginPage from "./pages/LoginPage";
import AdminLayout from "./pages/admin/AdminLayout";
import NoPage from "./pages/NoPage";
import { ButtonProvider } from "./components/buttons/buttonContext/ButtonsContext";
import { SensorProvider } from "./components/sensor/SensorContext";
import { ActionProvider } from "./components/actions/ActionsContext";
import LanguageProvider from "./components/language/LanguageContext";
import { ThemeProvider } from "./components/theme-provider";

export const host = "https://meet.wecom.com.br";

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ActionProvider>
          <AccountProvider>
            <ButtonProvider>
              <SensorProvider>
                <Routes>
                  <Route path="/" element={<RootRoute />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/admin/*" element={<AdminRoute />} />
                  <Route path="/user/*" element={<UserRoute />} />
                  <Route path="*" element={<NoPage />} />
                </Routes>
              </SensorProvider>
            </ButtonProvider>
          </AccountProvider>
        </ActionProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

function RootRoute() {
  const isLogged = localStorage.getItem("isLogged");
  return isLogged ? <Navigate to="/user" /> : <LoginPage />;
}

function AdminRoute() {
  const account = useContext(AccountContext);
  const { updateAccount } = useAccount();
  useEffect(() => {
    if (!account.isAdmin) {
      updateAccount({ isAdmin: true });
    }
  }, [account.isAdmin, updateAccount]);

  return <AdminLayout />;
}

function UserRoute() {
  const account = useContext(AccountContext);
  const { updateAccount } = useAccount();
  useEffect(() => {
    if (account.isAdmin) {
      updateAccount({ isAdmin: false });
    }
  }, [account.isAdmin, updateAccount]);

  return <UserLayout />;
}

export default App;
