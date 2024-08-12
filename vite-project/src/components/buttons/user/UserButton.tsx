import {
  ButtonInterface,
  useButtons,
} from "@/components/buttons/buttonContext/ButtonsContext";
import { User } from "lucide-react";

import { useEffect, useState } from "react";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
import { useAccount } from "@/components/account/AccountContext";
import { useUsers } from "@/components/users/usersCore/UserContext"
import { commonClasses } from "../ButtonsComponent";

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

  return (
    <div
      className={`${commonClasses} flex flex-col cursor-pointer ${statusClass} `}
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
