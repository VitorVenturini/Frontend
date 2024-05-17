import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  
  import { Label } from "@/components/ui/label";
  import * as React from "react";
  import { format } from "date-fns";
  import { Calendar as CalendarIcon } from "lucide-react";
  
  import { cn } from "@/lib/utils";
  import { Button } from "@/components/ui/button";
  import { Calendar } from "@/components/ui/calendar";
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover";
  
  import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  
  export default function CardClearDB() {
    const [date, setDate] = React.useState<Date>();
    return (
      <Card className="min-w-[00px] h-fit">
        <CardHeader>
          <CardTitle>Remover histórico do banco de dados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full flex flex-col gap-5">
            <div className="flex items-center justify-between gap-3">
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                Fim do período
              </h4>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Escolha uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
  
            <div className="flex items-center justify-between gap-3">
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                Opções
              </h4>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Opções" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Opções</SelectLabel>
                    <SelectItem value="RptCalls">Chamadas</SelectItem>
                    <SelectItem value="RptActivities">Atividades</SelectItem>
                    <SelectItem value="RptAvailability">
                      Disponibilidade
                    </SelectItem>
                    <SelectItem value="RptMessages">Mensagens</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
        <Button>Salvar</Button>
        </CardFooter>
      </Card>
    );
  }