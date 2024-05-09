import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Login() {
    return (
        <Card className="mx-[200px]">
  <CardHeader>
    <CardTitle>Faça seu Login</CardTitle>
    <CardDescription>Digite seu Email e Senha</CardDescription>
  </CardHeader>
  <CardContent className="gap-x-1">
  <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Email</Label>
              <Input id="name" placeholder="Email" />
            </div>
            <div className="flex flex-col space-y-1.5">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Senha</Label>
              <Input id="name" placeholder="Senha" />
            </div>
            </div>
          </div>
        </form>
  </CardContent>
  <CardFooter className="flex justify-between">
        <Button variant="outline">Mudar senha</Button>
        <Button asChild >
                <a href="/Home">Login</a>
                </Button>
      </CardFooter>
</Card>

    )
}