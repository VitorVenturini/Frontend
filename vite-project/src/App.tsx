import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
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
import { HistoryProvider } from "./components/history/HistoryContext";
import { Toaster } from "./components/ui/toaster";
import { UserProvider } from "./components/users/usersCore/UserContext";
import { ChatProvider } from "@/components/chat/ChatContext";
import { GatewayProvider } from "./components/Gateways/GatewaysContext";
import { CameraProvider } from "./components/cameras/CameraContext";
import { DataProvider } from "./Reports/DataContext";
import { UserPbxProvider } from "./components/users/usersPbx/UsersPbxContext";
import { AppConfigProvider } from "./components/options/ConfigContext";
import { CallProvider } from "./components/calls/CallContext";

import Loader from "./components/Loader";
import TokenRenewer from "./components/validateToken/TokenRenewer";

export const host =
  window.location.hostname === "localhost"
    ? "https://core.wecom.com.br"
    : `https://${window.location.hostname}`;

function App() {
  const account = useContext(AccountContext);

  useEffect(() => {
    // Função para verificar se o evento é um gesto de pinça e prevenir o zoom
    const preventPinchZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Adiciona o ouvinte de evento ao document
    document.addEventListener("touchstart", preventPinchZoom, {
      passive: false,
    });

    // Limpeza: remove o ouvinte de evento quando o componente é desmontado
    return () => {
      document.removeEventListener("touchstart", preventPinchZoom);
    };
  }, []);

  return (
    <>
      <ThemeProvider>
        <LanguageProvider>
          <ChatProvider>
            <AppConfigProvider>
              <DataProvider>
                <HistoryProvider>
                  <ActionProvider>
                    <GatewayProvider>
                      <AccountProvider>
                        <UserProvider>
                          <UserPbxProvider>
                            <ButtonProvider>
                              <CallProvider>
                                <SensorProvider>
                                  <CameraProvider>
                                    <Routes>
                                      <Route path="/" element={<RootRoute />} />
                                      <Route
                                        path="/login"
                                        element={<LoginPage />}
                                      />
                                      <Route
                                        path="/admin/*"
                                        element={<AdminRoute />}
                                      />
                                      <Route
                                        path="/user/*"
                                        element={<UserRoute />}
                                      />
                                      <Route path="*" element={<NoPage />} />
                                    </Routes>
                                    <Toaster />
                                    <TokenRenewer />
                                  </CameraProvider>
                                </SensorProvider>
                              </CallProvider>
                            </ButtonProvider>
                          </UserPbxProvider>
                        </UserProvider>
                      </AccountProvider>
                    </GatewayProvider>
                  </ActionProvider>
                </HistoryProvider>
              </DataProvider>
            </AppConfigProvider>
          </ChatProvider>
        </LanguageProvider>
      </ThemeProvider>
    </>
  );
}

function RootRoute() {
  const account = useContext(AccountContext);
  // const isLogged = localStorage.getItem("isLogged");
  return account.isLogged ? <Navigate to="/user" /> : <LoginPage />;
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
