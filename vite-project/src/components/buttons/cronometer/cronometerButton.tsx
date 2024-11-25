import {
  ButtonInterface,
  useButtons,
} from "@/components/buttons/buttonContext/ButtonsContext";
import { useEffect, useState } from "react";
import { useAccount } from "@/components/account/AccountContext";
import { commonClasses } from "../ButtonsComponent";

interface ButtonProps {
  button: ButtonInterface;
  handleClick?: () => void;
}

export default function CronometerButton({ button, handleClick }: ButtonProps) {
  const [clickedClass, setClickedClass] = useState("");
  const { isAdmin } = useAccount();
  const { setStopCombo, updateButton } = useButtons();
  const [isRunning, setIsRunning] = useState(button.isRunning || false);
  const [time, setTime] = useState(button.time || 0); // O tempo que já passou
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const buttonClass =
    button.button_name.length < 10
      ? "text-md xl3:text-xl xl4:text-3xl"
      : "text-[9px] xl3:text-sm xl4:text-md";

  useEffect(() => {
    if (isRunning && button.startTime) {
      const startTime = button.startTime;
      const elapsedTime = Date.now() - startTime + (button.time || 0);
      setTime(elapsedTime);
      const id = setInterval(() => {
        setTime(Date.now() - startTime + (button.time || 0));
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

  useEffect(() => {
    if (button.comboStart) {
      const startTime = Date.now();
      setIsRunning(true);
      updateButton({ ...button, isRunning: true, startTime });
      setStopCombo(button.id);
    }
  }, [button]);

  const handleStartClick = () => {
    handleClick?.();
    if (!isAdmin && !isRunning) {
      const startTime = Date.now();
      setIsRunning(true);
      updateButton({ ...button, isRunning: true, startTime });
    }
  };

  const handleStopClick = () => {
    setIsRunning(false);
    updateButton({ ...button, isRunning: false, time: time });
  };

  const handleRestoreClick = () => {
    setTime(0);
    setIsRunning(false);
    updateButton({ ...button, isRunning: false, time: 0, startTime: null });
  };

  const handleResumeClick = () => {
    if (!isRunning) {
      const newStartTime = Date.now();
      setIsRunning(true);
      updateButton({ ...button, isRunning: true, startTime: newStartTime });
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}.${String(milliseconds).padStart(2, "0")}`;
  };

  return (
    <div
      className={`${commonClasses} flex flex-col justify-between cursor-pointer ${clickedClass}`}
    >
      <p className={`font-medium leading-none text-white ${buttonClass}`}>
        {button.button_name}
      </p>
      <div className="font-extrabold xl3:text-2xl xl4:text-3xl font-mono w-[10ch] text-center">
        {formatTime(time)}
      </div>
      <div className="flex w-full justify-end">
        {isRunning ? (
          <button
            className="bg-red-500 text-white p-1 px-2 rounded lg:text-[10px] xl3:text-lg flex justify-end"
            onClick={handleStopClick}
          >
            Parar
          </button>
        ) : (
          <>
            {time === 0 ? (
              <button
                className="bg-green-500 text-white lg:text-[10px] xl3:text-lg p-1 px-2 rounded"
                onClick={handleStartClick}
              >
                Iniciar
              </button>
            ) : (
              <div className="flex justify-between w-full">
                <button
                  className="bg-gray-500 text-white p-1 lg:text-[10px] xl3:text-md px-2 rounded"
                  onClick={handleRestoreClick}
                >
                  Restaurar
                </button>
                <button
                  className="bg-blue-500 text-white p-1 lg:text-[10px] xl3:text-md px-2 rounded"
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
