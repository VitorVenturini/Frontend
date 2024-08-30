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
import React, { useState, ChangeEvent, useContext, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { useAccount } from "@/components/account/AccountContext";

import { Navigate } from "react-router-dom";

import texts from "@/_data/texts.json";
import { useLanguage } from "@/components/language/LanguageContext";

import { Loader2 } from "lucide-react";
//import { useWebSocketData } from './WebSocketProvider';// Importe o useWebSocketData

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

("use client");

import { useToast } from "@/components/ui/use-toast";
import { set } from "date-fns";
import { host } from "@/App";

const enterFullScreen = () => {
  const elem = document.documentElement;

  if (elem.requestFullscreen) {
    elem.requestFullscreen().catch((err) => {
      console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
    });
  }
};

export default function CardLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { updateAccount } = useAccount();
  const navigate = useNavigate();
  const account = useAccount();
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const disconnected = localStorage.getItem("disconnected");
  //const ws = useWebSocketData();
  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  const handleNewPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(event.target.value);
  };

  const handleLogin = async () => {
    setIsLoading(true);
    const hash = await bcrypt.hash(password, 15);

    const formData = {
      email: email,
      password: btoa(password),
    };

    try {
      const response = await fetch(host + "/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      //{"error":"incorrectPassword"}
      // emailNotFound
      if (response.ok) {
        const appLanguage = localStorage.getItem("app-language");
        localStorage.clear();
        localStorage.setItem("app-language", appLanguage as string);

        const data = await response.json();
        const accountData = { ...data };
        updateAccount(accountData);

        toast({ description: "Login efetuado com sucesso." });

        updateAccount({ isLogged: true });
        console.log({ ...account, updateAccount: undefined });
        console.log("Login efetuado com sucesso");
        
        setIsLoading(false);

        // Sempre navega para a tela de usuário após o login bem-sucedido
        navigate("/user");
        
      } else {
        const data = await response.json();
        switch (data.error) {
          case "emailNotFound":
            console.log("ERRO E-MAIL");
            toast({ description: "E-mail não localizado" });
            break;
          case "invalidPassword":
            console.error("Erro: Senha inválida.");
            toast({ description: "Senha inválida" });
            break;
          case "incorrectPassword":
            console.error("Erro: Senha inválida.");
            toast({ description: "Senha inválida" });
            break;
          case "rejected":
            console.error("Erro: Rejeitado.");
            toast({ description: "Revise suas credenciais" });
            break;
          case "SequelizeConnectionRefusedError":
            console.error("Erro: Backend.");
            toast({ description: "Contate o adm de Redes" });
            break;
          case "duplicatedLogin":
            setOpen(true);
            //abrir o modal que mostra a mensagem de sessão duplicada
            break;
          default:
            console.error(
              "Erro ao enviar dados para o backend:",
              response.json(),
              response.statusText
            );
            toast({
              description: "Erro ao fazer login.",
            });
            break;
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Erro:", error);
    }

    setIsLoading(false);
  };
  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Previne o comportamento padrão do formulário

    console.log("Form submitted"); // Debug log

    handleLogin(); // Chama a função de login

    enterFullScreen(); // Chama a função de tela cheia
    
  };
  const handleCloseAlertDialog = () => {
    setOpen(false);
    localStorage.removeItem("disconnected");
  };
  useEffect(() => {
    if (disconnected && disconnected?.length > 0) {
      setOpen(true);
    }
  }, [disconnected]);

  return (
    <div>
      <Card className="xl:w-[600px] lg:w-[500px] md:[400px] sm:w-[300px] h-fit">
        <form onSubmit={handleFormSubmit}>
          <CardHeader>
            <CardTitle>
              <div>
                <div className="flex justify-between">
                  {texts[language].login}
                </div>
              </div>
            </CardTitle>
            <CardDescription>
              {texts[language].enterEmail} e {texts[language].enterPassword}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 py-9">
            <div className="grid w-full items-center gap-6">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="email" className="text-end">
                  {texts[language].enterEmail}
                </Label>
                <Input
                  id="email"
                  type="email"
                  className="col-span-2"
                  placeholder={texts[language].enterEmail}
                  value={email}
                  required
                  onChange={handleEmailChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="password" className="text-end">
                    {texts[language].enterPassword}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    className="col-span-2"
                    placeholder={texts[language].enterPassword}
                    value={password}
                    onChange={handlePasswordChange}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end my-4">
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
          </CardFooter>
        </form>
      </Card>

      {/* coloquei o card de login duplicado aqui , ele so vai ficar visivel quando o cara tentar 
      logar e chegar o error duplicatedLogin
      */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {disconnected && disconnected?.length > 0
                ? "Você foi desconectado"
                : "Login Duplicado"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {disconnected && disconnected?.length > 0 ? (
                <div className="flex gap-1">
                  Você foi desconectado por
                  <p className="capitalize"> {disconnected}</p>
                </div>
              ) : (
                "Você já está conectado em outra sessão. Por favor, encerre a sessão anterior para poder realizar o login nesta."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => handleCloseAlertDialog()}>
              Entendido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
