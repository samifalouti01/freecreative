import React from 'react';
import VideoCard from './VideoCard';

function VideoList({ videos }) {
  if (videos.length === 0) {
    return <p>No videos available</p>; // Handle empty list
  }

  return (
    <div className="video-list">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} /> // Use unique video.id as key
      ))}
    </div>
  );
}

export default VideoList;
