import { Table } from "@/components/ui/table";
import { useState } from "react";
import { GatewaysInterface } from "./GatewaysContext";

interface TableGatewaysProps {
  id: string;
  host: string;
  nickname: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}


export default function TableGateways({}: TableGatewaysProps) {
  const [gateway, setGateway] = useState<GatewaysInterface[]>([]);

  console.log("TABLE Gateways", gateway);
  return <Table></Table>;
}
