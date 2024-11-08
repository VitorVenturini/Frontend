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
import ReportLayout from "./pages/report/ReportLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Loader from "./components/Loader";
import TokenRenewer from "./components/validateToken/TokenRenewer";
import CardResetPassword from "./components/resetPassword/CardResetPassword";

const host_name_api = String(import.meta.env.VITE_API_HOSTNAME);
const host_port_api = String(import.meta.env.VITE_API_PORT);
let host: string;

if (window.location.hostname === "localhost") {
  host = `https://${host_name_api}:${host_port_api}`;
} else if (window.location.hostname === "frontend-delta-lake.vercel.app") {
  host = `https://${host_name_api}:${host_port_api}`;
} else {
  host = `https://${host_name_api}:${host_port_api}`;
}

export { host };
const queryClient = new QueryClient();

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
    <QueryClientProvider client={queryClient}>
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
                                        <Route
                                          path="/"
                                          element={<RootRoute />}
                                        />
                                        <Route
                                          path="/login"
                                          element={<RootRoute />}
                                        />
                                        <Route
                                          path="/reset-password/*"
                                          element={<CardResetPassword />}
                                        />
                                        <Route
                                          path="/reports/*"
                                          element={<ReportRoute />}
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
    </QueryClientProvider>
  );
}

function RootRoute() {
  const account = useContext(AccountContext);
  // const isLogged = localStorage.getItem("isLogged");
  if (account.isLogged) {
    if (account.type === "admin") {
      return <Navigate to="/admin/buttons" />;
    } else if (account.type === "reports") {
      return <Navigate to="/reports" />;
    } else {
      return <Navigate to="/user" />;
    }
  } else {
    const currentSession = localStorage.getItem("currentSession");
    localStorage.removeItem(currentSession as string);
    localStorage.removeItem("currentSession");
    return <LoginPage />;
  }
}

function AdminRoute() {
  const account = useContext(AccountContext);
  const { updateAccount } = useAccount();

  useEffect(() => {
    if (!account.isAdmin && account.type === "admin") {
      updateAccount({ isAdmin: true });
    }
  }, [account.isAdmin, updateAccount]);

  if (!account.isLogged) {
    const currentSession = localStorage.getItem("currentSession");
    localStorage.removeItem(currentSession as string);
    localStorage.removeItem("currentSession");
    return <Navigate to="/Login" />;
  } else {
    if (account.type !== "admin") {
      if (account.type === "user") {
        return <Navigate to="/user" />;
      } else if (account.type === "reports") {
        return <Navigate to="/reports" />;
      }
    }
  }

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

  if (!account.isLogged) {
    const currentSession = localStorage.getItem("currentSession");
    localStorage.removeItem(currentSession as string);
    localStorage.removeItem("currentSession");
    return <Navigate to="/Login" />;
  } else {
    if (account.type !== "user" && account.type !== "admin") {
      return <Navigate to="/reports" />;
    }
  }

  return <UserLayout />;
}

function ReportRoute() {
  const account = useContext(AccountContext);
  const { updateAccount } = useAccount();

  useEffect(() => {
    if (!account.isAdmin) {
      updateAccount({ isAdmin: true });
    }
  }, [account.isAdmin, updateAccount]);

  if (!account.isLogged) {
    const currentSession = localStorage.getItem("currentSession");
    localStorage.removeItem(currentSession as string);
    localStorage.removeItem("currentSession");
    return <Navigate to="/Login" />;
  } else {
    if (account.type !== "reports" && account.type !== "admin") {
      return <Navigate to="/user" />;
    }
  }

  return <ReportLayout />;
}

export default App;
