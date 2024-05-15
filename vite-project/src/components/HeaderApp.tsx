import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import logo from "../assets/principal.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logout from "./Logout";


const handleLogout = () => {
  localStorage.removeItem("token");
};

export default function HeaderApp() {

  return (
    <header className="flex justify-between items-center p-4">
      <img
        src={logo} // Use o logo importado aqui
        alt="Logo"
        width={200}
        height={200}
      />
      <div className="flex items-end ">
        <div className="flex items-center gap-1">
          <Button asChild variant="ghost">
            <a href="/admin/buttons">Botões</a>
          </Button>
          <Button asChild variant="ghost">
            <a href="/user">Visão de usuário</a>
          </Button>
          <Button asChild variant="ghost">
            <a href="/admin/account">Conta</a>
          </Button>
          <Logout/>
          <ModeToggle />
        </div>

      </div>
    </header>
  );
}
