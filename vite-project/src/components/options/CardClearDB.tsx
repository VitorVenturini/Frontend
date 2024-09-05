import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import texts from "@/_data/texts.json";
import { useLanguage } from "@/components/language/LanguageContext";

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
  const { language } = useLanguage();
  return (
    <Card className="w-[630px] h-fit">
      <CardHeader>
        <CardTitle>{texts[language].removeDatabaseHistory}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 py-9">
        <div className="grid grid-cols-2 items-center gap-4">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            {texts[language].endOfPeriod}
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
                {date ? (
                  format(date, "PPP")
                ) : (
                  <span>{texts[language].chooseDate}</span>
                )}
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
        <div className="grid grid-cols-2 items-center gap-4">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              {texts[language].options}
            </h4>
            <Select >
              <SelectTrigger>
                <SelectValue placeholder={texts[language].options} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{texts[language].options}</SelectLabel>
                  <SelectItem value="RptCalls">
                    {texts[language].calls}
                  </SelectItem>
                  <SelectItem value="RptActivities">
                    {texts[language].activities}
                  </SelectItem>
                  <SelectItem value="RptAvailability">
                    {texts[language].availability}
                  </SelectItem>
                  <SelectItem value="RptMessages">
                    {texts[language].messages}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
        </div>

      </CardContent>
      <CardFooter className="flex justify-end">
        <Button>{texts[language].save}</Button>
      </CardFooter>
    </Card>
  );
}
