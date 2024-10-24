import React from 'react';
import { Button } from './ui/button';
import { Maximize } from 'lucide-react';

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
    <Button onClick={enterFullScreen} variant="outline" size='icon'>
      <Maximize/>
    </Button>
  );
};

export default FullScreenButton;