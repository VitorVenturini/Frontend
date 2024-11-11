import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTheme } from "@/components/theme-provider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { host } from "@/App";
import { Loader2 } from "lucide-react";
import { ChangeEvent, useState, useEffect } from "react";
import { useAccount } from "../account/AccountContext";
import { useToast } from "@/components/ui/use-toast";
import Logomarca from "../Logomarca";
import { ModeToggle } from "../mode-toggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useWebSocket from "../websocket/useWebSocket";

import { useWebSocketData } from "../websocket/WebSocketProvider";
import logoWecom2 from "@/assets/LogoWecom2.svg";

export default function ApparenceCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<File | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [updateColor, setUpdateColor] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>("root");
  const account = useAccount();
  const { toast } = useToast();
  const wss = useWebSocketData();
  const { setTheme } = useTheme();

  useEffect(() => {
    // Fetch the current logo from the backend
    const fetchLogo = async () => {
      try {
        const response = await fetch(`${host}/api/uploads/logomarca.png`, {
          headers: {
            "x-auth": account.accessToken || "",
          },
        });
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setLogoUrl(url);
        } else {
          console.error("Erro ao buscar a imagem");
        }
      } catch (error) {
        console.error("Erro ao buscar a imagem", error);
      }
    };

    fetchLogo();
  }, [account.accessToken, host]);

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileContent(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleUpdateLogo = async () => {
    if (!fileContent) {
      toast({
        variant: "destructive",
        description: "Por favor, selecione um arquivo antes de salvar.",
      });
      return;
    }
    setIsCreating(true);
    try {
      const formData = new FormData();
      formData.append("file", fileContent, "logomarca.png");
      const response = await fetch(`${host}/api/uploadFiles`, {
        method: "POST",
        headers: {
          "x-auth": account.accessToken || "",
        },
        body: formData,
      });
      if (response.ok) {
        toast({
          description: "Imagem atualizada com sucesso!",
        });
      } else {
        const data = await response.json();
        console.error("Erro ao enviar a imagem", data);
        toast({
          variant: "destructive",
          description: "Erro ao enviar a imagem.",
        });
      }
    } catch (error) {
      console.error("Erro ao enviar a imagem", error);
      toast({
        variant: "destructive",
        description: "Erro ao enviar a imagem.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateColor = async () => {
    setUpdateColor(true);

    try {
      wss?.sendMessage({
        api: "admin",
        mt: "UpdateConfig",
        vl: selectedColor,
        entry: "theme",
      });
      setTheme(selectedColor as any);
      toast({
        description: "Tema atualizado com sucesso !",
      });
    } catch (error) {
      console.error("Error updating theme color:", error);
      toast({
        variant: "destructive",
        description: "Erro ao atualizar a cor do tema.",
      });
    } finally {
      setUpdateColor(false);
    }
  };
  return (
    <div>
      {}
      <Card className="w-[800px]">
        <CardHeader>
          <CardTitle>Aparecia</CardTitle>
          <CardDescription>
            Altere aqui a aparencia da aplicação como logo, cor e fonte
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-3 ">
            <div className="flex items-center justify-between gap-3">
              <h4 className="scroll-m-20 text-xl font-semibold basis-1/2">
                Logo
              </h4>
              <Input
                type="file"
                id="logo"
                placeholder="Selecione um arquivo"
                onChange={handleLogoChange}
              />
            </div>
            <div className="flex items-center justify-between">
            <Card className="max-h-[500px] max-w-[500px]">
              <CardHeader>
                <CardTitle className="flex justify-center">preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-between gap-3">
                  {logoUrl && <img src={logoUrl} alt="Logo" />}
                </div>
              </CardContent>
            </Card>
            <Button
              onClick={handleUpdateLogo}
              disabled={updateColor}
              className="mt-4"
            >
              {updateColor ? "Saving..." : "Salvar imagem"}
            </Button>
            </div>
            
            <div className="flex justify-between w-full items-center">
              <Label> Escolha uma cor</Label>

              <Button
                variant="outline"
                className=" gap-2 flex items-center"
                onClick={() => {
                  setSelectedColor("blue");
                  setTheme("blue");
                }}
              >
                Azul
                <div className=" bg-blue-400 w-[20px] h-[20px]" />
              </Button>
              <Button
                variant="outline"
                 className=" gap-2 flex items-center"
                onClick={() => {
                  setSelectedColor("red");
                  setTheme("red");
                }}
              >
                Vermelho
                <div className=" bg-red-400 w-[20px] h-[20px]"/>
              </Button>
              <Button
                variant="outline"
                 className=" gap-2 flex items-center"
                onClick={() => {
                  setSelectedColor("zinc");
                  setTheme("zinc");
                }}
              >
                Zinco
                <div className=" bg-zinc-400 w-[20px] h-[20px]" />
              </Button>
            </div>
            <Button
              onClick={handleUpdateColor}
              disabled={updateColor}
              className="mt-4"
            >
              {updateColor ? "Saving..." : "Salvar este tema"}
            </Button>
          </div>
        </CardContent>

      </Card>
    </div>
  );
}
