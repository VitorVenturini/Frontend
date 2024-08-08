import { ButtonInterface } from "@/components/buttons/buttonContext/ButtonsContext";
import * as Icons from "lucide-react";
import React, { useState } from "react";
import {
  commonClasses

} from "../ButtonsComponent";
import { useAccount } from "@/components/account/AccountContext";
interface NumberProps {
  button: ButtonInterface;
  onClick: () => void;

}
export default function NumberButton({ button,
  onClick,
}: NumberProps) {


  let IconComponent: React.ElementType | null = null;
  if (button.img && Icons[button.img as keyof typeof Icons]) {
    IconComponent = Icons[
      button.img as keyof typeof Icons
    ] as React.ElementType;
  }
  const  account  = useAccount()
  const [statusClass, setStatusClass] = useState("bg-green-800");

  const handleClick = () => {
      onClick()  // para setar a posição na hora de criar botão
      if(!account.isAdmin){
          //wss.sendMessage({
          // api: "user" , mt: "TriggerCall" btn_id: button.id
        //})
        setStatusClass("bg-red-800")
      }
  }
  return (
    <div
      className={`${commonClasses} flex flex-col cursor-pointer ${statusClass}  `}
      onClick={handleClick}
    >

      <div className="flex items-center gap-1 cursor-pointer">
        {IconComponent && <IconComponent />}
        <p className="text-sm leading-none">{button.button_name}</p>
      </div>
      <div className="text-sm flex justify-center">
        <p>{button.button_prt}</p>
      </div>

    </div>




  );
}



