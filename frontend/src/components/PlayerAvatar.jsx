import React, { useState } from 'react';
import playerImageMap from '../data/playerImageMap.json';
import './PlayerAvatar.css';

const PlayerAvatar = ({ player, size = 'md', className = '' }) => {
  const [hasError, setHasError] = useState(false);

  if (!player) return null;

  // Resolve image URL from player object, playerImageMap, or thumbnail
  const mapData = player.name ? playerImageMap[player.name] : null;
  const imageUrl =
    player.image ||
    (mapData && mapData.image) ||
    player.thumbnail ||
    (mapData && mapData.thumbnail) ||
    null;

  const initials = player.name
    ? player.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'FC';

  // Check if image is an official transparent cutout (like TheSportsDB / EA FC render)
  const isCutout =
    Boolean(imageUrl) &&
    (imageUrl.includes('cutout') ||
      imageUrl.startsWith('/players/') ||
      imageUrl.includes('thesportsdb') ||
      (mapData && mapData.isCutout));

  return (
    <div className={`player-avatar-wrapper size-${size} ${className}`}>
      {imageUrl && !hasError ? (
        <div className="player-composite-frame">
          <img
            src={imageUrl}
            alt={player.name}
            className={`player-avatar-img ${isCutout ? 'is-cutout' : 'is-photo'}`}
            onError={() => setHasError(true)}
            loading="lazy"
          />
        </div>
      ) : (
        <div className="player-avatar-fallback">
          <div className="fc-silhouette-container">
            <svg
              className="avatar-silhouette"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <span className="avatar-initials">{initials}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerAvatar;
