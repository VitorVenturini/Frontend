import React, { useState, useRef } from "react";
import { Button } from "../ui/button";
import { CameraOffIcon, CameraIcon } from "lucide-react";

const VideoRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [videoURL, setVideoURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const videoChunksRef = useRef([]);
  const videoElementRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;

      // Exibe a câmera em tempo real
      if (videoElementRef.current) {
        videoElementRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      videoChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        videoChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(videoChunksRef.current, { type: "video/mp4" });
        const url = URL.createObjectURL(videoBlob);
        setVideoURL(url);

        // Encerra o stream
        streamRef.current.getTracks().forEach((track) => track.stop());
        if (videoElementRef.current) {
          videoElementRef.current.srcObject = null;
        }
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error("Error accessing camera or microphone:", error);
      alert("Não foi possível acessar a câmera/microfone.");
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

      <div style={{ marginTop: "10px" }}>
        {recording ? (
          <Button onClick={stopRecording} size="icon">
            <CameraOffIcon />
          </Button>
        ) : (
          <Button onClick={startRecording} size="icon">
            <CameraIcon />
          </Button>
        )}
      </div>
      <h2>Video Recorder</h2>
      <div>
        <video ref={videoElementRef} autoPlay muted style={{ width: "100%", height: "auto", border: "1px solid black" }} />
      </div>
      {videoURL && (
        <div>
          <h3>Playback</h3>
          <video src={videoURL} controls style={{ width: "100%", height: "auto" }} />
          <a href={videoURL} download="recording.mp4">
            Download Video
          </a>
        </div>
      )}
    </div>
  );
};

export default VideoRecorder;
