import React from 'react';
import { getTeamKit } from '../utils/teamKits';
import './TeamJersey.css';

const TeamJersey = ({ clubName, number = null, size = 'md', className = '' }) => {
  const kit = getTeamKit(clubName);

  return (
    <div className={`team-jersey-wrap jersey-${size} ${className}`} title={`${clubName || 'Club'} Official Kit`}>
      <svg
        viewBox="0 0 160 140"
        className="team-jersey-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="jersey-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.4" />
          </filter>

          {/* Vertical Stripes pattern for Barcelona, Atletico, Betis, Athletic, Real Sociedad, Espanyol, Depor, Malaga */}
          <pattern id={`stripes-${kit.shortName}`} width="24" height="140" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="12" height="140" fill={kit.baseColor} />
            <rect x="12" y="0" width="12" height="140" fill={kit.stripeColor || kit.secondary} />
          </pattern>

          {/* Shading gradient for realistic kit fabric folds */}
          <linearGradient id="fabric-shading" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#000" stopOpacity="0.35" />
            <stop offset="25%" stopColor="#fff" stopOpacity="0.12" />
            <stop offset="50%" stopColor="#000" stopOpacity="0.0" />
            <stop offset="75%" stopColor="#fff" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.35" />
          </linearGradient>

          {/* Collar shadow */}
          <linearGradient id="collar-shadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#000" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        <g filter="url(#jersey-shadow)">
          {/* Main Torso & Sleeves path */}
          <path
            d="M 52,24
               L 30,34 L 14,70 L 36,80 L 46,54
               L 46,134 L 114,134 L 114,54
               L 124,80 L 146,70 L 130,34 L 108,24
               Q 80,36 52,24 Z"
            fill={kit.pattern === 'stripes' ? `url(#stripes-${kit.shortName})` : kit.baseColor}
            stroke={kit.trim || '#222'}
            strokeWidth="1.5"
          />

          {/* Diagonal sash for Rayo Vallecano */}
          {kit.pattern === 'sash' && (
            <path
              d="M 108,24 L 38,134 L 56,134 L 126,24 Z"
              fill={kit.stripeColor}
            />
          )}

          {/* Horizontal chest band for Elche */}
          {kit.pattern === 'hoops' && (
            <rect
              x="46"
              y="68"
              width="68"
              height="24"
              fill={kit.stripeColor}
            />
          )}

          {/* Sleeve Cuffs */}
          <path d="M 14,70 L 36,80 L 33,86 L 11,76 Z" fill={kit.collarColor} />
          <path d="M 146,70 L 124,80 L 127,86 L 149,76 Z" fill={kit.collarColor} />

          {/* Fabric realistic lighting overlay */}
          <path
            d="M 52,24
               L 30,34 L 14,70 L 36,80 L 46,54
               L 46,134 L 114,134 L 114,54
               L 124,80 L 146,70 L 130,34 L 108,24
               Q 80,36 52,24 Z"
            fill="url(#fabric-shading)"
            opacity="0.65"
          />

          {/* Modern Athletic V-Collar */}
          <path
            d="M 54,23 Q 80,48 106,23 Q 80,32 54,23 Z"
            fill={kit.collarColor}
            stroke="rgba(0,0,0,0.3)"
            strokeWidth="1"
          />
          <path
            d="M 68,26 Q 80,42 92,26 Q 80,32 68,26 Z"
            fill="url(#collar-shadow)"
          />

          {/* Club Crest (Left chest) */}
          {kit.crest ? (
            <image
              href={kit.crest}
              x="54"
              y="48"
              width="18"
              height="18"
              preserveAspectRatio="xMidYMid meet"
            />
          ) : (
            <circle cx="63" cy="57" r="8" fill={kit.collarColor} stroke="#fff" strokeWidth="1" />
          )}

          {/* Kit Supplier / Swoosh / Stripe on right chest */}
          <path
            d="M 98,54 Q 104,50 108,53 Q 104,57 98,54 Z"
            fill={kit.trim === '#ffffff' ? '#ffffff' : (kit.primary === '#ffffff' ? '#e5b332' : '#ffffff')}
            opacity="0.85"
          />

          {/* Sponsor Typography on center chest */}
          {kit.sponsor && (
            <text
              x="80"
              y="86"
              textAnchor="middle"
              fill={kit.primary === '#ffffff' ? '#111827' : '#ffffff'}
              fontSize="8.5"
              fontWeight="800"
              letterSpacing="0.8"
              fontFamily="var(--font-heading, sans-serif)"
              filter="drop-shadow(0 1px 2px rgba(0,0,0,0.6))"
            >
              {kit.sponsor}
            </text>
          )}

          {/* Shirt Number */}
          {number && (
            <text
              x="80"
              y="118"
              textAnchor="middle"
              fill={kit.primary === '#ffffff' ? '#111827' : '#ffffff'}
              fontSize="16"
              fontWeight="900"
              letterSpacing="1"
              fontFamily="var(--font-heading, sans-serif)"
              stroke="rgba(0,0,0,0.5)"
              strokeWidth="0.75"
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.7))"
            >
              {number}
            </text>
          )}
        </g>
      </svg>
    </div>
  );
};

export default TeamJersey;
