import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { host } from "@/App";
import { useAccount } from "../account/AccountContext";

const TokenRenewer = () => {
  const navigate = useNavigate();
  const { accessToken, expToken, isLogged, updateAccount } = useAccount();
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkTokenExpiration = () => {
      const currentTime = Math.floor(Date.now() / 1000);
      const timeToExpiration = (expToken as number) - currentTime;

      console.log("Verificando o token Atual...");
      if (timeToExpiration <= 300) {
        console.log("Token prestes a expirar, renovando...");
        renewToken();
      } else {
        console.log("Token ainda é válido.");
      }
    };

    const renewToken = async () => {
      try {
        console.log("Renovando o token...");
        const response = await fetch(`${host}/api/renewToken`, {
          method: "GET",
          headers: {
            "x-auth": accessToken,
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao renovar token");
        }

        const { accessToken: newToken } = await response.json();
        console.log("Token renovado com sucesso:", newToken);
        updateAccount({ accessToken: newToken });

        const newExpToken = await getNewExpToken(newToken);
        updateAccount({ expToken: newExpToken });
        console.log("Nova expiração do token:", newExpToken);
      } catch (error) {
        console.error("Erro ao renovar token:", error);
        navigate("/login");
      }
    };

    const getNewExpToken = async (token: string) => {
      try {
        console.log("Verificando expiração do novo token...");
        const response = await fetch(`${host}/api/verifyToken`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          throw new Error("Erro ao verificar novo token");
        }

        const data = await response.json();
        return data.exp;
      } catch (error) {
        console.error("Erro ao verificar novo token:", error);
        return expToken;
      }
    };

    checkTokenExpiration();
    timer.current = setInterval(() => {
      if (!localStorage.getItem("currentSession")) {
        console.log(
          "Usuário não está logado, interrompendo a verificação do Token."
        );
      } else {
        checkTokenExpiration();
      }
    }, 3600000); // 1 hora 3600000

    return () => {
      if (timer.current) {
        clearInterval(timer.current);
        console.log("Intervalo limpo.");
      }
    };
  }, [accessToken]);

  return null;
};

export default TokenRenewer;
