import React, { useState } from "react";
import { ArrowRightLeftIcon, CircleX } from "lucide-react";
import { Button } from "../ui/button";
interface KeyboardProps {
  onKeyPress: (key: string) => void;
  forwarded: boolean;
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, forwarded }) => {
  const [keySequence, setKeySequence] = useState<string[]>([]);

  const keys = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["*", "0", "#"],
  ];

  const handleKeyPress = (key: string) => {
    setKeySequence((prevSequence) => [...prevSequence, key]);
    onKeyPress(key);
  };

  const handleClearKey = () => {
    setKeySequence([]);
  };

  const handleRedirectCall = () => {
    // mt: RedirectCall , btn_id , destination
  };
  return (
    <div className="m-2">
      <div className="w-full flex justify-between m-1 p-1  ">
        <div className="w-full">{keySequence.join(" ")}</div>
        <div className="cursor-pointer" onClick={handleClearKey}>
          <CircleX />
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
            className="flex items-center justify-center cursor-pointer bg-muted text-white rounded-lg p-2"
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
