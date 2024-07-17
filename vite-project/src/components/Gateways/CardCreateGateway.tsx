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

import texts from "../../_data/texts.json";
import { useLanguage } from "@/components/language/LanguageContext";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
import { GatewaysInterface } from "./GatewaysContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface UpdateGatewayProps {
  gateway?: GatewaysInterface;
  isUpdate?: boolean;
  onSuccess?: () => void;
}

export default function CardCreateGateway({
  gateway,
  isUpdate = false,
  onSuccess,
}: UpdateGatewayProps) {
  const [host, setHost] = useState(gateway?.host || "");
  const [nicknameHost, setNicknameHost] = useState(gateway?.nickname || "");
  const [hostUser, setHostUser] = useState(gateway?.userapi || "");
  const [hostPassword, setHostPassword] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { language } = useLanguage();

  const { toast } = useToast();

  const handleHost = (event: ChangeEvent<HTMLInputElement>) => {
    setHost(event.target.value);
  };
  const handleNicknameHost = (event: ChangeEvent<HTMLInputElement>) => {
    setNicknameHost(event.target.value);
  };
  const handleHostUser = (event: ChangeEvent<HTMLInputElement>) => {
    setHostUser(event.target.value);
  };
  const handleHostPassword = (event: ChangeEvent<HTMLInputElement>) => {
    setHostPassword(event.target.value);
    console.log(nicknameHost);
  };
  const wss = useWebSocketData();
  const clearForms = () => {
    setIsCreating(false);
    setHost("");
    setNicknameHost("");
    setHostUser("");
    setHostPassword("");
    onSuccess?.();
  };
  const handleCreateGateway = async () => {
    console.log(
      `Nickname: ${nicknameHost}, Host: ${host}, Host User: ${hostUser}`
    );
    if (host && hostUser && nicknameHost) {
      setIsCreating(true);
      wss?.sendMessage({
        api: "admin",
        mt: isUpdate ? "UpdateGateway" : "AddGateway",
        ...(isUpdate && { id: gateway?.id }),
        host: host,
        apiuser: hostUser,
        password: hostPassword,
        nickname: nicknameHost,
      });
      clearForms();
    } else {
      toast({
        variant: "destructive",
        description:
          "Por favor, preencha todos os campos antes cadastrar o Gateway.",
      });
    }
  };

  return (
    //div que contem os cards
    <div className="flex flex-col md:flex-row gap-5 justify-center">
        <CardContent>
          <CardHeader>
            <CardTitle>
              {isUpdate == true ? "Update Gateway" : "Create Gateway"}
            </CardTitle>
            <CardDescription>
              {isUpdate == true
                ? "Update Gateway Description TEXT"
                : "Create Gateway Description TEXT"}
            </CardDescription>
          </CardHeader>
          {/* Card de criação de usuario */}
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-end" htmlFor="name">
                Nickname
              </Label>
              <Input
                className="col-span-2"
                id="nickname"
                placeholder="Apelido"
                type="text"
                value={nicknameHost}
                onChange={handleNicknameHost}
              />
            </div>

            <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-end" htmlFor="name">
                Host
              </Label>

              <Input
                className="col-span-2"
                id="host"
                placeholder="IP ou URL do Gateway"
                type="text"
                value={host}
                title="https://192.168.1.1 ou https://www.hostname.com"
                onChange={handleHost}
              />
            </div>

            <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-end" htmlFor="name">
                User
              </Label>
              <Input
                className="col-span-2"
                id="user"
                placeholder="Username"
                title="username de acesso ex."
                type="text"
                value={hostUser}
                onChange={handleHostUser}
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-end" htmlFor="name">
                Password
              </Label>
              {isUpdate == true ? (
                <Input
                  className="col-span-2"
                  id="password"
                  type="password"
                  placeholder="Nova Senha"
                  value={hostPassword}
                  onChange={handleHostPassword}
                />
              ) : (
                <Input
                  className="col-span-2"
                  id="password"
                  type="password"
                  placeholder="Senha"
                  value={hostPassword}
                  onChange={handleHostPassword}
                />
              )}
            </div>
            <CardFooter className="flex justify-end">
              {!isCreating && (
                <Button onClick={handleCreateGateway}>Atualizar Gateway</Button>
              )}
              {isCreating && (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criar Gateway
                </Button>
              )}
            </CardFooter>
          </div>
        </CardContent>

    </div>
  );
}
