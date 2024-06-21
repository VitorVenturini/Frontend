import { useLanguage } from "@/components/language/LanguageContext";
import { Button } from "@/components/ui/button";
import { US, BR, ES } from "country-flag-icons/react/3x2";
import { Languages } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageToggle() {
  const { setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
            <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage("en")}>
          <div className="flex items-center gap-1">
            <US className="h-4 w-4" />
            English
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("pt")}>
          <div className="flex items-center gap-1">
            <BR className="h-4 w-4" />
            Português
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("es")}>
          <div className="flex items-center gap-1">
            <ES className="h-4 w-4" />
            Español
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
