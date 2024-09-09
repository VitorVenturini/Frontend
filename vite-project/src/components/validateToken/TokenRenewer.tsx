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

      if(!localStorage.getItem("currentSession")){
          return;
      }
      const currentTime = Math.floor(Date.now() / 1000); // Tempo atual em segundos
      const timeToExpiration = (expToken as number) - currentTime; // Tempo restante até expiração em segundos

      console.log("Verificando o token Atual...");
      // Se faltar 1 hora (3600 segundos) ou menos, renova o token
      if (timeToExpiration <= 3600 && timeToExpiration > 0) {
        console.log("Token prestes a expirar, renovando...");
        renewToken();
      } else if (timeToExpiration <= 0 && isLogged) {
        console.log("Token já está expirado, renovando...");
        renewToken();
      } else {
        console.log(`Token válido, falta ${timeToExpiration} segundos para expirar.`);
        const timeUntilOneHourBeforeExpiration = timeToExpiration - 3600;
        if (timer.current) clearTimeout(timer.current); // Limpa o timeout anterior, se existir
        timer.current = setTimeout(() => {
          console.log("1 hora antes da expiração, renovando token...");
          renewToken();
        }, timeUntilOneHourBeforeExpiration * 1000); // Converte segundos em milissegundos
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

        // Após renovar o token, reinicia a verificação
        checkTokenExpiration();
      } catch (error) {
        console.error("Erro ao renovar token:", error);
        navigate("/login");
      }
    };

    const getNewExpToken = async (token: string) => {
      try {
        console.log("Validando o novo token...");
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

    // Verifica imediatamente ao montar o componente
    //checkTokenExpiration();
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        console.log("Timeout limpo.");
      }
    };
  }, [accessToken, expToken, navigate, updateAccount]);

  return null;
};

export default TokenRenewer;
