import { SensorInterface } from "@/components/sensor/SensorContext"; // ajuste o caminho conforme necessário

export type SensorModes = "LINE_CROSSING" | "PEOPLE_FLOW_ANALYSIS" | "REGION_PEOPLE_COUNTING";

export interface SensorModeResult {
  mode: SensorModes;
  availableParams: Partial<SensorInterface>;
}

export default function ModeDetector(valueKeys: string[]): SensorModeResult | null {
  const LINE_CROSSING_KEYS = ["people_in", "people_out", "people_total_in", "people_total_out"];
  const PEOPLE_FLOW_ANALYSIS_KEYS = [
    "a_to_a", "a_to_b", "a_to_c", "a_to_d",
    "b_to_a", "b_to_b", "b_to_c", "b_to_d",
    "c_to_a", "c_to_b", "c_to_c", "c_to_d",
    "d_to_a", "d_to_b", "d_to_c", "d_to_d",
  ];
  const REGION_PEOPLE_COUNTING_KEYS = ["people_count_all", "region_count", "people_count_max"];


  const hasAnyKey = (requiredKeys: string[]) =>
    requiredKeys.some((key) => valueKeys.includes(key));

  const mapKeysToSensorInterface = (keys: string[]): Partial<SensorInterface> => {
    const result: Partial<SensorInterface> = {};
    keys.forEach((key) => {
      result[key as keyof SensorInterface] = null;
    });
    return result;
  };

  // Detectar o modo do sensor com base na presença de pelo menos uma chave do array de chaves específicas
  if (hasAnyKey(LINE_CROSSING_KEYS)) {
    return { mode: "LINE_CROSSING", availableParams: mapKeysToSensorInterface(LINE_CROSSING_KEYS) };
  } else if (hasAnyKey(PEOPLE_FLOW_ANALYSIS_KEYS)) {
    return { mode: "PEOPLE_FLOW_ANALYSIS", availableParams: mapKeysToSensorInterface(PEOPLE_FLOW_ANALYSIS_KEYS) };
  } else if (hasAnyKey(REGION_PEOPLE_COUNTING_KEYS)) {
    return { mode: "REGION_PEOPLE_COUNTING", availableParams: mapKeysToSensorInterface(REGION_PEOPLE_COUNTING_KEYS) };
  } else {
    return null;
  }
}
