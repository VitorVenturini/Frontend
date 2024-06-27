
import TableActions from "@/components/TableActions";
import { useActions } from "@/components/ActionsContext";

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
