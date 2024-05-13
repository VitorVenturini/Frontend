import Image from "next/image";
import { ModeToggle } from "@/components/ModeTogle";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { Sword } from 'lucide-react';
import { Swords } from 'lucide-react';
import { Dices } from 'lucide-react';
import { LoaderCircle } from 'lucide-react';
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Label } from "@/components/ui/label"



const data: Payment[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    email: "ken99@yahoo.com",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    email: "Abe45@gmail.com",
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    email: "Monserrat44@gmail.com",
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "success",
    email: "Silas22@gmail.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@hotmail.com",
  },
]
export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}


export default function Home() {
  return (
    <main className="">
      <header className="flex items-center justify-between p-4">
        <div className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          SFCA
        </div>
        <div className="flex gap-3">
          <Button>Salvar</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <User className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all " />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Personagem 1</DropdownMenuItem>
              <DropdownMenuItem>Personagem 2</DropdownMenuItem>
              <DropdownMenuItem>Personagem 3</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle />
        </div>
      </header>
      <div className="flex flex-col lg:flex-row">
        <Card className="w-full md:max-w-[700px] ">
          <CardHeader>
            <CardTitle>Crie sua habilidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="gap-2">
            <Input placeholder="Nome" />
            <Input placeholder="Dano" />
            <Input placeholder="Custo" />
            <Input placeholder="Tipo" />
            </div>

          </CardContent>
          <CardFooter>
            <Button>Salvar</Button>
          </CardFooter>
        </Card>
        <Card>
          
        </Card>
      </div>
    </main>
  );
}
