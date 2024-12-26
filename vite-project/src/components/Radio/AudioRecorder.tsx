import React, { useState, useRef } from "react";
import { Button } from "../ui/button";
import { MicOff } from "lucide-react";
import { Mic } from "lucide-react";

const AudioRecorder = () => {
    const [recording, setRecording] = useState(false);
    const [audioURL, setAudioURL] = useState(null);
    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null); // Novo: para armazenar o stream de áudio
    const audioChunksRef = useRef([]);
  
    const startRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  
        // Armazena o stream para liberar depois
        streamRef.current = stream;
  
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
  
        audioChunksRef.current = []; // Limpa gravações antigas
  
        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };
  
        mediaRecorder.onstop = () => {
          // Cria o blob do áudio
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/mp3" });
          const url = URL.createObjectURL(audioBlob);
          setAudioURL(url);
  
          // Para o uso do microfone (libera o recurso)
          streamRef.current.getTracks().forEach((track) => track.stop());
        };
  
        mediaRecorder.start();
        setRecording(true);
      } catch (error) {
        console.error("Error accessing microphone:", error);
        alert("Não foi possível acessar o microfone.");
      }
    };
  
    const stopRecording = () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        setRecording(false);
      }
    };

  return (
    <div>
      <h2>Basic RoIP</h2>
      {recording ? (
        <Button onClick={stopRecording} size="icon">
          <MicOff />
        </Button>
      ) : (
        <Button onClick={startRecording} size="icon">
          <Mic />
        </Button>
      )}
      {audioURL && (
        <div>
          <h3>Playback</h3>
          <audio src={audioURL} controls />
          <a href={audioURL} download="recording.mp3">
            Download Audio
          </a>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
