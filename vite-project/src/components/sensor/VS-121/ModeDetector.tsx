export type SensorModes = "LINE_CROSSING" | "PEOPLE_FLOW_ANALYSIS" | "REGION_PEOPLE_COUNTING";

interface SensorModeResult {
  mode: SensorModes;
  availableParams: string[];
}

export default function ModeDetector(valueKeys: string[]): SensorModeResult | null {
  // parametros de cada modo do sensor
  const LINE_CROSSING_KEYS = ["people_in", "people_out", "people_total_in", "people_total_out"];
  const PEOPLE_FLOW_ANALYSIS_KEYS = [
    "a_to_a", "a_to_b", "a_to_c", "a_to_d",
    "b_to_a", "b_to_b", "b_to_c", "b_to_d",
    "c_to_a", "c_to_b", "c_to_c", "c_to_d",
    "d_to_a", "d_to_b", "d_to_c", "d_to_d"
  ];
  const REGION_PEOPLE_COUNTING_KEYS = ["people_count_all", "region_count", "people_count_max"];

  // Função auxiliar para verificar se todas as chaves de um módulo estão presentes no array de chaves recebido
  const hasAllKeys = (requiredKeys: string[]) => requiredKeys.every(key => valueKeys.includes(key));

  // Detecta o modo do sensor com base nas chaves recebidas
  if (hasAllKeys(LINE_CROSSING_KEYS)) {
    return { mode: "LINE_CROSSING", availableParams: LINE_CROSSING_KEYS };
  } else if (hasAllKeys(PEOPLE_FLOW_ANALYSIS_KEYS)) {
    return { mode: "PEOPLE_FLOW_ANALYSIS", availableParams: PEOPLE_FLOW_ANALYSIS_KEYS };
  } else if (hasAllKeys(REGION_PEOPLE_COUNTING_KEYS)) {
    return { mode: "REGION_PEOPLE_COUNTING", availableParams: REGION_PEOPLE_COUNTING_KEYS };
  } else {
    return null; // Retorna null se o modo não for identificado
  }
}
