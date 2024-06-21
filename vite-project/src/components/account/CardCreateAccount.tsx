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
import { useState, ChangeEvent } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogClose,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import texts from "../../_data/texts.json";
import { useLanguage } from "@/components/language/LanguageContext";

interface User {
  id: string;
  name: string;
  guid: string;
  email: string;
  sip: string;
  // Adicione aqui outros campos se necessário
}
export default function CardCreateAccount() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sip, setSip] = useState("");
  const [type, setType] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);
  const { language } = useLanguage();

  const { toast } = useToast();

  interface ContaProps {
    onUserCreated: () => void;
  }

  const passwordValidation = (password: string) => {
    setIsCreating(true);
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

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setSip("");
    setType("");
  };

  const handleCreateUser = async () => {
    console.log(
      `Nome: ${name},Email: ${email}, Senha: ${password}, SIP: ${sip}, Tipo de conta: ${type}`
    );

    setIsCreating(true);

    if (!passwordValidation(password)) {
      toast({
        variant: "destructive",
        description: "Senha inválida",
      });
      setIsCreating(false);
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
      const response = await fetch("https://meet.wecom.com.br/api/create", {
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
        setTimeout(() => {
          window.location.reload();
        }, 3000);

        //fazer com que atulize a lista de contas
      }
    } catch (error) {
      // Aqui você pode lidar com qualquer erro que possa ocorrer durante a criação da conta
    }
    setIsCreating(false);
  };
  return (
    //div que contem os cards
    <div className="flex flex-col md:flex-row gap-5 justify-center">
      <Dialog onOpenChange={(isOpen) => !isOpen && resetForm()}>
        <DialogTrigger>
          <Button>{texts[language].cardCreateAccountTrigger}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{texts[language].cardCreateAccountTittle}</DialogTitle>
            <DialogDescription>
              {texts[language].cardCreateAccountDescription}
            </DialogDescription>
          </DialogHeader>
          {/* Card de criação de usuario */}
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-end" htmlFor="name">
                Nome
              </Label>
              <Input
                className="col-span-2"
                id="name"
                placeholder="Nome"
                type="text"
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
                type="email"
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
                type="password"
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
            <DialogClose className="flex justify-end">
              {!isCreating && (
                <Button onClick={handleCreateUser}>Criar conta</Button>
              )}
              {isCreating && (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criar conta
                </Button>
              )}
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
