import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState, ChangeEvent } from "react";

import { useTheme } from "@/components/theme-provider";

import imgagemEscolhida from "../assets/10991348.jpg";

import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";

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

const ImageComponent = (): JSX.Element => <img src={imgagemEscolhida} />;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const { toast } = useToast();

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  const handleNewPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(event.target.value);
  };
  const handleUpdatePassword = async () => {
    console.log(
      `Email: ${email}, Senha: ${password}, Nova Senha: ${newPassword}`
    );
    // Aqui você pode adicionar a lógica para fazer o fetch com o email e a senha
    const formData = {
      email: email,
      password: password,
      newPassword: newPassword,
    };
    try {
      // Envia os dados para o backend via método POST
      const response = await fetch(
        "https://meet.wecom.com.br/api/updatePassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      // Verifica se a requisição foi bem-sucedida
      if (response.ok) {
        // Extrai e exibe a resposta do backend na console
        const data = await response.text();
        console.log("Resposta do backend:", data);

        // Redireciona para teste.html após a resposta ok
        toast({
          description: "Sua senha foi alterada com sucesso.",
        });
      } else {
        console.error(
          "Erro ao enviar dados para o backend:",
          response.statusText
        );
        // window.alert(response.statusText)
        const data = await response.text();
        toast({
          variant: "destructive",
          title: data,
        });
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };
  const { setTheme } = useTheme();

  const handleLogin = async () => {
    console.log(`Email: ${email}, Senha: ${password}`);

    const formData = {
      email: email,
      password: password,
    };

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
        // Extrai e exibe a resposta do backend na console
        const data = await response.json();
        console.log("Resposta do backend:", data);

        // Armazena o token no localStorage
        localStorage.setItem("token", data.accessToken);

        // Redireciona para teste.html após a resposta ok
        window.location.href = "/Home";
      } else {
        console.error(
          "Erro ao enviar dados para o backend:",
          response.statusText
        );
        toast({
          description: "Erro ao fazer login.",
        });
        window.alert(response.statusText);
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };
  return (
    <div
      className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]"
      onLoad={() => setTheme("dark")}
    >
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <Card className="xl:w-[600px] lg:w-[500px] md:[400px] sm:w-[300px] w-full">
            <CardHeader>
              <CardTitle>
                <div className="flex justify-between">
                  Faça seu Login
                  <ThemeProvider>
                    <ModeToggle />
                  </ThemeProvider>
                </div>
              </CardTitle>
              <CardDescription>Digite seu Email e Senha</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 py-4">
              <form>
                <div className="grid w-full items-center gap-4">
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
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
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
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                        id="newPassword"
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="submit" onClick={handleUpdatePassword}>
                        Mudar senha
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button onClick={handleLogin}>Login</Button>
            </CardFooter>
          </Card>
          <Tabs defaultValue="account" className="xl:w-[600px] lg:w-[500px] md:[400px] sm:w-[300px] w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account">Faça seu Login</TabsTrigger>
              <TabsTrigger value="password">Mude  sua senha</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Faça seu Login</CardTitle>
                  <CardDescription>
                  Digite seu Email e Senha
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                <form>
                <div className="grid w-full items-center gap-4">
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
              </form>
                </CardContent>
                <CardFooter>
                  <Button>Save changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Mude sua senha</CardTitle>
                  <CardDescription>
                    Escreva seu email, senha atual e a nova senha e clique em mudar senha para salvar sua senha nova.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email
                      </Label>
                      <Input
                        id="email"
                        placeholder="Email"
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
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                        id="newPassword"
                        className="col-span-3"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save password</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <ImageComponent />
    </div>
  );
}
