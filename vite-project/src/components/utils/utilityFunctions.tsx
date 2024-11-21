import { ButtonInterface } from "../buttons/buttonContext/ButtonsContext";
import { useState, useEffect } from "react";
import { UserInterface } from "../users/usersCore/UserContext";
import { SensorInterface } from "../sensor/SensorContext";

export const isTouchDevice = () => {
  return (
    "ontouchstart" in window || // Verifica se o evento de toque é suportado
    navigator.maxTouchPoints > 0
  );
};

export const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

function getDegreeRange(direction: string) {
  switch (direction) {
    case "N":
      return { min: 0, max: 22.5 };
    case "NE":
      return { min: 22.5, max: 67.5 };
    case "E":
      return { min: 67.5, max: 112.5 };
    case "SE":
      return { min: 112.5, max: 157.5 };
    case "S":
      return { min: 157.5, max: 202.5 };
    case "SW":
      return { min: 202.5, max: 247.5 };
    case "W":
      return { min: 247.5, max: 292.5 };
    case "NW":
      return { min: 292.5, max: 337.5 };
    default:
      return { min: 0, max: 0 };
  }
}
export function limitButtonName(name: string) {
  return name.slice(0, 10);
}

function isWithinRange(value: number, min: number, max: number) {
  if (min <= max) {
    return value >= min && value <= max;
  } else {
    // Handle the case where the range crosses 0 degrees (e.g., min=SE (157.5), max=E (67.5))
    return value >= min || value <= max;
  }
}
// função para verificar os botões que estão alarmados
export function checkButtonWarning(
  button: ButtonInterface,
  newValue: number | undefined
): boolean {
  if (button?.sensor_type) {
    if (button.sensor_type === "wind_direction") {
      const windRangeMin =
        button.sensor_min_threshold !== undefined
          ? getDegreeRange(button.sensor_min_threshold as string).min
          : undefined;
      const windRangeMax =
        button.sensor_max_threshold !== undefined
          ? getDegreeRange(button.sensor_max_threshold as string).max
          : undefined;

      if (
        newValue !== undefined &&
        windRangeMax !== undefined &&
        windRangeMin !== undefined &&
        !isWithinRange(newValue, windRangeMin, windRangeMax)
      ) {
        return true;
      }
    } else {
      // quando nao for wind_direction
      const maxThreshold = button.sensor_max_threshold
        ? parseInt(button.sensor_max_threshold, 10)
        : undefined;
      const minThreshold = button.sensor_min_threshold
        ? parseInt(button.sensor_min_threshold, 10)
        : undefined;

      if (
        // if para quando for threshold que necessitam de comparação tipo co2, umidade, temperatura, etc.
        (maxThreshold !== undefined &&
          maxThreshold !== 0 &&
          maxThreshold !== 1 &&
          newValue &&
          newValue > maxThreshold) ||
        (minThreshold !== undefined &&
          minThreshold !== 0 &&
          minThreshold !== 1 &&
          newValue &&
          newValue < minThreshold)
      ) {
        return true;
      } else if (
        // else if para quando for valores 0 e 1
        newValue == maxThreshold
      ) {
        return true;
      } else if (button.triggered) {
        // caso específico para o botão vermelho
        return true;
      } else {
        // quando nao está alarmando
        return false;
      }
    }
  }
  return false;
}
//função para o typeScript parar de encher o saco
export const getText = (
  key: string | undefined,
  languageTexts: {} = {}
): string => {
  if (key && languageTexts && key in languageTexts) {
    return languageTexts[key as keyof typeof languageTexts];
  }
  return key || ""; // Retorna a chave ou uma mensagem padrão
};

export function generateAvatar(initials: string, size: number = 64): string {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = size;
  canvas.height = size;

  // Define o fundo do ícone (cor clara)
  context!.fillStyle = "#F0F0F0";
  context!.fillRect(0, 0, size, size);

  // Define a cor do texto (cor escura) e o estilo
  context!.fillStyle = "#333333";
  context!.font = `${size / 2}px Arial`;
  context!.textAlign = "center";
  context!.textBaseline = "middle";

  // Desenha as iniciais no centro da imagem
  context!.fillText(initials, size / 2, size / 2);

  // Converte o canvas em uma imagem base64
  return canvas.toDataURL();
}

export function getInitials(name: string): string | null {
  if (name) {
    const nameParts = name.split(" ");
    const initials = nameParts
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
    return initials.substring(0, 2); // Retorna apenas as primeiras duas letras
  } else {
    return null;
  }
}
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handleChange = () => setMatches(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
};
export const replaceDataForName = (
  users: UserInterface[],
  guidOrEuid: string,
  sensors: SensorInterface[]
): string | undefined => {
  const user = users?.filter((user) => {
    return user.guid === guidOrEuid;
  })[0];

  if (user) {
    return user.name;
  }
  const sensor = sensors?.filter((sensor) => {
    return sensor.deveui === guidOrEuid;
  })[0];
  if (sensor) {
    return sensor.sensor_name;
  }

  return guidOrEuid;
};
export const filterButtonByID = (
  btnID: string,
  buttons: ButtonInterface[]
): string | undefined => {
  const button = buttons.filter((btn: ButtonInterface) => {
    return String(btn.id) === btnID;
  })[0];

  if (button) {
    return button.button_name;
  }
};

export function isBase64File(base64String: string): boolean {
  //regex dus guri p verificar se é base64
  const base64Pattern = /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/;

  return base64Pattern.test(base64String);
}
