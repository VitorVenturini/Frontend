import { useRef } from "react";

interface SoundPlayerProps {
  soundSrc: string; // URL do arquivo de som
  play: boolean; // propriedade para determinar quando tocar o som
}

export default function SoundPlayer({ soundSrc, play }: SoundPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // toca o som quando a prop "play" muda para true
  if (play && audioRef.current) {
    audioRef.current.play();
  }

  return (
    <audio ref={audioRef}>
      <source src={soundSrc} type="audio/mpeg" />
      Seu navegador não suporta o elemento de áudio.
    </audio>
  );
}
