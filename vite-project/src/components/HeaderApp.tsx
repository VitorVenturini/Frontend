import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"
import logo from '../assets/principal.svg'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"




export default function HeaderApp(){
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
            <Button asChild variant="ghost">
                <a href="/Themes">Temas</a>
                </Button>
            <Button asChild variant="ghost">
                <a href="/Login">Login</a>
                </Button>
            </div>
            <div className="flex items-center gap-1">
            <Input type="search" placeholder="Search" />
            <ThemeProvider>
                <ModeToggle />
            </ThemeProvider>
        
            </div>
            </div>
        </header>
    )
};

