import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const ValidadeToken = (Component: React.ComponentType) => {
  return () => {
    const navigate = useNavigate();

    useEffect(() => {
      const verifyToken = async () => {
        const token = localStorage.getItem("token");
    
        if (!token) {
          navigate('/Login');
        } else {
          const response = await fetch("https://meet.wecom.com.br/api/verifyToken", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({"token":token}),
          });
          
    
          if (!response.ok) {
            // navigate('/Login');
            console.error("Erro ao verificar token:", response.statusText);
          }
        }
      };
    
      verifyToken();
    }, []);

    return <Component />;
  };
};

export default ValidadeToken;