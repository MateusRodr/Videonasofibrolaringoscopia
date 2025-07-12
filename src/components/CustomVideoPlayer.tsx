import React, { useEffect, useRef, useState } from 'react';
import '../estilos/CustomVideoPlayer.css';

interface CustomVideoPlayerProps {
  onVideoReady?: (video: HTMLVideoElement) => void;
}

const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({ onVideoReady }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    if (videoRef.current && onVideoReady) {
      onVideoReady(videoRef.current);
    }
  }, [videoRef.current]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Verifica se o elemento ativo é um input ou textarea
      const activeElement = document.activeElement;
      const isTyping = activeElement?.tagName === 'INPUT' || 
                      activeElement?.tagName === 'TEXTAREA' ||
                      (activeElement as HTMLElement)?.isContentEditable;
      
      if (isTyping) {
        return; // Não faz nada se estiver digitando
      }

      if (!videoRef.current) return;

      switch (e.key) {
        case ' ': // espaço
          e.preventDefault();
          videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          videoRef.current.currentTime -= 5;
          break;
        case 'ArrowRight':
          e.preventDefault();
          videoRef.current.currentTime += 5;
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setVideoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="custom-player-container">
      <input type="file" id="upload" accept="video/*" style={{ display: 'none' }} onChange={handleFileChange} />
      <label htmlFor="upload" className="upload-button">📁 Escolher vídeo</label>
      <span className="file-name">{fileName || "Nenhum vídeo selecionado"}</span>

      {videoUrl && (
        <div className="video-wrapper">
          <video
            ref={videoRef}
            src={videoUrl}
            controls
          />
        </div>
      )}
    </div>
  );
};

export default CustomVideoPlayer;