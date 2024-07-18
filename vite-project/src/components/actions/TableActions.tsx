import { Table } from "@/components/ui/table";
import { useState } from "react";
import { ActionsInteface } from "./ActionsContext";
interface TableActionsProps {
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

export default function TableActions({}: TableActionsProps) {
  const [actions, setActions] = useState<ActionsInteface[]>([]);

  console.log("TABLE ACTIONS", actions);
  return <Table></Table>;
}
