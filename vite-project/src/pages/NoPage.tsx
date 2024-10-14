import { BotOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { AccountContext } from "@/components/account/AccountContext";

export default function NoPage() {
  const account = useContext(AccountContext);
  return (
    <div className="px-[200px]">
      <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-lg">Página não encontrada</p>
        <BotOff size={200} />
        <div>
          {account.type === "admin" ? (
            <Button asChild>
              <a href="/admin/buttons">Voltar a pagina Inicial</a>
            </Button>
          ) : account.type === "reports" ? (
            <Button asChild>
              <a href="/reports">Voltar a pagina Inicial</a>
            </Button>
          ) : account.type === "user" ? (
            <Button asChild>
              <a href="/user/buttons">Voltar a pagina Inicial</a>
            </Button>
          ) : (
            <Button asChild>
              <a href="/Login">Voltar a pagina de Login</a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
