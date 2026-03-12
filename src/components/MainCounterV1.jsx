import { useEffect, useRef, useState } from 'react';
import { CONFIG, TONNES_PER_DAY, TONNES_PER_SECOND } from '../config';
import { calculateTimeElapsed, formatNumber, padZero } from '../utils';
/*
export default function MainCounterV1() {
  const [emissions, setEmissions] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [videoOpacity, setVideoOpacity] = useState(0.3);
  const [videoOpacity2, setVideoOpacity2] = useState(0.3);
  const videoRef = useRef(null);
  const videoRef2 = useRef(null);

  useEffect(() => {
    const updateCounter = () => {
      const elapsed = calculateTimeElapsed(CONFIG.startDate);
      const totalEmissions = elapsed.totalSeconds * TONNES_PER_SECOND;
      setEmissions(totalEmissions);
      setTimeElapsed(elapsed);
    };

    updateCounter();
    const interval = setInterval(updateCounter, CONFIG.updateInterval);
    return () => clearInterval(interval);
  }, []);

  // Handle video fade out/in for non-looping animation (first video)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const timeRemaining = video.duration - video.currentTime;
      // Fade out during last 4 seconds
      if (timeRemaining <= 4) {
        setVideoOpacity(0.3 * (timeRemaining / 4));
      } else if (video.currentTime <= 4) {
        // Fade in during first 4 seconds
        setVideoOpacity(0.3 * (video.currentTime / 4));
      } else {
        setVideoOpacity(0.3);
      }
    };

    const handleEnded = () => {
      setVideoOpacity(0);
      video.currentTime = 0;
      video.play();
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Handle video fade out/in for non-looping animation (second video - offset by half)
  useEffect(() => {
    const video = videoRef2.current;
    const video1 = videoRef.current;
    if (!video || !video1) return;

    // Start second video at half the duration once first video metadata is loaded
    const startOffset = () => {
      if (video1.duration) {
        video.currentTime = video1.duration / 2;
        video.play();
      }
    };

    if (video1.readyState >= 1) {
      startOffset();
    } else {
      video1.addEventListener('loadedmetadata', startOffset, { once: true });
    }

    const handleTimeUpdate = () => {
      const timeRemaining = video.duration - video.currentTime;
      // Fade out during last 2 seconds
      if (timeRemaining <= 4) {
        setVideoOpacity2(0.3 * (timeRemaining / 4));
      } else if (video.currentTime <= 4) {
        // Fade in during first 2 seconds
        setVideoOpacity2(0.3 * (video.currentTime / 4));
      } else {
        setVideoOpacity2(0.3);
      }
    };

    const handleEnded = () => {
      setVideoOpacity2(0);
      video.currentTime = 0;
      video.play();
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <section className="mb-10">
      <div className="relative border border-dark-border rounded-lg bg-dark-slate p-8 md:p-12 glow-orange overflow-hidden">
        {/* Background Smoke Video }
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-300"
          style={{ opacity: videoOpacity }}
        >
          <source src="/smoke.mp4" type="video/mp4" />
        </video>
        
        {/* Background Smoke Video 2 (offset by half) }
        <video
          ref={videoRef2}
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-300"
          style={{ opacity: videoOpacity2 }}
        >
          <source src="/smoke.mp4" type="video/mp4" />
        </video>
        
        <div className="text-center relative z-10">
          <p className="text-xs tracking-[0.3em] text-muted-text mb-4">
            EST. GLOBAL CO₂e SINCE JAN 1, 2026
          </p>
          
          <div className="text-4xl md:text-6xl lg:text-7xl font-bold text-neon-orange text-glow-orange mb-1">
            {formatNumber(Math.floor(emissions))}
          </div>
          <p className="text-sm text-neon-orange text-glow-orange tracking-[0.2em] mb-4">METRIC TONNES CO₂e</p>
          
          <p className="text-sm text-muted-text tracking-[0.1em] mb-6">
            {formatNumber(TONNES_PER_DAY, 0)} tonnes / day · IPCC estimate via climate models
          </p>
          
          {/* Time Elapsed }
          <div className="flex justify-center items-center gap-2 text-2xl md:text-3xl font-semibold">
            <TimeUnit value={timeElapsed.days} label="DAYS" />
            <span className="text-muted-text">:</span>
            <TimeUnit value={timeElapsed.hours} label="HRS" />
            <span className="text-muted-text">:</span>
            <TimeUnit value={timeElapsed.minutes} label="MIN" />
            <span className="text-muted-text">:</span>
            <TimeUnit value={timeElapsed.seconds} label="SEC" />
          </div>
        </div>
      </div>
    </section>
  );
}

function TimeUnit({ value, label }) {
  return (
    <div className="bg-dark-slate border border-dark-border rounded px-3 py-2">
      <span className="text-white">{padZero(value)}</span>
      <span className="text-xs text-muted-text block">{label}</span>
    </div>
  );
}
*/