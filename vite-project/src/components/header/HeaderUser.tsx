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
import LogoWecom2 from "@/assets/LogoWecom2.svg";
import { ModeToggle } from "@/components/mode-toggle";
import { LanguageToggle } from "@/components/language/LanguageToggle";
import CoreToast from "@/components/CoreToast";
import Loader2 from "../Loader2";
import useWebSocket from "@/components/websocket/useWebSocket";


export default function HeaderUser() {
  const account = useAccount();
  const [isLoading, setIsLoading] = useState(true);
  const { updateAccount } = useAccount();
  const navigate = useNavigate();
  const { isReconnecting } = useWebSocket(account.accessToken);

  const handleAdminToggle = () => {
    updateAccount({ isAdmin: true });
    console.log("IsAdmin tem que ir para true " + account.isAdmin);
    navigate("/admin/buttons"); // Redireciona para a rota admin/buttons
  };

  return (
    <div className="relative w-full py-1">
      <div className="flex gap-5 align-middle justify-between items-center ">
        <div className="flex align-middle items-center justify-between gap-24 basis-1/4">
          <div className="flex align-middle items-center gap-2">
            {isReconnecting && <Loader2/>}
            <Button
              variant="ghost"
              onClick={account.type === "admin" ? handleAdminToggle : undefined}
            >
              <img src={LogoCore} className="h-8" />
            </Button>
            <FullScreenButton />
            <LanguageToggle />
            {/* <ModeToggle /> */}
            <Logout />
          </div>
        </div>
        <div className="basis-1/2">
        <CoreToast />
        </div>
        <img src={LogoWecom2} className="h-4 opacity-30" />
        <Button className="flex justify-center basis-1/8" variant="secondary">
          <DigitalClock />
        </Button>
      </div>
    </div>
  );
}
