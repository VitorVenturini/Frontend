import axios from "axios";

// Função para definir a cor da Busy Light
export async function setBusyLightColor(): Promise<void> {
  try {
    await axios.get("http://localhost:8989/?action=light&red=100&green=0&blue=0");
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      console.warn("Busy Light não disponível.");
    } else {
      console.warn("Erro ao tentar definir a cor da Busy Light:", error.message);
    }
  }
}

// Função para parar a Busy Light
export async function stopBusyLightColor(): Promise<void> {
  try {
    await axios.get("http://localhost:8989/?action=blink");
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      console.warn("Busy Light não disponível.");
    } else {
      console.warn("Erro ao tentar parar a Busy Light:", error.message);
    }
  }
}
