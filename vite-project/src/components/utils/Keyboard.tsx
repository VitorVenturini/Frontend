import React, { useState } from "react";
import { ArrowRightLeftIcon, CircleX, Delete } from "lucide-react";
import { Button } from "../ui/button";
import { useWebSocketData } from "../websocket/WebSocketProvider";
import { ButtonInterface } from "../buttons/buttonContext/ButtonsContext";
import { CallsInterface } from "../calls/CallContext";

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  forwarded: boolean;
   call: CallsInterface
}

const Keyboard: React.FC<KeyboardProps> = ({
  onKeyPress,
  forwarded,
call,
}) => {
  const [keySequence, setKeySequence] = useState<string[]>([]);
  const wss = useWebSocketData();
  const keys = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["*", "0", "#"],
  ];

  const handleKeyPress = (key: string) => {
    setKeySequence((prevSequence) => [...prevSequence, key]);
    onKeyPress(key);
    if (!forwarded && call.type === "incoming") {
      wss?.sendMessage({
        api: "user",
        mt: "SendDtmfDigitsIncomingCall",
        digit: key,
        device: call?.device,
        call: call.callId,
      });
    } else if (!forwarded && call.type !== "incoming" && call.type !== "buttonCall") {
      wss?.sendMessage({
        api: "user",
        mt: "SendDtmfDigits",
        digit: key,
        device: call?.device,
        call: call?.callId,
      });
    } else if (!forwarded && call.type !== "incoming" && call.type !== "dialpad") {
      wss?.sendMessage({
        api: "user",
        mt: "SendDtmfDigits",
        digit: key,
        btn_id: call?.btn_id,
      });
    }
  };

  const handleClearKey = () => {
    setKeySequence([]);
  };

  const handleRedirectCall = () => {
    if (call.type === "incoming") {
      wss?.sendMessage({
        api: "user",
        mt: "RedirectIncomingCall",
        device: call?.device,
        call: call.callId,
        destination: keySequence.join(""),
      });
    } else if(call.type === "dialpad"){
      wss?.sendMessage({
        api: "user",
        mt: "RedirectCall",
        device: call?.device,
        call: call.callId,
        destination: keySequence.join(""),
      });
    } else{
      wss?.sendMessage({
        api: "user",
        mt: "RedirectCall",
        btn_id: call?.btn_id,
        destination: keySequence.join(""),
      });
    }

    // mt: RedirectCall , btn_id , destination
  };
  return (
    <div className="m-2">
      <div className="w-full flex justify-between m-1 p-1  ">
        <div className="w-full">{keySequence.join(" ")}</div>
        <div className="cursor-pointer" onClick={handleClearKey}>
          <Delete />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 ">
        {keys.flat().map((key) => (
          <button
            key={key}
            className="text-bold p-2 bg-muted rounded-xl"
            onClick={() => handleKeyPress(key)}
          >
            {key}
          </button>
        ))}
      </div>
      {forwarded && (
        <div className="mt-4 flex justify-center ">
          <Button
            className="flex items-center justify-center cursor-pointer bg-muted text-white rounded-lg "
            onClick={handleRedirectCall}
          >
            <div className="flex flex-col items-center">
              <ArrowRightLeftIcon />
              Transferir
            </div>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Keyboard;
