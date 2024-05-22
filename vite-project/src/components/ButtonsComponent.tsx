import React, { useContext } from "react";
import { Plus, OctagonAlert, User, Phone, Layers3, Rss } from "lucide-react";
import { AccountContext } from "./AccountContext";
import { ButtonInterface, useButtons } from "@/components/ButtonsContext";

interface ButtonProps {
    button: ButtonInterface;
  }

  export default function ButtonsComponent({button} : ButtonProps) {
    const { isAdmin } = useContext(AccountContext);

  const commonClasses =
    "min-w-[120px] h-[55px] rounded-lg border bg-border text-card-foreground shadow-sm p-1";

  switch (button.button_type) {
      case "alarm":
        return (
          <div className={`${commonClasses} flex flex-col`}>
            <div className="flex items-center">
              <OctagonAlert />
              <p className="ml-2">{button.button_name} </p>
            </div>
            <div>
              <p>{button.button_prt}</p>
            </div>
          </div>
        );
      case "user":
        return (
          <div className={`${commonClasses} flex flex-col`}>
            <div className="flex items-center">
              <User />
              <p className="ml-2">{button.button_name} </p>
            </div>
            <div>
              <p>{button.button_prt}</p>
            </div>
          </div>
        );
      case "number":
        return (
          <div className={`${commonClasses} flex flex-col`}>
            <div className="flex items-center">
              <Phone />
              <p className="ml-2">{button.button_name} </p>
            </div>
            <div>
              <p>{button.button_prt}</p>
            </div>
          </div>
        );
      case "combo":
        return (
          <div className={`${commonClasses} flex`}>
            <div className="flex items-center">
              <Layers3 />
              <p className="ml-2">Nome </p>
            </div>
          </div>
        );
      case "sensor":
        return (
          <div className={`${commonClasses} flex flex-col`}>
            <div className="flex items-center">
              <Rss />
              <p className="ml-2">Nome </p>
            </div>
            <div>
              <p>Parâmetro</p>
            </div>
          </div>
        );
      default:
        return (
          <div className={`${commonClasses} flex items-center justify-center`}>
            {isAdmin ? <Plus /> : null}
          </div>
        );
    }
}
