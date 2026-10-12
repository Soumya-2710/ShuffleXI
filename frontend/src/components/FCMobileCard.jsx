import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSquad } from '../context/SquadContext';
import PlayerAvatar from './PlayerAvatar';
import { getFCPlayerName } from '../utils/fcFormatting';
import './FCMobileCard.css';

const FCMobileCard = ({
  player,
  size = 'md', // 'sm', 'md', 'lg', 'hero'
  onSelectForSlot,
  isSlotPicker = false,
  showActions = true,
  interactive = true,
  className = ''
}) => {
  const { isPlayerInSquad, addPlayer, formationSlots, slots, getPositionGroup } = useSquad();
  const [isFlipped, setIsFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50 });
  const cardRef = useRef(null);

  if (!player) return null;

  const alreadyInSquad = isPlayerInSquad(player._id);
  const playerGroup = getPositionGroup(player.position);
  const fcSurname = getFCPlayerName(player.name);
  const clubName = typeof player.club === 'object' ? player.club?.name : player.club;
  const clubLogo = typeof player.club === 'object' ? player.club?.logo : null;

  // Tier classification matching EA FC Mobile
  const getFCTier = (ovr) => {
    if (ovr >= 88) return 'fc-tier-toty'; // TOTY / Prime Icon
    if (ovr >= 83) return 'fc-tier-gold'; // Master Gold
    if (ovr >= 78) return 'fc-tier-platinum'; // Platinum Elite
    return 'fc-tier-silver'; // Silver Core
  };

  const getPosClass = (pos) => {
    if (['GK'].includes(pos)) return 'fc-pos-gk';
    if (['CB', 'LB', 'RB'].includes(pos)) return 'fc-pos-def';
    if (['CDM', 'CM', 'CAM'].includes(pos)) return 'fc-pos-mid';
    return 'fc-pos-atk';
  };

  const tierClass = getFCTier(player.overall);
  const posClass = getPosClass(player.position);

  // 3D Parallax tilt effect
  const handleMouseMove = (e) => {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -12;
    const rotY = ((x - centerX) / centerX) * 12;
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ x: rotX, y: rotY, glareX, glareY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
  };

  const handleAutoAddToSquad = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let targetIndex = formationSlots.findIndex(
      (slot, idx) => !slots[idx] && slot.group === playerGroup
    );
    if (targetIndex === -1) {
      targetIndex = slots.findIndex((slot) => slot === null);
    }
    if (targetIndex !== -1) {
      addPlayer(targetIndex, player);
    }
  };

  const handleCardClick = (e) => {
    // If clicking on button or link, don't flip
    if (e.target.closest('button') || e.target.closest('a')) return;
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      ref={cardRef}
      className={`fc-mobile-card-container size-${size} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      style={{
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
      }}
    >
      <div className={`fc-mobile-card ${tierClass} ${isFlipped ? 'is-flipped' : ''}`}>
        {/* Holographic light sheen reflection */}
        <div
          className="fc-card-glare"
          style={{
            background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 65%)`
          }}
        />

        {/* ================= CARD FRONT ================= */}
        <div className="fc-card-front">
          {/* Card Frame Header: OVR + Position + Nation + Club */}
          <div className="fc-header-pill">
            <div className="fc-ovr-box">
              <span className="fc-ovr-number">{player.overall}</span>
              <span className={`fc-pos-badge ${posClass}`}>{player.position}</span>
            </div>

            <div className="fc-meta-icons">
              {player.number && (
                <span className="fc-squad-number" title={`Squad #${player.number}`}>
                  #{player.number}
                </span>
              )}
              {clubLogo && (
                <img
                  src={clubLogo}
                  alt={clubName}
                  className="fc-club-crest"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
              {player.nationality && (
                <span className="fc-nation-code" title={player.nationality}>
                  {player.nationality.slice(0, 3).toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* Player Portrait with Authentic Team Jersey */}
          <div className="fc-hero-avatar-zone">
            <PlayerAvatar
              player={player}
              size={size === 'hero' ? 'xl' : size === 'reel' ? 'reel' : 'lg'}
              showJersey={true}
            />
            <div className="fc-avatar-vignette" />
          </div>

          {/* FC Mobile Angular Nameplate */}
          <div className="fc-nameplate">
            <div className="fc-name-banner">
              <h3 className="fc-surname">{fcSurname}</h3>
              {player.name !== fcSurname && (
                <span className="fc-fullname">{player.name}</span>
              )}
            </div>
            <div className="fc-club-banner">
              <span className="fc-club-title">{clubName || 'La Liga'}</span>
              {player.age && <span className="fc-age-pill">{player.age}y</span>}
            </div>
          </div>

          {/* FC Mobile 6-Attribute Strip */}
          <div className="fc-stats-strip">
            <div className="fc-stat-col">
              <span className="fc-stat-lbl">PAC</span>
              <span className={`fc-stat-val ${player.pace >= 85 ? 'val-high' : ''}`}>{player.pace}</span>
            </div>
            <div className="fc-stat-col">
              <span className="fc-stat-lbl">SHO</span>
              <span className={`fc-stat-val ${player.shooting >= 85 ? 'val-high' : ''}`}>{player.shooting}</span>
            </div>
            <div className="fc-stat-col">
              <span className="fc-stat-lbl">PAS</span>
              <span className={`fc-stat-val ${player.passing >= 85 ? 'val-high' : ''}`}>{player.passing}</span>
            </div>
            <div className="fc-stat-col">
              <span className="fc-stat-lbl">DRI</span>
              <span className={`fc-stat-val ${player.dribbling >= 85 ? 'val-high' : ''}`}>{player.dribbling}</span>
            </div>
            <div className="fc-stat-col">
              <span className="fc-stat-lbl">DEF</span>
              <span className={`fc-stat-val ${player.defending >= 85 ? 'val-high' : ''}`}>{player.defending}</span>
            </div>
            <div className="fc-stat-col">
              <span className="fc-stat-lbl">PHY</span>
              <span className={`fc-stat-val ${player.physical >= 85 ? 'val-high' : ''}`}>{player.physical}</span>
            </div>
          </div>

          {/* Skill stars & Flip hint */}
          <div className="fc-footer-strip">
            <div className="fc-stars">
              <span className="fc-star active">★</span>
              <span className="fc-star active">★</span>
              <span className="fc-star active">★</span>
              <span className="fc-star active">★</span>
              <span className={`fc-star ${player.overall >= 84 ? 'active' : ''}`}>★</span>
            </div>
            <span className="fc-flip-prompt" title="Click to view details">⟳ Details</span>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="fc-card-actions">
              {isSlotPicker ? (
                <button
                  type="button"
                  className={`fc-btn ${alreadyInSquad ? 'fc-btn-disabled' : 'fc-btn-select'}`}
                  disabled={alreadyInSquad}
                  onClick={() => onSelectForSlot(player)}
                >
                  {alreadyInSquad ? 'In Squad ✓' : 'Select'}
                </button>
              ) : (
                <>
                  <Link to={`/players/${player._id}`} className="fc-btn fc-btn-stats">
                    Stats
                  </Link>
                  <button
                    type="button"
                    className={`fc-btn ${alreadyInSquad ? 'fc-btn-disabled' : 'fc-btn-draft'}`}
                    disabled={alreadyInSquad}
                    onClick={handleAutoAddToSquad}
                  >
                    {alreadyInSquad ? 'In 11 ✓' : '+ Add'}
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* ================= CARD BACK ================= */}
        <div className="fc-card-back">
          <div className="fc-back-header">
            <h4 className="fc-back-title">{player.name}</h4>
            <span className="fc-back-ovr">{player.overall} {player.position}</span>
          </div>

          <div className="fc-back-bio-grid">
            <div className="fc-bio-item">
              <span className="fc-bio-k">Club</span>
              <span className="fc-bio-v">{clubName}</span>
            </div>
            <div className="fc-bio-item">
              <span className="fc-bio-k">Nation</span>
              <span className="fc-bio-v">{player.nationality}</span>
            </div>
            <div className="fc-bio-item">
              <span className="fc-bio-k">Squad #</span>
              <span className="fc-bio-v">#{player.number || '—'}</span>
            </div>
            <div className="fc-bio-item">
              <span className="fc-bio-k">Age</span>
              <span className="fc-bio-v">{player.age ? `${player.age} yrs` : '—'}</span>
            </div>
            <div className="fc-bio-item">
              <span className="fc-bio-k">Height</span>
              <span className="fc-bio-v">{player.height || '—'}</span>
            </div>
            <div className="fc-bio-item">
              <span className="fc-bio-k">Status</span>
              <span className="fc-bio-v">{player.isStarter ? '⭐ Starter' : 'Sub'}</span>
            </div>
          </div>

          <div className="fc-back-stats-radar">
            <div className="fc-radar-bar">
              <span className="fc-r-label">Pace</span>
              <div className="fc-r-track"><div className="fc-r-fill" style={{ width: `${player.pace}%` }} /></div>
              <span className="fc-r-num">{player.pace}</span>
            </div>
            <div className="fc-radar-bar">
              <span className="fc-r-label">Shooting</span>
              <div className="fc-r-track"><div className="fc-r-fill" style={{ width: `${player.shooting}%` }} /></div>
              <span className="fc-r-num">{player.shooting}</span>
            </div>
            <div className="fc-radar-bar">
              <span className="fc-r-label">Passing</span>
              <div className="fc-r-track"><div className="fc-r-fill" style={{ width: `${player.passing}%` }} /></div>
              <span className="fc-r-num">{player.passing}</span>
            </div>
            <div className="fc-radar-bar">
              <span className="fc-r-label">Dribbling</span>
              <div className="fc-r-track"><div className="fc-r-fill" style={{ width: `${player.dribbling}%` }} /></div>
              <span className="fc-r-num">{player.dribbling}</span>
            </div>
            <div className="fc-radar-bar">
              <span className="fc-r-label">Defending</span>
              <div className="fc-r-track"><div className="fc-r-fill" style={{ width: `${player.defending}%` }} /></div>
              <span className="fc-r-num">{player.defending}</span>
            </div>
            <div className="fc-radar-bar">
              <span className="fc-r-label">Physical</span>
              <div className="fc-r-track"><div className="fc-r-fill" style={{ width: `${player.physical}%` }} /></div>
              <span className="fc-r-num">{player.physical}</span>
            </div>
          </div>

          <button
            type="button"
            className="fc-btn fc-btn-flip-back"
            onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}
          >
            ← View Card Front
          </button>
        </div>
      </div>
    </div>
  );
};

export default FCMobileCard;
