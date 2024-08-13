import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useState, ChangeEvent } from "react";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import texts from "../../_data/texts.json";
import { useLanguage } from "@/components/language/LanguageContext";
import { UserInterface, useUsers } from "../users/usersCore/UserContext";
import { host } from "@/App";
import {
  useWebSocketData,
  WebSocketProvider,
} from "../websocket/WebSocketProvider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUsersPbx } from "../users/usersPbx/UsersPbxContext";
import { UserPbxInterface } from "../users/usersPbx/UsersPbxContext";
import { Toggle } from "@/components/ui/toggle";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { IN } from "country-flag-icons/react/3x2";
interface CreateAccountProps {
  user?: UserInterface;
  isUpdate?: boolean;
  onSuccess?: () => void;
}

export default function CardCreateAccount({
  user,
  isUpdate,
  onSuccess,
}: CreateAccountProps) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState(user?.password || "");
  const [sip, setSip] = useState(user?.sip || "");
  const [type, setType] = useState<string>(user?.type || "");
  const [isCreating, setIsCreating] = useState(false);
  const { usersPbx } = useUsersPbx();
  const [searchTerm, setSearchTerm] = useState("");
  const [e164, setE164] = useState(user?.sip || "");
  const { language } = useLanguage();
  const { toast } = useToast();
  const { addUsers } = useUsers();
  const wss = useWebSocketData();

  const validateFields = () => {
    let isValid = true;

    if (!name) {
      toast({
        variant: "destructive",
        description: "Nome é obrigatório",
      });
      isValid = false;
    }

    if (!email) {
      toast({
        variant: "destructive",
        description: "Email é obrigatório",
      });
      isValid = false;
    }

    if (!password) {
      toast({
        variant: "destructive",
        description: "Senha é obrigatória",
      });
      isValid = false;
    }

    if (!e164) {
      toast({
        variant: "destructive",
        description: "SIP é obrigatório",
      });
      isValid = false;
    }

    if (!type) {
      toast({
        variant: "destructive",
        description: "Tipo de conta é obrigatório",
      });
      isValid = false;
    }

    return isValid;
  };

  const passwordValidation = (password: string) => {
    if (password.length < 6) {
      toast({
        variant: "destructive",
        description: "A senha deve ter pelo menos 6 caracteres",
      });
      return false;
    }

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
    setIsCreating(true);

    if (!validateFields()) {
      setIsCreating(false);
      return;
    }

    if (!passwordValidation(password)) {
      setIsCreating(false);
      return;
    }
    //enviar a senha criptografada depois
    const obj = {
      email: email,
      password: password,
      name: name,
      sip: e164,
      type: type,
      ...(isUpdate && { id: user?.id }),
    };

    try {
      const response = await fetch(
        host + (isUpdate ? "/api/updateUser" : "/api/create"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth": localStorage.getItem("token") || "",
          },
          body: JSON.stringify(obj),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "emailDuplicated") {
          toast({
            variant: "destructive",
            description: "Email já está em uso",
          });
        } else {
          toast({
            variant: "destructive",
            description: data.error,
          });
        }
        throw new Error(data.error);
      } else {
        toast({
          description: "Conta criada com sucesso",
        });
        onSuccess?.();
        wss?.sendMessage({
          api: "admin",
          mt: "TableUsers",
        });
        // pedir a tableUsers de novo para atualizar o contexto com os novos usuários
        // podemos modificar isso futuramente e atualizar o contexto de acordo com o retorno da API

        // if (isUpdate) { // metodos para atualizar o contexto
        //   updateUsers(obj);
        // } else {
        //   addUsers(obj);
        // }
      }
    } catch (error) {
      console.error("Erro ao criar conta:", error);
    }

    setIsCreating(false);
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  const filteredUsers = usersPbx.filter((user) => user.e164 === searchTerm);
  const handleSetE164 = (value: string) => {
    setE164(value);
  };
  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    handleCreateUser();
  };
  return (
    <form onSubmit={handleFormSubmit}>
      <CardHeader className="flex">
        <CardTitle>
          {isUpdate
            ? "Update Account"
            : texts[language].cardCreateAccountTittle}
        </CardTitle>
        <CardDescription>
          {isUpdate
            ? "Update Account Information"
            : texts[language].cardCreateAccountDescription}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex justify-center grid-cols-2">
          <div className="grid gap-4 py-4 ">
            <div className="grid grid-cols-6 items-center gap-4">
              <Label className="text-end" htmlFor="name">
                Nome
              </Label>
              <Input
                className="col-span-4"
                id="name"
                placeholder="Nome"
                type="text"
                value={name}
                onChange={handleNameChange}
              />
            </div>
            <div className="grid grid-cols-6 items-center gap-4">
              <Label className="text-end" htmlFor="email">
                Email
              </Label>
              <Input
                className="col-span-4"
                id="email"
                placeholder="Email"
                type="email"
                value={email}
                onChange={handleEmailChange}
              />
            </div>

            <div className="grid grid-cols-6 items-center gap-4">
              <Label className="text-end" htmlFor="password">
                Senha
              </Label>
              <Input
                className="col-span-4"
                id="password"
                type="password"
                placeholder="Senha"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="grid grid-cols-6 items-center gap-4">
              <Label className="text-end" htmlFor="type">
                Tipo de conta
              </Label>
              <Select value={type} onValueChange={handleTypeChange}>
                <SelectTrigger className="col-span-4" id="type">
                  <SelectValue placeholder="Selecione o tipo de conta" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">Usuario</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
          <Label className="text-end" htmlFor="type">
                SIP
              </Label>
          <Select value={e164} onValueChange={handleSetE164}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a SIP" />
            </SelectTrigger>
            <SelectContent>
              {usersPbx.map((row) => (
                <SelectItem value={row.guid}>{row.e164}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        {!isCreating && (
          <Button type="submit" onSubmit={handleFormSubmit}>
            {isUpdate ? "Atualizar " : "Criar "} Conta
          </Button>
        )}
        {isCreating && (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isUpdate ? "Atualizar " : "Criar "} Conta
          </Button>
        )}
      </CardFooter>
    </form>
  );
}
