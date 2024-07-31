import { Button } from "../ui/button";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";


export default function Reports() {
  const handleClick = () => {
    console.log("click report");
    report();
  };
  const wss = useWebSocketData();

  const report = async () => {
    console.log(`ENVIO AO BACKEND RELATÓRIO`);
    wss?.sendMessage({
      api: "admin",
      mt: "SelectFromReports",
      src: "RptAvailability",
      //deveui: "24e124725d487636",
      guid: "8166533266978258155",
      from: "2024-07-17T00:00:00:000",
      to: "2024-07-22T23:59:59:000",
    });
  };

  return <Button onClick={handleClick}> Relatório </Button>;
}
