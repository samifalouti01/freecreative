import React, { useRef, useState, useEffect } from 'react';
import '../App.css'; // Ensure the path is correct

function VideoCard({ video }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleDownload = (url, title) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  return (
    <div className="video-card">
      {/* Video container */}
      <div className="video-container" style={{ position: 'relative' }}>
        <video
          ref={videoRef}
          className="video-frame"
          poster={video.thumbnailUrl}
          onClick={handlePlayPause}
        >
          <source src={video.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Overlay play button */}
        <div className={`play-button ${isPlaying ? 'hide' : ''}`} onClick={handlePlayPause}>
          &#9658; {/* Play icon */}
        </div>
        {/* Current time display */}
        <div style={timeStyle}>
          {new Date(currentTime * 1000).toISOString().substr(11, 8)} / {new Date(duration * 1000).toISOString().substr(11, 8)}
        </div>
      </div>
      <h2>{video.title}</h2>
      <p>{video.description}</p>
      
      {/* Download button */}
      <button
        onClick={() => handleDownload(video.url, video.title)}
        className="download-btn"
      >
        Download
      </button>
    </div>
  );
}

const timeStyle = {
  position: 'absolute',
  top: '10px',
  left: '10px',
  fontSize: '16px',
  color: 'white',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  padding: '5px',
  borderRadius: '5px'
};

export default VideoCard;
