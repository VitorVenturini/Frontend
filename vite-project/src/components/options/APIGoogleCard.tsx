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

export default function APIGoogleCard() {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [key, setKey] = useState("")

    const handleGoogleKey = () =>{
        
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
            <Input placeholder="Chave" className="w-full" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button>Salvar</Button>
      </CardFooter>
    </Card>
  );
}
