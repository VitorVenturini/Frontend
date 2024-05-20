import { useAccount } from "@/components/AccountContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface accountSelect {
    id: string;
    name: string;
    // Adicione outras propriedades do usuário conforme necessário
  }
  
  interface ButtonsGridProps {
    user: accountSelect | null;
  }

export default function ButtonsGrid() {
  return (
    <Card className="p-5 min-w-[644px]">
        <div className=" gap-6">
            buttonsGrid
      </div>
    </Card>
  );
}
