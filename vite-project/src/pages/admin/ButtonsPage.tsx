import { Input } from "@/components/ui/input";
import * as React from "react";
import ButtonsGridPages from "@/components/buttons/buttonsGrid/ButtonsGridPages";
import LeftGrid from "@/components/leftGrid/LeftGrid";
import RightGrid from "@/components/rightGrid/RightGrid";
import { ButtonInterface, useButtons } from "@/components/buttons/buttonContext/ButtonsContext";
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

interface User {
  id: string;
  name: string;
  guid: string;
  // Adicione aqui outros campos se necessário
}

interface ButtonsPageProp {
  buttons: ButtonInterface[];
}

export default function ButtonsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // Inicialmente, o primeiro usuário é selecionado
  const [selectedOpt, setSelectedOpt] = useState<string>("floor");
  const account = useAccount();
  const { language } = useLanguage();
  // const { data: websocketData, sendMessage } = useWebSocket(
  //   account.accessToken
  // );
  const { buttons } = useButtons();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://meet.wecom.com.br/api/listUsers",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-auth": localStorage.getItem("token") || "",
            },
          }
        );
        const data = await response.json();
        setUsers(data);
        // console.log("ALL USERS" + JSON.stringify(data))
        // sendMessage({
        //   api: account.isAdmin ? "admin" : "user",
        //   mt: "SelectMessage",
        // });
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  // Exemplo de uso do sendMessage para enviar uma mensagem ao carregar a página

  const handleUserSelect = (value: string) => {
    const user = users.find((user) => user.id === value);
    setSelectedUser(user || null);
  };
  
  const handleOptChange = (newOpt: string) => {
    setSelectedOpt(newOpt);
  };

  //console.log("Botões recebidos em ButtonsPage:" + JSON.stringify(buttons));
  const filteredButtons = selectedUser
    ? buttons.filter((button) => button.button_user === selectedUser.guid)
    : [];

  return (
<div className="flex justify-center gap-3">
  <div>
    {<LeftGrid buttons={filteredButtons} selectedUser={selectedUser} />}
  </div>
  <div className=" flex flex-col min-w-[644px] gap-2">
    <div className="flex justify-between gap-3 items-center">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        {texts[language].headerUser}:
      </h3>

      <Select onValueChange={handleUserSelect}>
        <SelectTrigger className="">
          <SelectValue placeholder={texts[language].selectUserPlaceholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{texts[language].users}</SelectLabel>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button>{texts[language].table}</Button>
    </div>
    {!selectedUser ? (
      <div className="flex flex-col justify-center items-center gap-5 mt-5">
        <div className="flex align-middle items-center gap-8">
          <ArrowBigUpDash size={30} className="animate-bounce" />
          {texts[language].chooseUser}
          <ArrowBigUpDash size={30} className="animate-bounce" />
        </div>
          </div>
        ) : (
          <div></div>
        )}

        {/* Renderize as informações do usuário selecionado aqui */}
        {selectedUser && (
          
          <div>
            {
              <ButtonsGridPages
                buttons={filteredButtons}
                selectedUser={selectedUser}
                onOptChange={handleOptChange}
              />
            }
          </div>
        )}
      </div>
      <div>
        <RightGrid
        onKeyChange={handleOptChange}
          buttons={filteredButtons}
          selectedUser={selectedUser}
          selectedOpt={selectedOpt}
        />
      </div>
    </div>
  );
}
