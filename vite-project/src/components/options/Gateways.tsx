import { DataTableGateways } from "../Gateways/data-tableGateways";
import { useGateways } from "../Gateways/GatewaysContext";
import { GatewaysInterface } from "../Gateways/GatewaysContext";
import { gatewaysCollumns } from "../Gateways/GatewaysCollumns";
import { ScrollArea } from "../ui/scroll-area";
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
    <div className=" w-full max-w-5xl">
      <ScrollArea className="lg:h-[500px] xl:h-[500px] xl2:h-[500px] xl3:h-[600px] xl4:h-[700px] ">
        <DataTableGateways
          columns={gatewaysCollumns}
          data={gateways}
        ></DataTableGateways>
      </ScrollArea>
    </div>
  );
}
