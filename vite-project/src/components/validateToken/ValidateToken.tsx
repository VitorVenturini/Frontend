import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { host } from "@/App";
import { useAccount } from "../account/AccountContext";
import { useWebSocketData } from "../websocket/WebSocketProvider";

const ValidadeToken = (Component: React.ComponentType) => {
  return () => {
    const navigate = useNavigate();
    const account = useAccount();
    const { updateAccount } = useAccount();
    const ws = useWebSocketData();
    useEffect(() => {
      const verifyToken = async () => {
        const token = account.accessToken;

        if (!token) {
          navigate("/Login");
        } else {
          const response = await fetch(`${host}/api/verifyToken`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: token }),
          });

          if (!response.ok) {
            console.error("Token Inválido")
            updateAccount({...account , isLogged: false})
          }

          const data = await response.json();
          updateAccount({ expToken: data.exp });
        }
      };

      verifyToken();
    }, []);

    return <Component />;
  };
};

export default ValidadeToken;
