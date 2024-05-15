import { useAccount } from "@/components/AccountContext";

interface User {
    id: string;
    name: string;
    // Adicione outras propriedades do usuário conforme necessário
  }
  
  interface ButtonsGridProps {
    user: User | null;
  }

export default function LesftGrid({ user }: ButtonsGridProps) {
  return (
    <div className="gap-7">
        <div className=" gap-6">
            Esquerda
        {user &&
          Object.entries(user).map(([key, value]) => (
            <p key={key}>
              {key}: {value}
            </p>
          ))}
      </div>
    </div>
  );
}
