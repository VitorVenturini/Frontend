import { ButtonInterface } from "../buttons/buttonContext/ButtonsContext";
import { SensorInterface } from "../sensor/SensorContext";
import { useButtons } from "../buttons/buttonContext/ButtonsContext";
import texts from "@/_data/texts.json";
import { useLanguage } from "@/components/language/LanguageContext";

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
    languageTexts: {}
  ): string => {
    if (key && key in languageTexts) {
      return languageTexts[key as keyof typeof languageTexts];
    }
    return key || ""; // ou outra mensagem padrão
  };