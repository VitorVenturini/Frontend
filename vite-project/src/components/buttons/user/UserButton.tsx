import {
  ButtonInterface,
  useButtons,
} from "@/components/buttons/buttonContext/ButtonsContext";
import { User } from "lucide-react";

import { useEffect, useState } from "react";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
import { useAccount } from "@/components/account/AccountContext";
import { useUsers } from "@/components/user/UserContext";

interface ButtonProps {
  button: ButtonInterface;
  handleClick: () => void;
}

export default function UserButton({ button, handleClick }: ButtonProps) {
  const { users } = useUsers();
  const filteredUser = users.filter((user) => {
    return user.guid === button.button_prt;
  })[0];
  const [statusClass, setStatusClass] = useState("");

  useEffect(() => {
    switch (filteredUser?.status) {
      case "online":
        setStatusClass("bg-green-900");
        break;
      case "ringing":
        setStatusClass("bg-orange-500");
        break;
      case "busy":
        setStatusClass("bg-red-600");
        break;
      case "offline":
        setStatusClass("bg-neutral-900");
        break;
      default: // default sempre offline
        setStatusClass("bg-neutral-900");
    }
  }, [users]); // monitorar as alterações no contexto de usuario

  const commonClasses = `w-[128px] h-[55px] md:w-[128px] md:h-[55px]  lg:w-[128px] lg:h-[55px]  xl:w-[128px] xl:h-[70px] 2xl:w-[150px] 2xl:h-[80px] rounded-lg border bg-border text-white shadow-sm p-1 ${statusClass} `;
  return (
    <div
      className={`${commonClasses} flex flex-col cursor-pointer `}
      onClick={handleClick}
    >
      <div className="flex items-center gap-1 cursor-pointer">
        <User />
        <p className="text-sm leading-none">{button.button_name}</p>
      </div>
      <div className="text-sm flex justify-center">
        <p>{filteredUser?.name}</p>
      </div>
    </div>
  );
}
