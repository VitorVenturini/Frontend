import React, { useState, useEffect } from "react";
import { useAccount } from "./account/AccountContext";
import { host } from "@/App";



interface LogomarcaProps {
  className?: string;
}

const Logomarca: React.FC<LogomarcaProps> = ({ className }) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const account = useAccount();

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await fetch(`${host}/api/uploads/logomarca.png`, {
          headers: {
            "x-auth": account.accessToken || "",
          },
        });
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setLogoUrl(url);
        } else {
          console.error("Erro ao buscar a imagem");
        }
      } catch (error) {
        console.error("Erro ao buscar a imagem", error);
      }
    };

    fetchLogo();
  }, [account.accessToken, host]);

  return logoUrl ? <img src={logoUrl} alt="Logo" className={` h-full ${className}`} /> : null;
};

export default Logomarca;