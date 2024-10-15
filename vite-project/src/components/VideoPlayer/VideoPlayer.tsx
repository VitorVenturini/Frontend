import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Button } from "../ui/button";
import { useAccount } from "../account/AccountContext";
import { host } from "@/App";
interface VideoPlayerProps {
  url: string;
  open: boolean;
}

export default function VideoPlayer({ url, open }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [blobMedia, setBlobMedia] = useState<Blob[]>([]); // Inicializa o estado como um array de blobs
  const [isRecording, setIsRecording] = useState(false);
  const [fileName, setFileName] = useState("video_" + Date.now());
  const account = useAccount();

  const handleDownloadData = async () => {
    console.log("Download", isRecording, blobMedia);
    setIsRecording(false);

    const recordedBlob = new Blob(blobMedia, { type: "video/mp2t" }); // Converte os pacotes .ts em um único Blob
    const formData = new FormData();
    formData.append("file", recordedBlob, fileName + ".ts");

    try {
      const response = await fetch(host + "/api/uploadFiles", {
        method: "POST",
        headers: {
          "x-auth": account.accessToken || "",
        },
        body: formData,
      });

      if (response.ok) {
        try {
          const convertResponse = await fetch(
            host + `/api/convert/${fileName}.ts`,
            {
              method: "GET",
              headers: {
                "x-auth": account.accessToken || "",
              },
            }
          );
          if (convertResponse.ok) {
            const blob = await convertResponse.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = fileName + ".mp4";
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
          }
        } catch (error) {
          console.error("Erro ao receber o MP4:", error);
        }
        setBlobMedia([]);
        setFileName('')
      } else {
        console.error("Erro ao enviar o arquivo .ts.");
      }
    } catch (error) {
      console.error("Erro ao enviar o arquivo .ts:", error);
    }
  };
  const handlePlay = () => {
    setIsRecording(true);
  };

  useEffect(() => {
    const extension = url.split(".").pop()?.toLowerCase();
    if (extension === "m3u8" && videoRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(videoRef.current);

        // Interceptar e capturar os pacotes .ts
        hls.on(Hls.Events.FRAG_LOADED, function (event, data) {
          const tsSegment = data.frag.url;
          fetch(tsSegment)
            .then((response) => response.blob())
            .then((blob) => {
              if (isRecording === true) {
                setBlobMedia((prevBlobMedia) => [...prevBlobMedia, blob]); // Acumula os blobs recebidos no estado
              }
            })
            .catch((error) =>
              console.error("Erro ao capturar o pacote .ts:", error)
            );
        });

        return () => {
          hls.destroy();
        };
      } else if (
        videoRef.current.canPlayType("application/vnd.apple.mpegurl")
      ) {
        videoRef.current.src = url;
      } else {
        console.error("HLS format not supported by this browser.");
      }
    }
  }, [url, isRecording]);
  console.log("CONST BLOBMEDIA", isRecording, blobMedia);
  // Tratamento para vídeos do YouTube
  const getYouTubeVideoId = (url: string): string | null => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  };

  const getVideoPlayer = (url: string) => {
    const extension = url.split(".").pop()?.toLowerCase();
    const youTubeId = getYouTubeVideoId(url);

    if (youTubeId) {
      return (
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${youTubeId}?autoplay=1`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube video player"
          className="lg:h-[267px] xl:h-[295px] xl2:h-[350px] xl3:h-[410px] xl4:h-[500px]"
        ></iframe>
      );
    } else {
      switch (extension) {
        case "mp4":
          return (
            <div className="lg:h-[267px] xl:h-[295px] xl2:h-[350px] xl3:h-[410px] xl4:h-[500px] relative">
              <video controls width="100%" autoPlay className="w-full h-full">
                <source src={url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          );
        case "m3u8":
          return (
            <div>
              <div className="flex gap-4 justify-center">
                <Button variant={"default"} size={"icon"} onClick={handlePlay}>
                  Play
                </Button>
                <Button
                  variant={"outline"}
                  size={"icon"}
                  onClick={() => setIsRecording(false)}
                >
                  Stop
                </Button>
                <Button
                  variant={"destructive"}
                  size={"icon"}
                  onClick={handleDownloadData}
                >
                  Down
                </Button>
              </div>

              <video
                controls
                width="100%"
                ref={videoRef}
                autoPlay
                className="lg:h-[267px] xl:h-[295px] xl2:h-[350px] xl3:h-[410px] xl4:h-[500px] relative"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          );
        default:
          return <p>Unsupported video format</p>;
      }
    }
  };

  return <div>{getVideoPlayer(url)}</div>;
}
