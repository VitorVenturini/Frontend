import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { useWebSocketData } from "../websocket/WebSocketProvider";
import React, { ChangeEvent } from "react";
import { Loader2 } from "lucide-react";
import { toast, useToast } from "../ui/use-toast";
// import * from React

export default function APIGoogleCard() {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [key, setKey] = useState("")
    const {toast} = useToast()
    const wss = useWebSocketData()

    const handleApiKey = (event: ChangeEvent<HTMLInputElement>) => {
      setKey(event.target.value);
    };

    const handleSendGoogleApiKey = () =>{
      setIsLoading(true)
      if(key){
        wss?.sendMessage({
          api: "admin",
          mt: "UpdateConfig",
          entry: "googleApiKey",
          vl: key
        })
      }else{
        toast({
          variant: "destructive",
          description: "Favor Inserir a chave da API Google"
        })
      }
      setIsLoading(false)
      //{"api":"admin", "mt":"UpdateConfig", "entry":"CHAVE GOOGLEKEY API", "vl":"VALOR DA CHAVE"}
    }
  return (
    <Card className="w-[50%] h-fit">
      <CardHeader>
        <CardTitle>API Google</CardTitle>
        <CardDescription>Chave da API do google</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full flex flex-col gap-5">
          <div className="flex items-center justify-between gap-3 w-full">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Chave
            </h4>
            <Input placeholder="Chave" className="w-full" onChange={handleApiKey} value={key} />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
      {!isLoading && (
          <Button onClick={handleSendGoogleApiKey}>
            Salvar
          </Button>
        )}
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
