import React, { useEffect, useState, ChangeEvent, useContext } from "react";
import { Trash2 } from "lucide-react";
import { Pencil } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface User {
  id: string;
  name: string;
  guid: string;
  email: string;
  sip: string;
  // Adicione aqui outros campos se necessário
}
interface UserContextType {
  users: User[];
  // Adicione aqui outros campos se necessário
}

export default function TableUser() {
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

  const listUsers = async () => {
    try {
      const response = await fetch("https://meet.wecom.com.br/api/listUsers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-auth": localStorage.getItem("token") || "",
        },
      });
      const data: User[] = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };
  const deleteUsers = async (id: string) => {
    console.log(`id: ${id}`);
    const formData = {
      id: id,
    };
    try {
      const response = await fetch("https://meet.wecom.com.br/api/deleteUser", {
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
  useEffect(() => {
    listUsers();
  }, []);

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
  useEffect(() => {
    listUsers();
  }, []);

  return (
    <div className="pb-6">
      <Table className="pr-4">
        <TableCaption>Lista de contas.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">GUID</TableHead>
            <TableHead className="text-right">SIP</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(users) &&
            users.map((user, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="text-right">{user.guid}</TableCell>
                <TableCell className="text-right">{user.sip}</TableCell>
                <TableCell className="text-right gap-1">
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
                          This action cannot be undone. This will permanently
                          delete your account and remove your data from our
                          servers.
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
                        <Label
                          className="text-end"
                          htmlFor="framework"
                          id="type"
                        >
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
                          <Button
                            onClick={async () => {
                              await updateUsers(user.id);
                              // Atualize a lista de usuários após a atualização
                              listUsers();
                            }}
                          >
                            Atualizar
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Button variant="ghost" size="icon">
                        <Trash2 size={23} />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Voce tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Ao apertar em confirmar este usuário será deletado
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={async () => {
                            await deleteUsers(user.id);
                            // Atualize a lista de usuários após a exclusão
                            listUsers();
                          }}
                        >
                          Confirmar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
