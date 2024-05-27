import { useAccount } from "@/components/AccountContext";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ButtonInterface } from "./ButtonsContext"

interface User {
  id: string;
  name: string;
  guid: string;
  // Adicione aqui outros campos se necessário
}
interface RightGridProps {
  buttons: ButtonInterface[];
  selectedUser : User | null
}

  export default function RightGrid() {
  return (
    <Card className="p-5 min-w-[324px] h-[500px]">
        <div className=" gap-6">
      </div>
    </Card>
  );
}
