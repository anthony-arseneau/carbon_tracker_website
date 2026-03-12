import { useEffect, useRef, useState } from 'react';
import { CONFIG } from '../config';
import { calculateTimeElapsed, formatNumber } from '../utils';

// Wildfire constants
const ANNUAL_HECTARES_BURNED = 28_000_000; // Global average
const SECONDS_PER_YEAR = 365 * 24 * 60 * 60;
const HECTARES_PER_SECOND = ANNUAL_HECTARES_BURNED / SECONDS_PER_YEAR;

// Average CO2 per hectare (weighted average across biomes)
const AVG_CO2_PER_HECTARE = 170; // tonnes

// Impact card data
const IMPACT_CARDS = [
  {
    title: 'BOREAL FOREST',
    region: 'Canada / Siberia',
    icon: '🌲',
    biomassDensity: 'High (Carbon Sink)',
    co2PerHectare: 170,
    healthImpact: 'CRITICAL',
    healthLabel: 'SMOKE / AQI',
    bgGradient: 'from-emerald-900/20 to-transparent',
  },
  {
    title: 'TROPICAL RAINFOREST',
    region: 'Amazon Basin',
    icon: '🌳',
    biomassDensity: 'Extreme (Biodiversity)',
    co2PerHectare: 250,
    healthImpact: 'CATASTROPHIC',
    healthLabel: 'ECOSYSTEM COLLAPSE',
    bgGradient: 'from-green-900/20 to-transparent',
  },
  {
    title: 'URBAN-WILDLAND',
    region: 'Interface Zones',
    icon: '🏠',
    biomassDensity: 'Variable (Human Life)',
    co2PerHectare: 90,
    healthImpact: 'IMMEDIATE THREAT',
    healthLabel: 'EVACUATION RISK',
    bgGradient: 'from-orange-900/20 to-transparent',
  },
];

export default function BiosphereDegradation() {
  const [hectaresBurned, setHectaresBurned] = useState(0);
  const [carbonReleased, setCarbonReleased] = useState(0);
  const [videoOpacity, setVideoOpacity] = useState(0.15);
  const [videoOpacity2, setVideoOpacity2] = useState(0.15);
  const videoRef = useRef(null);
  const videoRef2 = useRef(null);

  // Update counter every 100ms
  useEffect(() => {
    const updateCounter = () => {
      const elapsed = calculateTimeElapsed(CONFIG.startDate);
      const burned = elapsed.totalSeconds * HECTARES_PER_SECOND;
      setHectaresBurned(burned);
      // Convert to GtCO2e (tonnes to gigatonnes)
      setCarbonReleased((burned * AVG_CO2_PER_HECTARE) / 1_000_000_000);
    };

    updateCounter();
    const interval = setInterval(updateCounter, 100);
    return () => clearInterval(interval);
  }, []);

  // Handle video fade out/in for first fire video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const timeRemaining = video.duration - video.currentTime;
      // Fade out during last 4 seconds
      if (timeRemaining <= 4) {
        setVideoOpacity(0.15 * (timeRemaining / 4));
      } else if (video.currentTime <= 4) {
        // Fade in during first 4 seconds
        setVideoOpacity(0.15 * (video.currentTime / 4));
      } else {
        setVideoOpacity(0.15);
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

  // Handle video fade out/in for second fire video (offset by half)
  useEffect(() => {
    const video = videoRef2.current;
    const video1 = videoRef.current;
    if (!video || !video1) return;

    // Start second video at half the duration
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
      // Fade out during last 4 seconds
      if (timeRemaining <= 4) {
        setVideoOpacity2(0.15 * (timeRemaining / 4));
      } else if (video.currentTime <= 4) {
        // Fade in during first 4 seconds
        setVideoOpacity2(0.15 * (video.currentTime / 4));
      } else {
        setVideoOpacity2(0.15);
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

  // Determine if carbon released is critical (over 1Gt)
  const isCriticalCarbon = carbonReleased >= 1;

  return (
    <section className="mb-12">
      {/* Section Header */}
      <h2 className="text-center text-xs tracking-[0.4em] text-muted-text mb-6">
        <span style={{ color: '#FF4D00' }}>BIOSPHERE DEGRADATION</span>
        <span className="mx-2">·</span>
        <span>WILDFIRE ANALYSIS</span>
      </h2>

      {/* Main Ticker Section */}
      <div className="relative border rounded-lg bg-dark-slate p-8 md:p-12 overflow-hidden mb-8"
        style={{ borderColor: '#FF4D00', boxShadow: '0 0 30px rgba(255, 77, 0, 0.15)' }}
      >
        {/* Fire Animation Background - Video 1 */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-300"
          style={{ 
            opacity: videoOpacity, 
            mixBlendMode: 'screen',
          }}
        >
          <source src="/fire.mp4" type="video/mp4" />
        </video>

        {/* Fire Animation Background - Video 2 (offset by half) */}
        <video
          ref={videoRef2}
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-300"
          style={{ 
            opacity: videoOpacity2, 
            mixBlendMode: 'screen',
          }}
        >
          <source src="/fire.mp4" type="video/mp4" />
        </video>

        {/* Content */}
        <div className="text-center relative z-10">
          <p className="text-xs tracking-[0.3em] text-muted-text mb-4">
            EST. GLOBAL WILDFIRE LOSS SINCE JAN 1, 2026
          </p>

          {/* Main Hectares Counter */}
          <div 
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-1 tabular-nums"
            style={{ color: '#FF4D00', textShadow: '0 0 30px rgba(255, 77, 0, 0.5)' }}
          >
            {formatNumber(Math.floor(hectaresBurned))}
          </div>
          <p className="text-sm text-muted-text tracking-[0.2em] mb-4">HECTARES BURNED YTD</p>

          {/* Carbon Release Sub-Label */}
          <div className="inline-flex items-center gap-2 bg-dark-card/80 border border-dark-border rounded-lg px-4 py-2 backdrop-blur-sm">
            <span className="text-xs tracking-[0.15em] text-muted-text">EST. CARBON RELEASED:</span>
            <span 
              className="text-lg font-bold tabular-nums"
              style={{ color: isCriticalCarbon ? '#B91C1C' : '#FF4D00' }}
            >
              {carbonReleased.toFixed(2)} GtCO₂e
            </span>
          </div>

          {/* Rate Info */}
          <p className="text-sm text-muted-text tracking-[0.1em] mt-4">
            {formatNumber(Math.round(HECTARES_PER_SECOND * 60))} hectares / minute · Based on satellite monitoring data
          </p>
        </div>
      </div>

      {/* Impact Scale Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {IMPACT_CARDS.map((card, idx) => (
          <div 
            key={idx}
            className={`relative bg-gradient-to-b ${card.bgGradient} bg-dark-card rounded-lg p-5 overflow-hidden`}
            style={{ border: '1px solid #FF4D00' }}
          >
            {/* Icon */}
            <div className="text-3xl mb-3">{card.icon}</div>

            {/* Title & Region */}
            <h3 className="text-sm font-bold tracking-[0.15em] mb-1" style={{ color: '#FF4D00' }}>
              {card.title}
            </h3>
            <p className="text-xs text-muted-text mb-4">{card.region}</p>

            {/* Stats */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-text">BIOMASS DENSITY:</span>
                <span className="text-white font-mono">{card.biomassDensity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-text">AVG. CO₂ / HECTARE:</span>
                <span className="text-white font-mono tabular-nums">{card.co2PerHectare} TONNES</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-dark-border">
                <span className="text-muted-text">HEALTH IMPACT:</span>
                <span 
                  className="font-bold"
                  style={{ color: card.healthImpact === 'CATASTROPHIC' ? '#B91C1C' : '#FF4D00' }}
                >
                  {card.healthImpact}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-muted-text">{card.healthLabel}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="text-center">
        <a
          href="https://www.globalforestwatch.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm tracking-wider transition-all hover:scale-105"
          style={{ 
            backgroundColor: 'rgba(255, 77, 0, 0.1)',
            border: '1px solid #FF4D00',
            color: '#FF4D00',
            boxShadow: '0 0 20px rgba(255, 77, 0, 0.3)',
          }}
        >
          <span>🌱</span>
          <span>SUPPORT REFORESTATION INITIATIVES</span>
        </a>
      </div>
    </section>
  );
}
