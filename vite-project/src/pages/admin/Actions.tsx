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
    <div>
      {/* @ts-ignore */}
        <TableActions columns={actions as any} data={actions}></TableActions>
    </div>
  );
}
