import { Input } from "@/components/ui/input";
import * as React from "react";
import ButtonsGridPages from "@/components/buttons/buttonsGrid/ButtonsGridPages";

import InteractiveGridCopy from "@/components/optBar/InteractiveGridCopy";
import {
  ButtonInterface,
  useButtons,
} from "@/components/buttons/buttonContext/ButtonsContext";
import { PlusSquare, SquarePlus } from "lucide-react";
import { ArrowBigUpDash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useAccount } from "@/components/account/AccountContext";
import texts from "@/_data/texts.json";
import { useLanguage } from "@/components/language/LanguageContext";
import { host } from "@/App";
import { UserInterface, useUsers } from "@/components/users/usersCore/UserContext";


interface ButtonsPageProp {
  buttons: ButtonInterface[];
}

export default function ButtonsPage() {
  const {users} = useUsers()
  const [selectedUser, setSelectedUser] = useState<UserInterface | null>(null); // Inicialmente, o primeiro usuário é selecionado
  const [selectedOptTop, setSelectedOptTop] = useState<string>("floor"); // default for top
  const [selectedOptBottom, setSelectedOptBottom] = useState<string>("floor"); // default for bottom

  const account = useAccount();
  const { language } = useLanguage();
  const { buttons } = useButtons();

  const handleUserSelect = (value: string) => {
    const user = users.find((user) => String(user.id) === value);
   setSelectedUser(user || null);
  };

  const handleOptChangeTop = (newOpt: string) => {
    setSelectedOptTop(newOpt);
  };

  const handleOptChangeBottom = (newOpt: string) => {
    setSelectedOptBottom(newOpt);
  };

  //console.log("Botões recebidos em ButtonsPage:" + JSON.stringify(buttons));
  const filteredButtons = selectedUser
    ? buttons.filter((button) => button.button_user === selectedUser.guid)
    : [];

  return (
    <div className="flex flex-col justify-center gap-3">
      <div className="flex justify-center gap-3 items-center">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          {texts[language].headerUser}:
        </h3>

        <Select onValueChange={handleUserSelect}>
          <SelectTrigger className=" lg:w-[500px] xl:w-[600px] xl2:w-[700px] xl3:w-[800px] xl4:w-[900px]">
            <SelectValue placeholder={texts[language].selectUserPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{texts[language].users}</SelectLabel>
              {users.map((user) => (
                <SelectItem key={user.id} value={String(user.id)}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        
      </div>
      {!selectedUser ? (
        <div className="flex flex-col justify-center items-center gap-5 mt-5 ">
          <div className="flex align-middle items-center gap-8">
            <ArrowBigUpDash size={30} className="animate-bounce" />
            {texts[language].chooseUser}
            <ArrowBigUpDash size={30} className="animate-bounce" />
          </div>
        </div>
      ) : (
        <div></div>
      )}
      <div className="flex item justify-center gap-1">
        {selectedUser && (
          <div>
            {/* DE CIMA  */}
            <InteractiveGridCopy
              interactive="top"
              onKeyChange={handleOptChangeTop}
              buttons={filteredButtons}
              selectedUser={selectedUser}
              selectedOpt={selectedOptTop}
            />
            {/* DE BAIXO  */}
            <InteractiveGridCopy
              interactive="bottom"
              onKeyChange={handleOptChangeBottom}
              buttons={filteredButtons}
              selectedUser={selectedUser}
              selectedOpt={selectedOptBottom}
            />
          </div>
        )}
        <div className=" flex flex-col min-w-[644px] gap-2">
          {/* Renderize as informações do usuário selecionado aqui */}
          {selectedUser && (
            <div>
              {
                <ButtonsGridPages
                  buttonsGrid={filteredButtons}
                  selectedUser={selectedUser}
                  //onOptChange={handleOptChange}
                />
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
