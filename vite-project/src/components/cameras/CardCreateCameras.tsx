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
import { CamerasInterface } from "./CameraContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface UpdateCameraProps {
  camera?: CamerasInterface;
  isUpdate?: boolean;
  onSuccess?: () => void;
}

export default function CardCreateCameras({
  camera,
  isUpdate = false,
  onSuccess,
}: UpdateCameraProps) {
  const [mac, setMac] = useState(camera?.mac || "");
  const [isCreating, setIsCreating] = useState(false);
  const { language } = useLanguage();

  const { toast } = useToast();

  const handleMac = (event: ChangeEvent<HTMLInputElement>) => {
    setMac(event.target.value);
  };
  const wss = useWebSocketData();
  const clearForms = () => {
    setIsCreating(false);
    setMac("");

    onSuccess?.();
  };
  const handleCreateCameras = async () => {
    console.log(`Mac: ${mac}`);
    if (mac) {
      setIsCreating(true);
      wss?.sendMessage({
        api: "admin",
        mt: isUpdate ? "UpdateCamera" : "AddCamera",
        ...(isUpdate && { id: camera?.id }),
        mac: mac,
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
            {isUpdate == true ? "Update Camera" : "Create Camera"}
          </CardTitle>
          <CardDescription>
            {isUpdate == true
              ? "Update Camera Description TEXT"
              : "Create Camera Description TEXT"}
          </CardDescription>
        </CardHeader>
        {/* Card de criação de usuario */}
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label className="text-end" htmlFor="name">
              Mac Address
            </Label>
            <Input
              className="col-span-2"
              id="mac"
              placeholder="Mac Address"
              type="text"
              value={mac}
              onChange={handleMac}
            />
          </div>
          <CardFooter className="flex justify-end">
            {!isCreating && (
              <Button onClick={handleCreateCameras}>Criar Camera</Button>
            )}
            {isCreating && (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Atualizar Camera
              </Button>
            )}
          </CardFooter>
        </div>
      </CardContent>
    </div>
  );
}