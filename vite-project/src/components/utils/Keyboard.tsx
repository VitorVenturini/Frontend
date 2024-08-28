import React, { useState } from "react";
import { CircleX } from "lucide-react";
interface KeyboardProps {
  onKeyPress: (key: string) => void;
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress }) => {
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
    setKeySequence([])
  }
  return (
    <div className="m-2">
      <div className="w-full flex justify-between m-1 p-1  ">
        <div className="w-full">{keySequence.join(" ")}</div>
        <div className="cursor-pointer" onClick={handleClearKey}><CircleX/></div>
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
    </div>
  );
};

export default Keyboard;
