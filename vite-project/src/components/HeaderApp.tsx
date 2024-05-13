import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import logo from "../assets/principal.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


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
            <a href="/Home">Inicio</a>
          </Button>
          <Button asChild variant="ghost">
            <a href="/Conta">Conta</a>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger>
              <Button variant="ghost"> Sair</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Voce tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Ao apertar em sair você será redirecionado para a página de
                  login
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <a
                    onClick={handleLogout}
                    href="/Login"
                    //fazer a logiga de sair aqui
                  >
                    Sair
                  </a>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="flex items-center gap-1">
          <Input type="search" placeholder="Search" />
          <ThemeProvider>
            <ModeToggle />
          </ThemeProvider>
        </div>
      </div>
    </header>
  );
}
