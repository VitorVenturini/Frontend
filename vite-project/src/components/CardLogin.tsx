import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import bcrypt from "bcryptjs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState, ChangeEvent, useContext } from "react";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { useAccount } from "./AccountContext";

import Logout from "@/components/Logout";
import { Navigate } from "react-router-dom";

import { Loader2 } from "lucide-react";
import { useWebSocketData } from './WebSocketProvider';// Importe o useWebSocketData


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
("use client");

import { useToast } from "@/components/ui/use-toast";

export default function CardLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { updateAccount } = useAccount();
  const navigate = useNavigate();
  const account = useAccount();
  const ws = useWebSocketData();
  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("isAdmin") === "true"
  );

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  const handleNewPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(event.target.value);
  };
  const handleSwitchChange = () => {
    const newIsAdmin = !isAdmin;
    setIsAdmin(newIsAdmin);
    updateAccount({ isAdmin: newIsAdmin });
    console.log("isAdmin setado para " + newIsAdmin);
  };

  const handleLogin = async () => {
    // Inicia o estado de carregamento
    setIsLoading(true);

    // emcripta a senha
    await bcrypt.hash(password, 15);

    // cria um objeto com os dados do formulário
    const formData = {
      email: email,
      password: password,
    };

    // Tenta enviar os dados para o backend

    try {
      //Envia os dados para o backend via método POST
      const response = await fetch("https://meet.wecom.com.br/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Verifica se a requisição foi bem-sucedida

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.accessToken);
        console.log("Token de acesso para o local storage:", data.accessToken);

        if (isAdmin && data.type !== "admin") {
          console.log("Acesso negado: o usuário não é um administrador.");

          toast({
            variant: "destructive",
            description: "Acesso negado: o usuário não é um administrador.",
          });

          setIsLoading(false);
          return;
        }
        console.log("isAdmin setado para " + isAdmin);

        console.log("infos do backend: " + JSON.stringify(data));

         // Transforme os dados recebidos para que eles correspondam à estrutura do estado da conta
        const accountData = {...data,};

        // Atualize o AccountContext com os dados recebidos
    

        updateAccount(accountData)

        // verificar se vai para tela de admin ou user
        if (isAdmin) {
          navigate("/admin/buttons");
        } else {
          navigate("/user");
        }
      } else {
        console.error(
          "Erro ao enviar dados para o backend:",
          response.statusText
        );
        toast({
          description: "Erro ao fazer login.",
        });
      }
    } catch (error) {
      console.error("Erro:", error);
    }

    localStorage.setItem("isLogged", "true");

    console.log();

    updateAccount({ isLogged: true });
    console.log({ ...account, updateAccount: undefined });

    console.log("isLogged setado para true" + localStorage.getItem("isLogged"));

    console.log("Login efetuado com sucesso");

    toast({ description: "Login efetuado com sucesso." });

    console.log(
      `isAdmin: ${isAdmin}, isLogged: ${localStorage.getItem(
        "isLogged"
      )},guid: ${localStorage.getItem("guid")}, token: ${localStorage.getItem(
        "token"
      )}  `
    );
    

    setIsLoading(false);
  };
  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Previne o comportamento padrão do formulário
    console.log("Form submitted"); // Debug log

    handleLogin(); // Chama a função de login
  };

  return (
    <Card className="xl:w-[600px] lg:w-[500px] md:[400px] sm:w-[300px] h-fit ">
      <form onSubmit={handleFormSubmit}>
        <CardHeader>
          <CardTitle>
            <div>
              <div className="flex justify-between">
                Faça seu Login
                <div className="flex items-center space-x-2">
                  <Label htmlFor="airplane-mode">Admin</Label>
                  <Switch onCheckedChange={handleSwitchChange} id="admin" />
                </div>
              </div>
            </div>
          </CardTitle>
          <CardDescription>Digite seu Email e Senha</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 py-9">
          <div className="grid w-full items-center gap-6">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="email" className="text-end">
                Digite seu Email
              </Label>
              <Input
                id="email"
                type="email"
                className="col-span-2"
                placeholder="Email"
                value={email}
                required
                onChange={handleEmailChange}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="password" className="text-end">
                  Digite sua Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  className="col-span-2"
                  placeholder="Senha"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between my-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Mudar Senha</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Mude sua Senha</DialogTitle>
                <DialogDescription>
                  Digite seu email sua senha atual e a nova senha.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Senha
                  </Label>
                  <Input
                    id="password"
                    placeholder="Senha"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="newPassword" className="text-right">
                    Nova Senha
                  </Label>
                  <Input
                    id="newPassword"
                    placeholder="Nova Senha"
                    type="password"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    className="col-span-3"
                  />
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="submit">Mudar senha</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Login
              </>
            ) : (
              "Login"
            )}
          </Button>
          <Logout />
        </CardFooter>
      </form>
    </Card>
  );
}
