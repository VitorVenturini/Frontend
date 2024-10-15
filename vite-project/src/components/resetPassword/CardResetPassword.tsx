import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast"; 
import texts from "@/_data/texts.json"; 
import { useLanguage } from "@/components/language/LanguageContext"; 
import LogoCore from "@/assets/LogoCore.svg";
import { Navigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // Ícones de olhinho

export default function CardResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Estado para alternar a visualização da senha
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Estado para alternar a visualização da senha de confirmação
  const { toast } = useToast();
  const { language } = useLanguage();

  const passwordValidation = (password: string) => {
    if (password.length < 6) {
      toast({
        variant: "destructive",
        description: texts[language].complexPasswordRequired,
      });
      return false;
    }

    const specialCharacterRegex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (!specialCharacterRegex.test(password)) {
      toast({
        variant: "destructive",
        description: texts[language].specialCharacterRequired,
      });
      return false;
    }

    return true;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password) {
      toast({
        variant: "destructive",
        description: "Favor Digitar uma senha válida",
      });
      return;
    }

    if (!passwordValidation(password)) return;

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        description: "As senhas não são iguais",
      });
      return;
    }

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        toast({ title: "Sucesso", description: "Senha resetada com sucesso!" });
        return <Navigate to="/Login" />;
      } else {
        setError("Erro ao resetar a senha. Tente novamente.");
      }
    } catch (err) {
      setError("Erro ao resetar a senha. Verifique sua conexão.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <img src={LogoCore} alt="Logo Core" width={250} />
      <form onSubmit={handleResetPassword} className="w-full max-w-md mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Redefinir Senha</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Campo de nova senha */}
            <div className="relative">
              <label htmlFor="password">Nova Senha</label>
              <Input
                type={showPassword ? "text" : "password"} // Alterna entre texto e senha
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a nova senha"
              />
              {/* Botão do olhinho */}
              <button
                type="button"
                className="absolute right-3 top-9"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Campo de confirmação de nova senha */}
            <div className="relative">
              <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme a nova senha"
              />
              {/* Botão do olhinho */}
              <button
                type="button"
                className="absolute right-3 top-9"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <Button type="submit">Redefinir Senha</Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
