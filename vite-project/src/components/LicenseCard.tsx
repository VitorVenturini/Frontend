import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Ghost } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function LicenseCard() {
  const [licenseKey, setKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLicenseKey = (event: ChangeEvent<HTMLInputElement>) => {
    setKey(event.target.value);
    
  };
  const saveKey = async () => {
    setIsLoading(true)
    console.log(`Nova Key: ${licenseKey}`);
    if(licenseKey === ""){
      toast({
        variant: "destructive",
        description: "Chave Vazia"
      })
    }else{ 
      //implementar conversa com backend 
      toast({
        description: "Chave de Licença atualizada com sucesso"
      })
    }
    setIsLoading(false);  

  };
  return (
    <Card className="min-w-[700px]">
      <CardHeader>
        <CardTitle>Licenciamento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full flex flex-col gap-5">
          <div className="flex items-center justify-between gap-3">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Token do sistema
            </h4>
            <p className="text-sm text-muted-foreground">00aa00aa00aa00aa</p>
          </div>
          <div>
            <div className="flex items-center justify-between gap-3">
              <h4 className="scroll-m-20 text-xl font-semibold basis-1/2">
                Chave de licença
              </h4>
              <Input
                type="text"
                id="key"
                placeholder="Chave de Licença"
                onChange={handleLicenseKey}
              />
            </div>
          </div>
          <div className="flex items-center justify-between gap-3">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Licença Ativa
            </h4>
            <p className="text-sm text-muted-foreground">
              "System:"true,"Users":15
            </p>
          </div>
          <div className="flex items-center justify-between gap-3">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Data de instalação da licença
            </h4>
            <p className="text-sm text-muted-foreground">2003-11-08 8:32:00</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        {!isLoading && (<Button onClick={saveKey}>Salvar</Button>)}
        {isLoading && (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Salvar
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
