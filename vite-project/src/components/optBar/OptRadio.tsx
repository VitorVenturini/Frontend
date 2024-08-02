
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { ButtonInterface } from "@/components/buttons/buttonContext/ButtonsContext";

  interface OptRadioProps {
    clickedButton: ButtonInterface;
  }

  export default function OptRadio({ clickedButton }: OptRadioProps) {       
  return (
    <Card className="h-full">
    Em breve
    </Card>
  )
}