import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Ghost } from "lucide-react";
import { ChangeEvent, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import TableActions from "@/components/actions/TableActions";
import { useActions } from "@/components/actions/ActionsContext";

//  interface User {
//     id: string;
//     name: string;
//   }
interface Actions {
  id: string;
  action_name: string;
  action_alarm_code: string;
  action_start_type: string;
  action_prt: string;
  action_user: string;
  action_type: string; // o ? significa que o valor nao precisa ser presente , se for nulo nao tem problema
  action_device?: string | null;
  action_sensor_name?: string | null;
  action_sensor_type?: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function Actions() {
  // const [users, setUsers] = useState<User[]>([]);
  // const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const actions = useActions();

  // implementar lógica do backend para consultar ações do usuário
  return (
    <div className="bg-card">
      <div>
        <TableActions columns={actions} data={actions}></TableActions>
      </div>
    </div>
  );
}
