import { HistoryInterface } from "./HistoryContext";
import { getText, isBase64File } from "../utils/utilityFunctions";
import { Badge } from "@/components/ui/badge";
import { cva } from "class-variance-authority";
import { useLanguage } from "@/components/language/LanguageContext";
import texts from "@/_data/texts.json";
import { format, parseISO } from "date-fns";
import { HistoryIcon, Image, ImageIcon } from "lucide-react";
import {
  ButtonInterface,
  useButtons,
} from "../buttons/buttonContext/ButtonsContext";
import { SensorInterface, useSensors } from "../sensor/SensorContext";
import { handleSensorSpecificValue } from "../sensor/SensorResponsiveInfo";
import { PlayIcon, DownloadIcon, PauseIcon } from "lucide-react";
import React, { useRef, useState } from "react";
import { Button } from "../ui/button";
import { host } from "@/App";
import { AudioPlayer } from "react-audio-player-component"; // Substitua pela biblioteca de áudio que você está usando

interface HistoryCellProps {
  historyInfo: HistoryInterface;
}

const calculateDuration = (
  connected: string | null,
  ended: string | null
): string => {
  if (!connected || !ended) return "00:00"; // Garantir que as datas sejam válidas

  const start = new Date(connected);
  const end = new Date(ended);
  const durationInMs = end.getTime() - start.getTime(); // Diferença em milissegundos
  const durationInSeconds = Math.floor(durationInMs / 1000); // Converter para segundos

  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = durationInSeconds % 60;

  // Formatar para mm:ss
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
};

const ButtonCircles = ({ type }: { type: string }) => {
  const splitedType = type.split("_");
  if (type.startsWith("press_short")) {
    return (
      <span className="flex items-center gap-2">
        <span className="w-4 h-4 bg-white rounded-full"></span>
        {splitedType[2] && <span>nº {splitedType[2]} </span>}
      </span>
    );
  } else if (type.startsWith("press_double")) {
    return (
      <span className="flex items-center gap-1">
        <span className="w-4 h-4 bg-white rounded-full"></span>
        <span className="w-4 h-4 bg-white rounded-full"></span>
        {splitedType[2] && <span>nº {splitedType[2]} </span>}
      </span>
    );
  } else if (type.startsWith("press_long")) {
    return (
      <span className="flex items-center gap-2">
        <span className="w-10 h-4 bg-white rounded-full"></span>
        {splitedType[2] && <span>nº {splitedType[2]} </span>}
      </span>
    );
  } else {
    return null;
  }
};

export const createHistoryContent = (
  name: string,
  status?: string,
  prt?: string,
  language?: string,
  details?: ButtonInterface | any
) => {
  let badgeVariant: string =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ";
  let content: string | JSX.Element;
  let statusValue: any;
  const translatedPrt = prt ? getText(prt, texts[language]) : "";
  const translatedStatus = status ? getText(status, texts[language]) : "";
  switch (name) {
    case "message":
      badgeVariant +=
        "border-transparent bg-blue-900 text-blue-100 hover:bg-blue-800";
      content = isBase64File(translatedPrt) ? (
        <span style={{ display: "flex", alignItems: "center" }}>
          <Image size={16} style={{ marginRight: "5px" }} />
          Imagem
        </span>
      ) : (
        `${translatedPrt?.slice(0, 20)}...`
      );
      statusValue = translatedStatus;
      break;
    case "alarm":
      badgeVariant +=
        "border-transparent bg-yellow-900 text-yellow-100 hover:bg-yellow-800";
      content = translatedPrt;
      statusValue = translatedStatus;
      break;
    case "threshold":
      badgeVariant +=
        "border-transparent bg-red-900 text-red-100 hover:bg-red-800";
      content = details?.sensor_type;
      statusValue = handleSensorSpecificValue(
        details?.sensor_type,
        parseInt(translatedPrt),
        details
      ).formattedValue;
      // translatedPrt nesse caso é o valor atual do sensor
      break;
    case "button":
      if (prt?.startsWith("press_")) {
        badgeVariant +=
          "border-transparent bg-purple-900 text-red-100 hover:bg-purple-800";
        content = <ButtonCircles type={prt} />;
        statusValue = translatedStatus;
      }
      break;
      case "call":
        badgeVariant +=
          "border-transparent bg-green-900 text-green-100 hover:bg-green-800";
        content = translatedPrt;
        statusValue = translatedStatus;
        break
    default:
      badgeVariant +=
        "border-transparent bg-gray-900 text-gray-100 hover:bg-gray-800";
      content = translatedPrt;
      statusValue = translatedStatus;
  }

  return { badgeVariant, content, statusValue };
};

export default function ResponsiveHistoryInfo({
  historyInfo,
}: HistoryCellProps) {
  const { language } = useLanguage();
  const { buttons } = useButtons();
  const { buttonSensors } = useSensors();

  const details = historyInfo.details;
  const recordLink = details.record_link;
  const isLinkAvailable = recordLink;
  const duration = calculateDuration(
    details.call_connected,
    details.call_ended
  );
  const AudioPlayerButton = ({ audioSrc }: { audioSrc: string }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const toggleAudioPlayback = () => {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          audioRef.current.play();
          setIsPlaying(true);
        }
      }
    };
    const handleAudioEnd = () => {
      setIsPlaying(false);
    };

    return (
      <div>
        <audio
          ref={audioRef}
          src={audioSrc}
          preload="auto"
          onEnded={handleAudioEnd}
        />
        <Button
          variant="ghost"
          size="icon"
          disabled={!isLinkAvailable}
          onClick={toggleAudioPlayback}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </Button>
      </div>
    );
  };
  console.log("historyInfo", historyInfo);
  const truncatedPrt =
    historyInfo?.prt?.length > 20
      ? `${historyInfo?.prt.slice(0, 20)}...`
      : historyInfo?.prt;

  let formattedDate = "";
  if (historyInfo.date) {
    formattedDate = format(new Date(historyInfo.date), "dd/MM HH:mm");
  }

  return (
    <>
      <div className=" flex justify-between rounded-md my-2 items-center px-2 py-1">
        <div className="flex items-center gap-1 capitalize">
          <span
            className={
              createHistoryContent(historyInfo?.name, null, historyInfo?.prt)
                .badgeVariant
            }
          >
            {historyInfo?.name
              ? getText(historyInfo?.name, texts[language])
              : historyInfo?.name}
          </span>
          {!recordLink && (
            <p className="text-sm font-black ">
              {truncatedPrt
                ? createHistoryContent(
                    historyInfo?.name,
                    historyInfo?.status,
                    historyInfo?.prt,
                    language,
                    historyInfo?.details
                  ).content
                : truncatedPrt}
            </p>
          )}

          <p className="text-sm capitalize ">
            {historyInfo.status
              ? createHistoryContent(
                  historyInfo?.name,
                  historyInfo?.status,
                  historyInfo?.prt,
                  language,
                  historyInfo?.details
                ).statusValue
              : historyInfo?.status}
          </p>
          {historyInfo.name === "call" && (
            <div className="flex justify-between rounded-md my-2 items-center px-2 py-1">
              <div className="flex items-center gap-1 capitalize">
                <p className="text-sm font-bold">{getText('durationTxt', texts[language]) + duration}</p>
              </div>
            </div>
          )}
          {recordLink && (
            <div >
              {isLinkAvailable ? (
                <div className="flex justify-stretch p-1">
                <AudioPlayerButton audioSrc={`${host}${recordLink}`} />
                <Button
                variant="ghost"
                size="icon"
              >
                <a
                  href={`${host}${recordLink}`}
                  download
                  onClick={(e) => {
                    if (!isLinkAvailable) {
                      e.preventDefault();
                      // Previne o comportamento padrão se o link não estiver disponível
                    }
                  }}
                >
                  <DownloadIcon />
                </a>
              </Button>
              </div>
              ) : (
                getText('noAudio', texts[language])
              )}
              
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground text-wrap mr-2">
          {formattedDate}
        </p>
      </div>
    </>
  );
}
