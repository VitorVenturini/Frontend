import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  

export default function Conta() {
    return (
        <Card className="mx-[200px]">
  <CardHeader>
    <CardTitle>Configurações de conta</CardTitle>
  </CardHeader>
  <CardContent className="flex flex-col gap-2 ">
            <div className="space-y-1.5 item-center">
              <Label className='text-center'htmlFor="name">Email</Label>
              <Input id="name" placeholder="Email" />
            </div>
            <div className="space-y-1.5 item-center">
              <Label htmlFor="name">Senha</Label>
              <Input id="name" placeholder="Senha" />
            </div>
            <div className="space-y-1.5 item-center">
              <Label htmlFor="framework">Tipo de conta</Label>
              <Select>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Usuario">Usuario</SelectItem>
                </SelectContent>
              </Select>
            </div>
  </CardContent>
  <CardFooter className="flex justify-end
  ">
        <Button >Salvar
                </Button>
      </CardFooter>
</Card>


    )
}