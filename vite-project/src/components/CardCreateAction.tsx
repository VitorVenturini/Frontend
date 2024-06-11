import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import React, { useEffect, useState, ChangeEvent } from "react";
import { Value } from "@radix-ui/react-select";
import TableUser from "@/components/TableUser";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import texts from "../_data/texts.json";
import { useLanguage } from "./LanguageContext";

interface User {
  id: string;
  name: string;
  guid: string;
}
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

type Checked = DropdownMenuCheckboxItemProps["checked"];

interface ActionsInteface {
  id: number;
  action_name: string; //
  action_alarm_code: string;
  action_start_type: string;
  action_prt: string; //
  action_user: string; //
  action_type: string; //
  action_device?: string | null; //
  action_sensor_name?: string | null;
  action_sensor_type?: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function CardCreateAction() {
  const [users, setUsers] = useState<User[]>([]);
  const [actionName, setactionName] = useState("");
  const [actionType, setActionType] = useState("");
  const [actionParameter, setActionParameter] = useState("");
  const [type, setType] = useState("");
  const [actionValue, setActionValue] = useState("");
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // Inicialmente, o primeiro usuário é selecionado
  const [isCreating, setIsCreating] = useState(false);
  const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true);
  const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false);
  const [showPanel, setShowPanel] = React.useState<Checked>(false);
  const [position, setPosition] = React.useState("bottom");

  const { language } = useLanguage();

  const { toast } = useToast();
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

  const handleActionName = (event: ChangeEvent<HTMLInputElement>) => {
    setactionName(event.target.value);
  };
  const handleActionType = (event: ChangeEvent<HTMLInputElement>) => {
    setActionType(event.target.value);
  };
  const handleParameterAction = (event: ChangeEvent<HTMLInputElement>) => {
    setActionParameter(event.target.value);
  };
  const handleType = (event: ChangeEvent<HTMLInputElement>) => {
    setType(event.target.value);
  };
  const handleActionValue = (event: ChangeEvent<HTMLInputElement>) => {
    setActionValue(event.target.value);
  };

  const handleUserSelect = (value: string) => {
    const user = users.find((user) => user.id === value);
    console.log(user)
    setSelectedUser(user || null);
  };

  const handleCreateAction = async () => {
    console.log(
      `User: ${JSON.stringify(selectedUser)}, Action Name: ${actionName}, Action Type: ${actionType}, Parâmetro da Ação: ${actionParameter}, Valor da Ação: ${actionValue}, Tipo de Ação: ${type}`
    );
  };
//   const handleCreateOpt = () => {
//     if (nameOpt && valueOpt) {
//       setIsCreating(true);
//       wss?.sendMessage({
//         api: "admin",
//         mt: isUpdate ? "UpdateButton" : "InsertButton",
//         name: nameOpt,
//         value: valueOpt,
//         guid: selectedUser?.guid,
//         type: selectedOpt,
//         page: "0",
//         x: clickedPosition?.j,
//         y: clickedPosition?.i,
//       });
//       setIsCreating(false);
//     } else {
//       toast({
//         variant: "destructive",
//         description:
//           "Por favor, preencha todos os campos antes de criar o botão.",
//       });
//     }
//   };
  return (
    //div que contem os cards
    <div className="flex flex-col md:flex-row gap-5 justify-center">
      <Dialog>
        <DialogTrigger>
          <Button>{texts[language].cardCreateAccountTrigger}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Action</DialogTitle>
            <DialogDescription>Create Action TEXT</DialogDescription>
          </DialogHeader>
          {/* Card de criação da ação */}
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-end" htmlFor="name">
                Nome
              </Label>
              <Select onValueChange={handleUserSelect}>
                <SelectTrigger className="col-span-2">
                  <SelectValue
                    placeholder={texts[language].selectUserPlaceholder}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{texts[language].users}</SelectLabel>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-end" htmlFor="name">
                Nome da ação
              </Label>
              <Input
                className="col-span-2"
                id="name"
                placeholder="Nome da ação"
                type="text"
                value={actionName}
                onChange={handleActionName}
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-end" htmlFor="name">
                Tipo de Gatilho
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="col-span-2" variant="outline">Escolha</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Gatilho</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={actionType}
                    onValueChange={setActionType}
                  >
                    <DropdownMenuRadioItem value="Alarme">
                      Alarme
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="NumeroOrigem">
                      Número Origem
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="NumeroDestino">
                      Número Destino
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="ValorMin">
                      Valor Minímo
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="ValorMax">
                      Valor Maximo
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-end" htmlFor="name">
                Parâmetro Gatilho
              </Label>
              <Input
                className="col-span-2"
                id="name"
                placeholder="Parâmetro Gatilho"
                type="text"
                value={actionParameter}
                onChange={handleParameterAction}
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-end" htmlFor="name">
                Tipo
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="col-span-2" variant="outline">Escolha</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Tipo</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={type}
                    onValueChange={setType}
                  >
                    <DropdownMenuRadioItem value="Alarme">
                      Alarme
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Número">
                      Número
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Botão">
                      Botão
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-end" htmlFor="name">
                Valor
              </Label>
              <Input
                className="col-span-2"
                id="name"
                placeholder="Valor"
                type="text"
                value={actionValue}
                onChange={handleActionValue}
              />
            </div>

            <DialogClose className="flex justify-end">
            {!isCreating && (
                <Button onClick={handleCreateAction}>Criar Ação</Button>
              )}
              {isCreating && (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criar Ação
                </Button>
              )}
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
