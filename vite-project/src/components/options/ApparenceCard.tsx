import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTheme } from "@/components/theme-provider"
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
  const { setTheme } = useTheme()

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

  const handleUpdateColor = async () => {
    setUpdateColor(true);

    try {
      wss?.sendMessage({
        api: "admin",
        mt: "UpdateConfig",
        vl: selectedColor,
        entry: "theme",
      });
      toast({
        title: "Success",
        description: "Theme color updated successfully",
        
      });
      setTheme(selectedColor);
    } catch (error) {
      console.error("Error updating theme color:", error);
      toast({
        title: "Error",
        description: "Failed to update theme color",
        
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
            <div className="flex justify-between w-full items-center">
              <Label> Escolha uma cor</Label>
              <select
          
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="mt-1 block w-full"
            >
              <option value="root">Blue</option>
              <option value="red">Red</option>
              <option value="zinc">Zinc</option>
            </select>
            </div>
            <Button
            onClick={handleUpdateColor}
            disabled={updateColor}
            className="mt-4"
          >
            {updateColor ? "Saving..." : "Save"}
          </Button>
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando
              </>
            ) : (
              "Salvar"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
