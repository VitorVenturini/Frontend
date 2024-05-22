import { Input } from "@/components/ui/input";
import * as React from "react";
import ButtonsGridPages from "@/components/ButtonsGridPages";
import LeftGrid from "@/components/LeftGrid";
import RightGrid from "@/components/RightGrid";
import { ButtonInterface, useButtons } from "@/components/ButtonsContext";
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


interface User {
  id: string;
  name: string;
  guid: string;
  // Adicione aqui outros campos se necessário
}

export default function ButtonsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // Inicialmente, o primeiro usuário é selecionado
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
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserSelect = (value: string) => {
    const user = users.find((user) => user.id === value);
    setSelectedUser(user || null);
  };

  const filteredButtons = selectedUser
    ? buttons.filter((button) => button.button_user === selectedUser.guid)
    : [];

  return (
    <div className="flex justify-center gap-3">
      <div>{<LeftGrid />}</div>

      <div className=" flex flex-col min-w-[644px] gap-2">
        <div className="flex justify-between gap-3 items-center">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Usuário:
          </h3>

          <Select onValueChange={handleUserSelect}>
            <SelectTrigger className="">
              <SelectValue placeholder="Selecione um usuário" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Usuários</SelectLabel>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button>Tabela</Button>
        </div>

        {/* Renderize as informações do usuário selecionado aqui */}
        {selectedUser && (
          <div>
            {<ButtonsGridPages buttons={filteredButtons} />}
          </div>
        )}
      </div>
      <div>
        <RightGrid />
      </div>
    </div>
  );
}
