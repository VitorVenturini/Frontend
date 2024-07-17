import { DataTableGateways } from "../Gateways/data-tableGateways";
import { useGateways } from "../Gateways/GatewaysContext";
import { GatewaysInterface } from "../Gateways/GatewaysContext";
import { gatewaysCollumns } from "../Gateways/GatewaysCollumns";
interface Gateways {
  id: string;
  host: string;
  nickname: string;
  user: string;
  createdAt: string;
  create_user: string;
  updatedAt: string;
}

export default function Gateways() {
  const { gateways } = useGateways();

  console.log("GATEWAYS CARD", gateways);

  return (
    <div className="bg-card w-full max-w-5xl">
      <div>
        <DataTableGateways
          columns={gatewaysCollumns}
          data={gateways}
        ></DataTableGateways>
      </div>
    </div>
  );
}
