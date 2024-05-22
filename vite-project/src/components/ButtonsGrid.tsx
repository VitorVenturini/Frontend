import { useAccount } from "@/components/AccountContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ButtonInterface } from "./ButtonsContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


// interface accountSelect {
//     id: string;
//     name: string;
//     // Adicione outras propriedades do usuário conforme necessário
//   }

interface ButtonsGridProps {
  buttons: ButtonInterface[];
}

export default function ButtonsGrid({ buttons }: ButtonsGridProps) {
  return (
    
    <Card className="p-5 min-w-[644px]">
      <div className=" gap-6">
        {buttons.map((button) => (
          <div key={button.id}>
            <h3>Nome do botão: {button.button_name}</h3>
            <h3>Posição X: {button.position_x}</h3>
            <h3>Posição Y: {button.position_y}</h3>
            <h3>Página {button.page}</h3>
            <h3>================================</h3>
            {/* Renderize outras informações do botão conforme necessário */}
          </div>
        ))}
      </div>
    </Card>
    
  );
}
