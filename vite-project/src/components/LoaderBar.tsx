import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";

export interface LoaderBarProps {
  total: number;
  unitValue: number;
}

export function LoaderBar({ total, unitValue }: LoaderBarProps) {
  const [progress, setProgress] = useState<number>();

  console.log('LoaderBar Props:', { total, unitValue }); // Log para depuração

  useEffect(() => {
    if (total > 0 && unitValue > 0) {
      const percentage = (unitValue / total) * 100;
      setProgress(percentage);
    }
  }, [total, unitValue]);

  // Somente renderizar o LoaderBar se os valores forem válidos
  if (total === 0 || unitValue === 0) {
    return null;  // Não renderiza o componente se ainda não recebeu dados válidos
  }

  return <Progress value={progress} className="w-[60%]" />;
}
