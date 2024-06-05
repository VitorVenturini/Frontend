import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState, ChangeEvent, useContext } from "react";

interface User {
  id: string;
  name: string;
  guid: string;
  email: string;
  sip: string;
  // Adicione aqui outros campos se necessário
}
interface UpdateUsersProps {
  user: User;
}
export default function UpdateUsers({ user }: UpdateUsersProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sip, setSip] = useState("");
  const [type, setType] = useState<string>("");

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSipChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSip(event.target.value);
  };

  const handleTypeChange = (value: string) => {
    setType(value);
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const updateUsers = async (id: string) => {
    console.log(
      `id: ${id}, name: ${name}, email: ${email}, sip: ${sip}, type: ${type}`
    );
    const formData = {
      id: id,
      name: name,
      email: email,
      sip: sip,
      type: type,
    };
    try {
      const response = await fetch("https://meet.wecom.com.br/api/updateUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth": localStorage.getItem("token") || "",
        },
        body: JSON.stringify(formData),
      });
      const data: User[] = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleUpdate = () => {
    updateUsers(user.id);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="ghost" size="icon">
          <Pencil size={23} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edição de Usuário</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 items-center gap-4">
          <Label className="text-end" htmlFor="name">
            Nome
          </Label>
          <Input
            className="col-span-2"
            id="name"
            placeholder="Nome"
            value={name}
            onChange={handleNameChange}
          />
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <Label className="text-end" htmlFor="name">
            Email
          </Label>
          <Input
            className="col-span-2"
            id="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <Label className="text-end" htmlFor="name">
            SIP
          </Label>
          <Input
            className="col-span-2"
            id="sip"
            placeholder="SIP"
            value={sip}
            onChange={handleSipChange}
          />
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <Label className="text-end" htmlFor="framework" id="type">
            Tipo de conta
          </Label>
          <Select value={type} onValueChange={handleTypeChange}>
            <SelectTrigger className="col-span-2" id="type">
              <SelectValue placeholder="Selecione o tipo de conta" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">Usuario</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={handleUpdate}>Atualizar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
