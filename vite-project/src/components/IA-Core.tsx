// CoreIA.tsx
import { useEffect } from "react";
import { useLanguage } from "./language/LanguageContext";
import { useWebSocketData } from "./websocket/WebSocketProvider";

interface CoreIAProps {
    language: string;
}

// Função speak exportável
export function speak(text: string, language: string) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language;
  window.speechSynthesis.speak(utterance);
}

export default function CoreIA({language} : CoreIAProps) {
  const wss = useWebSocketData();

  function startRecognition() {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = language;
    recognition.interimResults = false;
    recognition.continuous = true;

    let isActivated = false;

    recognition.onresult = (event) => {
      const command =
        event.results[event.results.length - 1][0].transcript.toLowerCase();
      console.log("Comando capturado:", command);

      if (isActivationPhrase(command)) {
        isActivated = true;
        sendVoiceCommand(command); // Envia a frase de ativação ao backend
      } else if (isActivated) {
        // sendVoiceCommand(command); // Envia o comando para o backend
        isActivated = false;
      }
    };

    recognition.onerror = (event) =>
      console.error("Erro no reconhecimento de voz:", event);

    recognition.start();
  }

  function isActivationPhrase(command: string) {
    const activationPhrases = [
      "c.o.r.e",
      "core",
      "cor",
      "cór",
      "oi core",
      "ei core",
      "hey core",
      "ola core",
      "oi cor",
      "ola cor",
      "ei cor",
      "olá cor",
    ];
    return activationPhrases.some((phrase) => command.includes(phrase));
  }

  function sendVoiceCommand(command: string) {
    wss?.sendMessage({
      api: "user",
      mt: "ActivationVoice",
      voiceText: command,
    });
  }

  useEffect(() => {
    startRecognition();
  }, []);

  return null; // Sem retorno visual
}
