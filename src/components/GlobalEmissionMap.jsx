import { useEffect, useRef, useState } from 'react';
import * as topojson from 'topojson-client';

// Generate fake emission data for countries (seeded by country code for consistency)
function generateEmissionData(countryCode, countryName) {
  // Return N/A data for Antarctica
  if (countryCode === 'AQ' || countryName === 'Antarctica') {
    return {
      name: 'ANTARCTICA',
      isAntarctica: true,
    };
  }
  
  // Use country code to seed random values for consistency
  const seed = countryCode.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const pseudoRandom = (n) => ((seed * (n + 1) * 9301 + 49297) % 233280) / 233280;
  
  // Major emitters get higher values
  const majorEmitters = {
    'CN': { emissions: 12290, perCapita: 9.24, globalPercent: 32.0 },
    'US': { emissions: 4682, perCapita: 14.20, globalPercent: 13.0 },
    'IN': { emissions: 3190, perCapita: 2.07, globalPercent: 8.0 },
    'RU': { emissions: 2069, perCapita: 14.45, globalPercent: 5.3 },
    'JP': { emissions: 944, perCapita: 7.54, globalPercent: 2.4 },
    'DE': { emissions: 674, perCapita: 8.09, globalPercent: 1.8 },
    'IR': { emissions: 749, perCapita: 8.59, globalPercent: 2.0 },
    'KR': { emissions: 621, perCapita: 12.07, globalPercent: 1.6 },
    'SA': { emissions: 588, perCapita: 16.16, globalPercent: 1.5 },
    'CA': { emissions: 575, perCapita: 13.80, globalPercent: 1.5 },
    'ID': { emissions: 692, perCapita: 2.45, globalPercent: 1.8 },
    'BR': { emissions: 486, perCapita: 2.25, globalPercent: 1.3 },
    'MX': { emissions: 472, perCapita: 3.58, globalPercent: 1.2 },
    'AU': { emissions: 393, perCapita: 15.09, globalPercent: 1.0 },
    'ZA': { emissions: 435, perCapita: 7.15, globalPercent: 1.1 },
    'TR': { emissions: 428, perCapita: 4.98, globalPercent: 1.1 },
    'GB': { emissions: 326, perCapita: 4.85, globalPercent: 0.9 },
    'FR': { emissions: 299, perCapita: 4.46, globalPercent: 0.8 },
    'IT': { emissions: 321, perCapita: 5.45, globalPercent: 0.8 },
    'PL': { emissions: 315, perCapita: 8.36, globalPercent: 0.8 },
  };
  
  if (majorEmitters[countryCode]) {
    const data = majorEmitters[countryCode];
    return {
      name: countryName.toUpperCase(),
      emissions: data.emissions,
      perCapita: data.perCapita,
      globalPercent: data.globalPercent,
      status: data.emissions > 400 ? 'CRITICAL' : 'ON TRACK',
      aqi: Math.floor(30 + pseudoRandom(1) * 170),
    };
  }
  
  // Generate random data for other countries
  const emissions = Math.floor(10 + pseudoRandom(1) * 400);
  const perCapita = Math.round((0.5 + pseudoRandom(2) * 15) * 100) / 100;
  const globalPercent = Math.round((emissions / 38400) * 1000) / 10;
  const aqi = Math.floor(20 + pseudoRandom(3) * 180);
  
  return {
    name: countryName.toUpperCase(),
    emissions,
    perCapita,
    globalPercent,
    status: emissions > 300 || perCapita > 10 ? 'CRITICAL' : 'ON TRACK',
    aqi,
  };
}

// Get emission color - green to yellow to orange to red gradient
function getEmissionColor(emissions) {
  if (emissions === null || emissions === undefined) return '#1e293b';
  
  // Normalize emissions to 0-1 range (max around 12000)
  const normalized = Math.min(emissions / 5000, 1);
  
  // Color stops: green (#22c55e) -> yellow (#eab308) -> orange (#f97316) -> red (#ef4444)
  let r, g, b;
  
  if (normalized < 0.33) {
    // Green to Yellow
    const t = normalized / 0.33;
    r = Math.floor(34 + t * (234 - 34));   // 34 -> 234
    g = Math.floor(197 + t * (179 - 197)); // 197 -> 179
    b = Math.floor(94 - t * 86);           // 94 -> 8
  } else if (normalized < 0.66) {
    // Yellow to Orange
    const t = (normalized - 0.33) / 0.33;
    r = Math.floor(234 + t * (249 - 234)); // 234 -> 249
    g = Math.floor(179 - t * (179 - 115)); // 179 -> 115
    b = Math.floor(8 + t * (22 - 8));      // 8 -> 22
  } else {
    // Orange to Red
    const t = (normalized - 0.66) / 0.34;
    r = Math.floor(249 - t * (249 - 239)); // 249 -> 239
    g = Math.floor(115 - t * (115 - 68));  // 115 -> 68
    b = Math.floor(22 + t * (68 - 22));    // 22 -> 68
  }
  
  return `rgb(${r}, ${g}, ${b})`;
}

// Get AQI color based on health scale
function getAqiColor(aqi) {
  if (aqi <= 33) return '#22C55E';      // Good - Green
  if (aqi <= 66) return '#84CC16';      // Moderate - Lime
  if (aqi <= 99) return '#EAB308';      // Fair - Yellow
  if (aqi <= 149) return '#F97316';     // Poor - Orange
  if (aqi <= 200) return '#800080';     // Very Poor - Purple
  return '#B91C1C';                      // Hazardous - Red
}

// Convert TopoJSON arc coordinates to SVG path
function arcToPath(coordinates, transform) {
  if (!coordinates || coordinates.length === 0) return '';
  
  const { scale, translate } = transform;
  let path = '';
  
  coordinates.forEach((coord, i) => {
    const x = (coord[0] * scale[0] + translate[0] + 180) * (800 / 360);
    const y = (90 - (coord[1] * scale[1] + translate[1])) * (400 / 180);
    
    if (i === 0) {
      path += `M${x.toFixed(2)},${y.toFixed(2)}`;
    } else {
      path += `L${x.toFixed(2)},${y.toFixed(2)}`;
    }
  });
  
  return path + 'Z';
}

// Legend component
function MapLegend() {
  return (
    <div className="absolute bottom-4 left-4 bg-dark-slate/90 border border-dark-border rounded-lg p-3 backdrop-blur-sm">
      <p className="text-[10px] tracking-[0.2em] text-muted-text mb-2">EMISSIONS SCALE</p>
      <div className="flex items-center gap-2">
        <div 
          className="w-32 h-3 rounded-sm"
          style={{ 
            background: 'linear-gradient(to right, #22c55e, #eab308, #f97316, #ef4444)'
          }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[8px] text-muted-text">LOW</span>
        <span className="text-[8px] text-muted-text">HIGH</span>
      </div>
    </div>
  );
}

// Tooltip component
function MapTooltip({ data, position }) {
  if (!data) return null;

  // Handle Antarctica N/A case
  if (data.isAntarctica) {
    return (
      <div 
        className="fixed z-50 pointer-events-none"
        style={{ 
          left: position.x + 15, 
          top: position.y - 10,
        }}
      >
        <div className="bg-dark-slate/95 border border-dark-border rounded-lg p-3 backdrop-blur-sm shadow-lg min-w-[180px]">
          <p className="text-xs tracking-[0.2em] text-muted-text font-bold mb-2 border-b border-dark-border pb-2">
            {data.name}
          </p>
          <div className="space-y-1 font-mono text-[10px]">
            <div className="flex justify-between">
              <span className="text-muted-text">ANNUAL EMISSIONS:</span>
              <span className="text-muted-text">N/A</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-text">GLOBAL SHARE:</span>
              <span className="text-muted-text">N/A</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-text">PER CAPITA:</span>
              <span className="text-muted-text">N/A</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-text">EST. AQI:</span>
              <span className="text-muted-text">N/A</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-dark-border mt-1">
              <span className="text-muted-text">BUDGET STATUS:</span>
              <span className="text-muted-text">N/A</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusColor = data.status === 'CRITICAL' ? '#B91C1C' : '#22C55E';
  const aqiColor = getAqiColor(data.aqi);

  return (
    <div 
      className="fixed z-50 pointer-events-none"
      style={{ 
        left: position.x + 15, 
        top: position.y - 10,
      }}
    >
      <div className="bg-dark-slate/95 border border-neon-green/50 rounded-lg p-3 backdrop-blur-sm shadow-lg min-w-[220px]"
        style={{ boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)' }}
      >
        <p className="text-xs tracking-[0.2em] text-neon-green font-bold mb-2 border-b border-dark-border pb-2">
          {data.name}
        </p>
        <div className="space-y-1 font-mono text-[10px]">
          <div className="flex justify-between">
            <span className="text-muted-text">ANNUAL EMISSIONS:</span>
            <span className="text-white tabular-nums">{data.emissions.toLocaleString()} Mt</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-text">GLOBAL SHARE:</span>
            <span className="text-white tabular-nums">{data.globalPercent.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-text">PER CAPITA:</span>
            <span className="text-white tabular-nums">{data.perCapita.toFixed(2)} TONNES</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-text">EST. AQI (CAPITAL):</span>
            <span className="tabular-nums font-semibold" style={{ color: aqiColor }}>{data.aqi}</span>
          </div>
          <div className="flex justify-between pt-1 border-t border-dark-border mt-1">
            <span className="text-muted-text">BUDGET STATUS:</span>
            <span className="font-bold" style={{ color: statusColor }}>{data.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GlobalEmissionMap() {
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [countries, setCountries] = useState([]);
  const [emissionData, setEmissionData] = useState({});
  const svgRef = useRef(null);

  useEffect(() => {
    // Fetch and process TopoJSON
    fetch('/world-countries.json')
      .then(res => res.json())
      .then(topoData => {
        const geoData = topojson.feature(topoData, topoData.objects.ne_110m_admin_0_countries);
        
        const countryPaths = [];
        const emissions = {};
        
        geoData.features.forEach(feature => {
          const { ISO_A2, NAME } = feature.properties;
          
          // Skip if no geometry
          if (!feature.geometry) return;
          
          // Generate emission data
          const data = generateEmissionData(ISO_A2, NAME);
          if (data) {
            emissions[ISO_A2] = data;
          }
          
          // Convert geometry to SVG path
          const coords = feature.geometry.coordinates;
          let paths = [];
          
          if (feature.geometry.type === 'Polygon') {
            paths = [coordsToPath(coords[0])];
          } else if (feature.geometry.type === 'MultiPolygon') {
            paths = coords.map(polygon => coordsToPath(polygon[0]));
          }
          
          countryPaths.push({
            code: ISO_A2,
            name: NAME,
            paths,
          });
        });
        
        setCountries(countryPaths);
        setEmissionData(emissions);
      })
      .catch(err => console.error('Failed to load map data:', err));
  }, []);

  // Convert GeoJSON coordinates to SVG path
  function coordsToPath(coords) {
    if (!coords || coords.length === 0) return '';
    
    return coords.map((coord, i) => {
      const x = ((coord[0] + 180) / 360) * 800;
      const y = ((90 - coord[1]) / 180) * 400;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
    }).join('') + 'Z';
  }

  const handleMouseMove = (e) => {
    setTooltipPosition({ x: e.clientX, y: e.clientY });
  };

  const handleCountryHover = (countryCode) => {
    setHoveredCountry(countryCode);
  };

  const handleCountryLeave = () => {
    setHoveredCountry(null);
  };

  const totalEmissions = Object.values(emissionData).reduce((sum, d) => sum + (d.emissions || 0), 0);
  const criticalCount = Object.values(emissionData).filter(d => d.status === 'CRITICAL').length;
  const onTrackCount = Object.values(emissionData).filter(d => d.status === 'ON TRACK').length;

  return (
    <section className="mb-12 relative">
      <h2 className="text-center text-xs tracking-[0.4em] text-muted-text mb-6">
        GLOBAL EMISSION DISTRIBUTION
      </h2>

      <div className="border border-dark-border rounded-lg bg-dark-card overflow-hidden relative">
        {/* Map Container */}
        <div 
          className="relative w-full"
          style={{ backgroundColor: '#020617' }}
          onMouseMove={handleMouseMove}
        >
          <svg
            ref={svgRef}
            viewBox="0 0 800 400"
            className="w-full h-auto"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Defs for filters and patterns */}
            <defs>
              {/* Grid pattern */}
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.3" opacity="0.5" />
              </pattern>
              
              {/* Inner shadow filter */}
              <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feComponentTransfer in="SourceAlpha">
                  <feFuncA type="table" tableValues="1 0" />
                </feComponentTransfer>
                <feGaussianBlur stdDeviation="3" />
                <feOffset dx="0" dy="0" result="offsetblur" />
                <feFlood floodColor="#000000" floodOpacity="0.7" result="color" />
                <feComposite in2="offsetblur" operator="in" />
                <feComposite in2="SourceAlpha" operator="in" />
                <feMerge>
                  <feMergeNode in="SourceGraphic" />
                  <feMergeNode />
                </feMerge>
              </filter>
              
              {/* Hover glow filter */}
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            
            {/* Ocean background */}
            <rect x="0" y="0" width="800" height="400" fill="#020617" />
            
            {/* Grid overlay */}
            <rect x="0" y="0" width="800" height="400" fill="url(#grid)" />

            {/* Country paths */}
            {countries.map(({ code, paths }) => {
              const data = emissionData[code];
              const baseColor = data ? getEmissionColor(data.emissions) : '#1e293b';
              const isHovered = hoveredCountry === code;
              
              return paths.map((path, idx) => (
                <path
                  key={`${code}-${idx}`}
                  d={path}
                  fill={baseColor}
                  stroke={isHovered ? '#22c55e' : '#0f172a'}
                  strokeWidth={isHovered ? 1.5 : 0.5}
                  style={{
                    cursor: data ? 'pointer' : 'default',
                    filter: isHovered ? 'url(#glow)' : 'url(#innerShadow)',
                    transition: 'all 0.2s ease',
                    opacity: isHovered ? 1 : 0.9,
                  }}
                  onMouseEnter={() => data && handleCountryHover(code)}
                  onMouseLeave={handleCountryLeave}
                />
              ));
            })}

            {/* Latitude/Longitude reference lines */}
            <line x1="0" y1="200" x2="800" y2="200" stroke="#334155" strokeWidth="0.3" strokeDasharray="8 8" opacity="0.5" />
            <line x1="400" y1="0" x2="400" y2="400" stroke="#334155" strokeWidth="0.3" strokeDasharray="8 8" opacity="0.5" />
          </svg>

          {/* Legend */}
          <MapLegend />

          {/* Stats overlay */}
          <div className="absolute top-4 right-4 bg-dark-slate/90 border border-dark-border rounded-lg p-3 backdrop-blur-sm">
            <p className="text-[9px] tracking-[0.2em] text-muted-text mb-1">TOTAL TRACKED</p>
            <p className="text-lg font-bold text-neon-green tabular-nums">
              {totalEmissions.toLocaleString()} Mt
            </p>
            <p className="text-[8px] text-muted-text">CO₂e / YEAR</p>
          </div>
        </div>

        {/* Bottom info bar */}
        <div className="bg-dark-slate/50 border-t border-dark-border p-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-red animate-pulse" />
              <span className="text-[10px] text-muted-text tracking-wider">
                {criticalCount} NATIONS CRITICAL
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-green" />
              <span className="text-[10px] text-muted-text tracking-wider">
                {onTrackCount} ON TRACK
              </span>
            </div>
          </div>
          <p className="text-[9px] text-muted-text">HOVER OVER COUNTRY FOR DETAILS</p>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredCountry && emissionData[hoveredCountry] && (
        <MapTooltip 
          data={emissionData[hoveredCountry]} 
          position={tooltipPosition}
        />
      )}
    </section>
  );
}
