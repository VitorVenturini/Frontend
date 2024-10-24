import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "../ui/scroll-area";

import { AccountContext } from "@/components/account/AccountContext";
import { useContext } from "react";
import {
  DeviceInterface,
  useUsersPbx,
} from "../users/usersPbx/UsersPbxContext";
import { useUsers } from "../users/usersCore/UserContext";
import { Button } from "../ui/button";
import { useWebSocketData } from "../websocket/WebSocketProvider";
import { Phone } from "lucide-react";
import { useToast } from "../ui/use-toast";

interface ModalDevicesProps {
  numberToCall: string;
  onCallSuccess: () => void;
}
export default function ModalDevices({
  numberToCall,
  onCallSuccess,
}: ModalDevicesProps) {
  const { guid } = useContext(AccountContext);
  const { usersPbx } = useUsersPbx();
  const { users } = useUsers();
  const wss = useWebSocketData();
  const { toast } = useToast();

  const myUser = users.filter((user) => {
    return user.guid === guid;
  })[0];

  const filteredDevices = usersPbx.filter((userPbx) => {
    return userPbx.guid === myUser.sip;
  })[0];

  const handleSelectDevice = (device: DeviceInterface) => {
    if (device.state === "online") {
      wss?.sendMessage({
        api: "user",
        mt: "TriggerCall",
        device: device.hw,
        num: numberToCall,
      });
      onCallSuccess();
    } else {
      toast({
        variant: "destructive",
        description: "Dispositivo Indisponível",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex">
        <CardTitle>Selecione o Dispositivo</CardTitle>
        <CardDescription>
          Escolha um dispositivo para realizar a ligação
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-full ">
          {filteredDevices?.devices?.map((device) => (
            <Button
              key={device.hw}
              onClick={() => handleSelectDevice(device)}
              className={`gap-2  ${
                device.state === "online"
                  ? "bg-green-600 hover:bg-green-600/60"
                  : "bg-gray-600"
              }  mx-1 mb-2 w-full`}
            >
              <Phone />
              {device.text}
            </Button>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
