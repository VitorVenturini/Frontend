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
    const account = useAccount();
    const wss = useWebSocketData();
    const [isRunning, setIsRunning] = useState(false);
    const [time, setTime] = useState(0);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

    
  
  

    useEffect(() => {
      if (isRunning) {
        const id = setInterval(() => {
          setTime((prevTime) => prevTime + 1);
        }, 1000);
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
  
    const handleButtonClick = () => {
      handleClick?.();
  
      if (!account.isAdmin) {
        if (isRunning) {
          setIsRunning(false);
        } else {
          if (time !== 0) {
            setTime(0);
          }
          setIsRunning(true);
        }
      }
    };
  
    const formatTime = (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };
    return (
      <div
      className={`${commonClasses} flex flex-col justify-between cursor-pointer ${
        isRunning ? 'bg-green-700' : 'bg-red-700'
      } ${clickedClass}`}
      onClick={handleButtonClick}
    >
      <p className="text-sm font-medium leading-none text-white xl3:text-xl xl4:text-2xl">{button.button_name}</p>
      {isRunning ? 'Parar' : time === 0 ? 'Iniciar' : 'Reiniciar'}
      <div className="font-extrabold text-3xl font-mono w-[10ch] text-center">{formatTime(time)}</div>
    </div>
    );
  };
  