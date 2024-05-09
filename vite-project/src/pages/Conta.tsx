import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import React, { useState, ChangeEvent } from "react";
import { Value } from "@radix-ui/react-select";

export default function Conta() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sip, setSip] = useState("");
  const [type, setType] = useState<string>("");
  const [name, setName] = useState("");

  const { toast } = useToast();

  const passwordValidation = (password: string) => {
    // Verifica se a senha tem pelo menos 6 caracteres
    if (password.length < 6) {
      toast({
        variant: "destructive",
        description: "A senha deve ter pelo menos 6 caracteres",
      });
      return false;
    }

    // Verifica se a senha contém pelo menos um caractere especial
    const specialCharacterRegex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (!specialCharacterRegex.test(password)) {
      toast({
        variant: "destructive",
        description: "A senha deve conter pelo menos um caractere especial",
      });
      return false;
    }

    return true;
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
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
  const handleCreateUser = async () => {
    console.log(
      `Nome: ${name},Email: ${email}, Senha: ${password}, SIP: ${sip}, Tipo de conta: ${type}`
    );
    if (!passwordValidation(password)) {
      toast({
        variant: "destructive",
        description: "Senha inválida",
      });
      return;
    }
    const obj = {
      email: email,
      password: password,
      name: name,
      sip: sip,
      type: type,
    };

    try {
      const response = await fetch("http://10.10.51.176:8000/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth": localStorage.getItem("token") || "",
        },
        body: JSON.stringify(obj),
      });

      const data = await response.json();

      if (!response.ok) {
        // Se o servidor retornar um código de status que não está no intervalo 200-299,
        // então nós lançamos um erro
        if (data.error === "emailDuplicated") {
          // Se a mensagem de erro for 'Email already exists', então exibimos um toast específico
          toast({
            variant: "destructive",
            description: "Email já está em uso",
          });
        } else {
          // Se a mensagem de erro for diferente, então exibimos um toast genérico
          toast({
            variant: "destructive",
            description: data.error,
          });
        }
        throw new Error(data.error);
      } else {
        console.log(data);
        // Exibe um toast de sucesso
        toast({
          description: "Conta criada com sucesso",
        });
      }
    } catch (error) {
      // Aqui você pode lidar com qualquer erro que possa ocorrer durante a criação da conta
      console.error("Erro na criação da conta:", error);
    }
  };
  const listUsers = async () => {
    try {
      const response = await fetch("http://10.10.51.176:8000/api/listUsers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-auth": localStorage.getItem("token") || "",
        },
      });
      console.log(await response.json());
    } catch (error) {}
  }
  return (
    <div className="lg:px-[20rem] md:px-[15rem] sm:px-9 px-2 flex justify-center">
      <Card className="xl:w-[500px]">
        <CardHeader>
          <CardTitle>Criação de conta</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 py-4">
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
              Senha
            </Label>
            <Input
              className="col-span-2"
              id="password"
              placeholder="Senha"
              value={password}
              onChange={handlePasswordChange}
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
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleCreateUser}>Criar conta</Button>
          <Button onClick={listUsers}>Listar contas</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
