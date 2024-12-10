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
import { getCountryCallingCode, CountryCode } from "libphonenumber-js";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";

interface NotifyActionsProps {
  id: string;
}

const countryList = [
  { name: "Brasil", code: "BR", ddi: "55" },
  { name: "Estados Unidos", code: "US", ddi: "1" },
  { name: "Reino Unido", code: "GB", ddi: "44" },
  // Adicione outros países conforme necessário
];

export default function NotifyActions({ id }: NotifyActionsProps) {
  const [emails, setEmails] = useState<string[]>(["", "", ""]);
  const [phones, setPhones] = useState<{ ddi: string; number: string }[]>([
    { ddi: "55", number: "" },
  ]);
  const [locationDDI, setLocationDDI] = useState<string>("55");
  
  const wss = useWebSocketData();
  // Detecta o DDI com base na localização
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          // Use uma API externa para determinar o país com base na localização
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();

          const countryCode = data.countryCode as CountryCode;
          const ddi = getCountryCallingCode(countryCode);
          setLocationDDI(ddi);
          setPhones([{ ddi: ddi, number: "" }]);
        },
        () => {
          console.warn("Geolocalização não permitida, usando valor padrão");
        }
      );
    }
  }, []);

  // Atualiza o valor do telefone
  const handlePhoneChange = (index: number, value: string) => {
    const updatedPhones = [...phones];
    updatedPhones[index].number = value;
    setPhones(updatedPhones);
  };

  // Atualiza o DDI selecionado
  const handleDDIChange = (index: number, ddi: string) => {
    const updatedPhones = [...phones];
    updatedPhones[index].ddi = ddi;
    setPhones(updatedPhones);
  };

  // Adiciona novo input
  const addPhoneInput = () => {
    setPhones([...phones, { ddi: locationDDI, number: "" }]);
  };

  // Remove um input
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

  console.log(`Action ID ${id}`);
  console.log(`Actions Notify e-mails ${emails}`);
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
    console.log(
      "Emails a serem enviados:",
      emails.filter((email) => email.trim() !== "")
    );
    wss?.sendMessage({
      api: "admin",
      mt: 'InsertActionNotify',
      id: id,
      emails: emails,
      smsPhones: phones,


    });

  };

  return (
    <Card className="w-full">
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
            <ScrollArea className="w-full h-[300px]">
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
                      <Trash size={20} />
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
            <ScrollArea className="w-full h-[300px]">
              <CardContent className="w-full p-0">
                <div className="flex flex-col gap-3">
                  {phones.map((phone, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {/* Select para DDI */}
                      <Select
                        defaultValue={phone.ddi}
                        onValueChange={(value) => handleDDIChange(index, value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="DDI" />
                        </SelectTrigger>
                        <SelectContent>
                          {countryList.map((country) => (
                            <SelectItem key={country.code} value={country.ddi}>
                              +{country.ddi} ({country.name})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Input para Número */}
                      <Input
                        type="tel"
                        placeholder="Digite o telefone"
                        value={phone.number}
                        onChange={(e) =>
                          handlePhoneChange(index, e.target.value)
                        }
                        className="w-full p-2 border rounded-md"
                      />

                      {/* Botão de Remover */}
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removePhoneInput(index)}
                      >
                        <Trash size={20} />
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
