import { Input } from "@/components/ui/input";
import * as React from "react";
import ButtonsGrid from "@/components/ButtonsGrid";
import LesftGrid from "@/components/LeftGrid";
import RightGrid from "@/components/RightGrid";

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
  // Adicione aqui outros campos se necessário
}

export default function Buttons() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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

  return (
    <div className="flex gap-7">
      <div className="w-[100vh] h-[100vh] bg-card">
      <LesftGrid user={selectedUser}/>
      </div>
      
      <div className="w-[100vh] h-[100vh] bg-card">
        <Select onValueChange={handleUserSelect}>
          <SelectTrigger className="w-[180px]">
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

        {/* Renderize as informações do usuário selecionado aqui */}
        {selectedUser && (
          <div>
            <h2>{selectedUser.name}</h2>
            <ButtonsGrid user={selectedUser}/>
            
          </div>
        )}
        
      </div>
      <div className="w-[100vh] h-[100vh] bg-card">
        <RightGrid user={selectedUser}/>
      </div>
    </div>
  );
}
