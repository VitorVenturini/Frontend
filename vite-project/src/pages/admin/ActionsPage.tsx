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
  import { Label } from "@/components/ui/label";
  import { Input } from "@/components/ui/input";
  import { Button } from "@/components/ui/button";
  import { Loader2 } from "lucide-react";
  import { Ghost } from "lucide-react";
  import { ChangeEvent, useState, useEffect } from "react";
  import { useToast } from "@/components/ui/use-toast";
  import TableActions from "@/components/TableActions";

 interface User {
    id: string;
    name: string;
  }

export default function ActionsPage(){
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
      },[]);
    
      const handleUserSelect = (value: string) => {
        const user = users.find((user) => user.id === value);
        setSelectedUser(user || null);
      };

      // implementar lógica do backend para consultar ações do usuário
  return (
   <div className="bg-card">
     <div className="flex items-center justify-center gap-6">
          <h2>Ações</h2>
          <Select onValueChange={handleUserSelect}>
            <SelectTrigger className="w-[500px]">
              <SelectValue placeholder="Selecione seu usuário" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Selecione seu usuário</SelectLabel>
                {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                        {user.name}
                    </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button>Criar Ação</Button>
        </div>
        <div>
        <TableActions selectedUser={selectedUser}></TableActions>
        </div>
   </div>
  );
}