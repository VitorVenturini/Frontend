import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { host } from "@/App";
import { useAccount } from "../account/AccountContext";

const ValidadeToken = (Component: React.ComponentType) => {
  return () => {
    const navigate = useNavigate();
    const account = useAccount()
    const { updateAccount } = useAccount();
    useEffect(() => {
      const verifyToken = async () => {
        const token = account.accessToken
    
        if (!token) {
          navigate('/Login');
        } else {
          const response = await fetch(`${host}/api/verifyToken`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({"token":token}),
          });
          
    
          if (!response.ok) {
            // navigate('/Login');
            console.error("Erro ao verificar token:", response.statusText);
            const currentSession = localStorage.getItem("currentSession")
            localStorage.removeItem(currentSession as string)
            localStorage.removeItem("currentSession")
            navigate('/Login') 
            return;
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