import { Routes, Route, useNavigate } from "react-router-dom";
import { ReactElement, useContext, useState } from "react";
import {
  AccountContext,
  useAccount,
} from "@/components/account/AccountContext";
import { Button } from "@/components/ui/button";
import Logout from "@/components/logout/Logout";
import { FullScreenButton } from "@/components/FullScreanButton";
import LogoCore from "@/assets/LogoCore.svg";
import DigitalClock from "../digitalClock";

export default function HeaderUser() {
  const account = useAccount();
  const [isLoading, setIsLoading] = useState(true);
  const { updateAccount } = useAccount();
  const navigate = useNavigate();

  const handleAdminToggle = () => {
    updateAccount({ isAdmin: true });
    console.log("IsAdmin tem que ir para true " + account.isAdmin);
    navigate("/admin/buttons"); // Redireciona para a rota admin/buttons
  };

  return (
    <div className="relative w-full">
      <div className="flex gap-5 justify-between">
      
        <div className="gap-5 flex  align-middle items-center ">
        {account.type === "admin" && (
          <Button variant="ghost" onClick={handleAdminToggle}>
            {" "}
            <img src={LogoCore} alt="Logo" className="h-8" />
          </Button>
        )}
        <FullScreenButton />
          <Logout />
          
        </div>
        <DigitalClock />
      </div>
    </div>
  );
}
