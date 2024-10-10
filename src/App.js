import React, { useState, useEffect } from 'react';
import VideoList from './components/VideoList';
import Header from './components/Header';
import Loader from './components/Loader';
import './App.css';

const getPaginationPages = (current, total, delta = 2) => {
  const range = [];
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  for (let i = left; i <= right; i++) {
    range.push(i);
  }

  if (left > 2) {
    range.unshift('...');
  }
  if (right < total - 1) {
    range.push('...');
  }

  range.unshift(1);
  range.push(total);
  return range;
};

function App() {
  const [videos, setVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedVideos, setDisplayedVideos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [currentPlaying, setCurrentPlaying] = useState(null); // Track the currently playing video
  const pages = getPaginationPages(currentPage, totalPages);
  const pexelsAPIKey = 'U4f74NxEgt8MI7LWZ5OaExiwuZ3iRANH7IxeVIBsyXyG54w3beoz6NkX';
  const videosPerPage = 20;

  // Fetch videos from Pexels API
  const fetchPexelsVideos = async (page = 1) => {
    const response = await fetch(`https://api.pexels.com/videos/popular?per_page=${videosPerPage}&page=${page}`, {
      headers: {
        Authorization: pexelsAPIKey,
      },
    });
    const data = await response.json();
    return {
      videos: data.videos.map(video => ({
        title: video.user.name,
        url: video.video_files[0].link,
        thumbnailUrl: video.image,
        description: video.description,
        id: video.id, // Add an ID to each video
      })),
      totalPages: Math.ceil(data.total_results / videosPerPage),
    };
  };

  // Fetch videos when the component mounts and on page change
  useEffect(() => {
    const savedPage = localStorage.getItem('currentPage');
    if (savedPage) {
      setCurrentPage(Number(savedPage));
    }

    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        const pexelsVideosData = await fetchPexelsVideos(currentPage);
        const { videos: pexelsVideos, totalPages } = pexelsVideosData;

        setVideos(pexelsVideos);
        setTotalPages(totalPages);
        setDisplayedVideos(pexelsVideos.slice(0, videosPerPage));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pexelsAPIKey, currentPage]);

  // Update current page and save to localStorage
  const loadPage = async (page) => {
    setIsLoading(true);
    setCurrentPage(page);
    localStorage.setItem('currentPage', page); // Save the current page in localStorage

    const pexelsVideosData = await fetchPexelsVideos(page);
    const { videos: pexelsVideos } = pexelsVideosData;

    setDisplayedVideos(prevVideos => {
      const start = (page - 1) * videosPerPage;
      return [...prevVideos.slice(0, start), ...pexelsVideos];
    });

    setIsLoading(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredVideos = displayedVideos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (video.description && video.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    video.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.id.toString().includes(searchQuery)  // Search by video ID as well
  );
  

  const handlePlay = (videoId) => {
    if (currentPlaying && currentPlaying !== videoId) {
      const videoElement = document.getElementById(currentPlaying);
      if (videoElement) {
        videoElement.pause(); // Pause the currently playing video
      }
    }
    setCurrentPlaying(videoId); // Update the currently playing video ID
  };

  return (
    <div className="App">
      <Header onSearch={setSearchQuery} />
      <h1>{videos.length} Videos</h1>

      {isLoading ? (
        <div className="loader-container">
          <Loader />
        </div>
      ) : (
        <VideoList videos={filteredVideos} onPlay={handlePlay} currentPlaying={currentPlaying} />
      )}

      <div className="pagination">
        {pages.map((page, index) => (
          <button
            key={index}
            className={`pagination-button ${currentPage === page ? 'active' : ''}`}
            onClick={() => page !== '...' && loadPage(page)}
          >
            {page}
          </button>
        ))}
      </div>

      {showScrollToTop && (
        <button className={`scroll-to-top ${showScrollToTop ? 'show' : ''}`} onClick={scrollToTop}>
          ⏏
        </button>
      )}
    </div>
  );
}

export default App;
