import { useAccount } from "@/components/AccountContext";

interface User {
    id: string;
    name: string;
    // Adicione outras propriedades do usuário conforme necessário
  }
  
  interface ButtonsGridProps {
    user: User | null;
  }

export default function RightGrid({ user }: ButtonsGridProps) {
  return (
    <div className="gap-7">
        <div className=" gap-6">
            Direita
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
