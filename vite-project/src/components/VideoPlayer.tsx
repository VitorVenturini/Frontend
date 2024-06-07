import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

interface VideoPlayerProps {
  url: string;
}

export default function VideoPlayer({ url }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // tratamento para streamings (m3u8)
  useEffect(() => {
    const extension = url.split(".").pop()?.toLowerCase();
    if (extension === "m3u8" && videoRef.current) {
      // If the video is an HLS stream
      if (Hls.isSupported()) {
        // Hls.js supports this browser
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(videoRef.current);
        return () => {
          hls.destroy();
        };
      } else if (
        videoRef.current.canPlayType("application/vnd.apple.mpegurl")
      ) {
        // Native HLS support (e.g., Safari)
        videoRef.current.src = url;
      } else {
        console.error("HLS format not supported by this browser.");
      }
    }
  }, [url]);

  // tratamento para videos do Youtube
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
          height="315"
          src={`https://www.youtube.com/embed/${youTubeId}?autoplay=1`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube video player"
        ></iframe>
      );
    }

    switch (extension) {
      case "mp4":
        return (
          <video controls width="100%" autoPlay>
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      case "m3u8":
        // para o caso Stream (m3u8) o tratamento é diferente pois ele é realizado no UseEffect com a lib de Hls
        return (
          <video controls width="100%" ref={videoRef} autoPlay>
            Your browser does not support the video tag.
          </video>
        );
      default:
        return <p>Unsupported video format</p>;
    }
  };

  return <div>{getVideoPlayer(url)}</div>;
}
