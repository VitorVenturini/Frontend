import {
  ButtonInterface,
  useButtons,
} from "@/components/buttons/buttonContext/ButtonsContext";

import { useEffect, useState } from "react";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
import { useAccount } from "@/components/account/AccountContext";
import { commonClasses } from "../ButtonsComponent";
interface ButtonProps {
  button: ButtonInterface;
  handleClick?: () => void;
}

export default function CronometerButton({ button, handleClick }: ButtonProps) {
  const [clickedClass, setClickedClass] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      const id = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
      setIntervalId(id);
    } else if (!isRunning && intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning]);

  const handleStartClick = () => {
    handleClick?.();
    setIsRunning(true);
  };

  const handleStopClick = () => {
    setIsRunning(false);
  };

  const handleRestoreClick = () => {
    setTime(0);
    setIsRunning(false);
  };

  const handleResumeClick = () => {
    setIsRunning(true);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
  };

  return (
    <div
      className={`${commonClasses} flex flex-col justify-between cursor-pointer ${clickedClass}`}
    >
      <p className="text-sm font-medium leading-none text-white xl3:text-lg xl4:text-xl">{button.button_name}</p>
      <div className="font-extrabold xl3:text-2xl xl4:text-3xl font-mono w-[10ch] text-center">{formatTime(time)}</div>
      <div className="flex w-full justify-end">
        {isRunning ? (
          <button
            className="bg-red-500 text-white p-1 px-2 rounded flex justify-end "
            onClick={handleStopClick}
          >
            Parar
          </button>
        ) : (
          <>
            {time === 0 ? (
              <button
                className="bg-green-500 text-white p-1 px-2 rounded "
                onClick={handleStartClick}
              >
                Iniciar
              </button>
            ) : (
              <div className="flex justify-between w-full">
                <button
                  className="bg-gray-500 text-white p-1 px-2 rounded"
                  onClick={handleRestoreClick}
                >
                  Restaurar
                </button>
                <button
                  className="bg-blue-500 text-white p-1 px-2 rounded"
                  onClick={handleResumeClick}
                >
                  Retomar
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}