import React from 'react';
import { Button } from './ui/button';

export const FullScreenButton: React.FC = () => {
  const enterFullScreen = () => {
    const elem = document.documentElement;

    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    }
  };

  return (
    <Button onClick={enterFullScreen} variant="outline">
      Tela cheia
    </Button>
  );
};

export default FullScreenButton;