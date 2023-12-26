// components/VideoPlayer.js
import { useState, useRef, useEffect } from 'react';
import crypto from 'crypto';

const VideoPlayer = ({ videoUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const startTimeRef = useRef(null);

  // Function to generate a unique ID for the video based on its URL
  const generateUniqueId = (videoUrl) => {
    const hash = crypto.createHash('sha256');
    return hash.update(videoUrl).digest('hex');
  };

  const videoId = generateUniqueId(videoUrl);

  const handleVideoPause = async () => {
    if (isPlaying) {
      const timestamp = new Date().toISOString();
      const endTime = new Date().getTime();
      const elapsedSeconds = (endTime - startTimeRef.current) / 1000;

      console.log('Video paused at:', timestamp);
      console.log('Elapsed time:', elapsedSeconds, 'seconds');

      // Make a POST request to store the current time
      const response = await fetch('/api/storeCurrentTime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId, timestamp, elapsedSeconds }),
      });

      if (response.ok) {
        console.log('Current time stored successfully');
      } else {
        console.error('Failed to store current time');
      }

      setIsPlaying(false);
    }
  };

  const handleVideoPlay = async () => {
    if (!isPlaying) {
      // Make a GET request to get the timestamp from the server
      const response = await fetch(`/api/getTimestamp?videoId=${videoId}`);
      if (response.ok) {
        const data = await response.json();
        const { updatedAt, currentTime } = data;

        console.log('Timestamp retrieved from the server:', updatedAt);
        console.log('Current time:', currentTime);

        // Set the video currentTime
        videoRef.current.currentTime = currentTime;

        // Update the startTimeRef to track elapsed time
        startTimeRef.current = new Date().getTime() - (currentTime * 1000);

        setIsPlaying(true);

        // Start playing the video
        videoRef.current.play();
      } else {
        console.error('Failed to get timestamp from the server');
      }
    }
  };

  useEffect(() => {
    // Add event listeners for pause and play events
    videoRef.current.addEventListener('pause', handleVideoPause);
    videoRef.current.addEventListener('play', handleVideoPlay);

    return () => {
      // Clean up event listeners on component unmount
      videoRef.current.removeEventListener('pause', handleVideoPause);
      videoRef.current.removeEventListener('play', handleVideoPlay);
    };
  }, [videoId, isPlaying]);

  return (
    <div>
      <video ref={videoRef} autoPlay muted loop controls>
        <source src={videoUrl} type="video/mp4" />
      </video>
    </div>
  );
};

export default VideoPlayer;
