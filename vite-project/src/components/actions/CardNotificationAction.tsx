import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useActions } from "./ActionsContext";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
import Loader from "../Loader";
interface NotifyActionsProps {
  id: string;
  isUpdate?: boolean;
  notifications: any[];
}
const countryDDIList = [
  { name: "Brasil", ddi: "55", flag: "🇧🇷" },
  { name: "USA", ddi: "1", flag: "🇺🇸" },
  { name: "Alemanha", ddi: "49", flag: "🇩🇪" },
  { name: "Espanha", ddi: "34", flag: "🇪🇸" },
  { name: "Itália", ddi: "39", flag: "🇮🇹" },
  { name: "Suécia", ddi: "46", flag: "🇸🇪" },
  { name: "União Europeia", ddi: "30", flag: "🇪🇺" },
  { name: "Japão", ddi: "81", flag: "🇯🇵" },
];

export default function NotifyActions({
  id,
  isUpdate = false,
  notifications,
}: NotifyActionsProps) {
  const { notifyAction, clearNotifyAction } = useActions();
  const [actionSmsPhones] = useState();
  const [emails, setEmails] = useState<string[]>(
    notifyAction[0]?.actionEmails || [""]
  );
  const [phones, setPhones] = useState<{ ddi: string; number: string }[]>([
    { ddi: "55", number: "" },
  ]);
  const [sendMsg, setSendMsg] = useState(false);
  const [reload, setReload] = useState(false);
  const parsePhoneNumber = (phone: string): { ddi: string; number: string } => {
    const phoneRegex = /^\+(\d{2,3})(\d{8,9})$/;
    const match = phone.match(phoneRegex);

    if (match) {
      return { ddi: match[1], number: match[2] };
    }
    return { ddi: "55", number: phone };
  };
  const notifyEmails = notifications.filter((notify) => {
    return notify.email_phone == "email";
  }).map((notify) =>{
    return notify.parameter;
  });
  console.log("notifyEmails", notifyEmails);
  const notifySms = notifications.filter((notify) => {
    return notify.email_phone == "sms";
  }).map((notify) =>{
    return notify.parameter;
  });
  console.log("notifySms", notifySms);
  useEffect(() => {
    setEmails(notifyEmails)
    if (notifySms.length > 0) {
      const formattedPhones = notifySms.map((phone) =>
        parsePhoneNumber(phone)
      );
      setPhones(formattedPhones);
      setReload(true);
    }
  }, [actionSmsPhones]);

  console.log(
    "%c🕵️‍♂️\nNotifications",
    "font-size: 50px; color: red; font-weight: bold;",
    notifications
  );
  console.log(
    "%cNotifyAction",
    "font-size: 35px; color: blue; font-weight: bold;",
    notifyAction
  );

  const [locationDDI, setLocationDDI] = useState<string>("55");

  const wss = useWebSocketData();
  // Detecta o DDI com base na localização

  const handlePhoneChange = (index: number, value: string) => {
    // Remove todos os caracteres que não são números
    const cleanedValue = value.replace(/\D/g, "");

    // Garante que o número tenha no máximo 11 dígitos
    const validNumber = cleanedValue.slice(0, 11);

    // Atualiza o estado apenas se tiver 11 dígitos
    const updatedPhones = [...phones];
    updatedPhones[index].number = validNumber;
    setPhones(updatedPhones);
  };

  const handleDDIChange = (index: number, ddi: string) => {
    const updatedPhones = [...phones];
    updatedPhones[index].ddi = ddi;
    setPhones(updatedPhones);
  };

  const addPhoneInput = () => {
    setPhones([...phones, { ddi: "55", number: "" }]);
  };

  const removePhoneInput = (index: number) => {
    const updatedPhones = phones.filter((_, i) => i !== index);
    setPhones(updatedPhones);
  };

  // Função para atualizar o valor de um input específico
  const handleEmailChange = (index: number, value: string) => {
    const updatedEmails = [...emails];
    updatedEmails[index] = value;
    setEmails(updatedEmails);
  };

  // Adicionar um novo input
  const addEmailInput = () => {
    setEmails([...emails, ""]);
  };

  // Remover um input específico
  const removeEmailInput = (index: number) => {
    const updatedEmails = emails.filter((_, i) => i !== index);
    setEmails(updatedEmails);
  };

  // Simulação de envio ao backend
  const handleSave = () => {
    // Validação simples de e-mail usando Regex
    const isValidEmail = (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    // Valida e-mails e converte para lowercase
    const formattedEmails = emails
      .filter((email) => email.trim() !== "") // Remove campos vazios
      .map((email) => email.toLowerCase()) // Converte para lowercase
      .filter((email) => isValidEmail(email)); // Filtra apenas e-mails válidos

    if (formattedEmails.length !== emails.length) {
      alert("Existem e-mails inválidos! Verifique os campos.");
      return;
    }

    // Validação e formatação dos números de telefone
    const formattedPhones = phones
      .filter((phone) => phone.number.length === 11) // Garante que o número tenha 11 dígitos
      .map((phone) => `+${phone.ddi}${phone.number}`);

    if (formattedPhones.length !== phones.length) {
      alert("Existem números de telefone inválidos! Verifique os campos.");
      return;
    }

    // Envio ao backend

    wss?.sendMessage({
      api: "admin",
      mt: "UpdateActionUserNotification",
      id: id,
      emails: formattedEmails,
      smsPhones: formattedPhones,
    });
  };

  return (
    <Card className=" border-none">
      <CardHeader>
        <CardTitle>Notificação via e-mails/SMS</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="sms">SMS</TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            <ScrollArea className="w-[103%] h-[300px] pr-4">
              <div className="flex flex-col gap-3">
                {emails.map((email, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      type="email"
                      placeholder={`Digite o email ${index + 1}`}
                      value={email}
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeEmailInput(index)}
                    >
                      <Trash />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={addEmailInput}
                  className="w-full"
                  size="icon"
                >
                  <Plus className="mr-2" /> Adicionar E-mail
                </Button>
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="sms">
            <ScrollArea className="w-[103%] h-[300px] pr-4">
              <CardContent className="w-full p-0">
                <div className="flex flex-col gap-3">
                  {phones.map((phone, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center gap-2"
                    >
                      <div className="flex gap-4 w-full">
                        {/* Select com bandeiras */}
                        <Select
                          value={phone.ddi}
                          onValueChange={(value) =>
                            handleDDIChange(index, value)
                          }
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue placeholder="DDI" />
                          </SelectTrigger>
                          <SelectContent>
                            {countryDDIList.map((country) => (
                              <SelectItem key={country.ddi} value={country.ddi}>
                                <span className="flex items-center gap-2 justify-center align-middle">
                                  <span>{`+${country.ddi}`}</span>
                                  <span className="flex items-center justify-center">
                                    {country.flag}
                                  </span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Input para número */}
                        <Input
                          type="tel"
                          placeholder="Digite o DDD + telefone 51999999999"
                          value={phone.number}
                          onChange={(e) =>
                            handlePhoneChange(index, e.target.value)
                          }
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      {/* Botão de Remover */}
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removePhoneInput(index)}
                      >
                        <Trash />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={addPhoneInput}
                    className="w-full"
                  >
                    <Plus className="mr-2" /> Adicionar Telefone
                  </Button>
                </div>
              </CardContent>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSave}>Salvar</Button>
      </CardFooter>
    </Card>
  );
}
