import React from 'react';
import PlayerAvatar from './PlayerAvatar';
import { getFCPlayerName, getCardTier } from '../utils/fcFormatting';
import './SquadSlot.css';

const SquadSlot = ({
  slotDef,
  player,
  onSlotClick,
  onRemovePlayer,
  getPositionGroup,
}) => {
  const isFilled = Boolean(player);

  let isInPosition = true;
  let penalty = 0;

  if (isFilled) {
    const playerGroup = getPositionGroup(player.position);
    isInPosition = playerGroup === slotDef.group;
    penalty = isInPosition ? 0 : 3;
  }

  const effectiveOvr = isFilled ? Math.max(1, player.overall - penalty) : 0;
  const tierClass = isFilled ? getCardTier(player.overall) : '';
  const surname = isFilled ? getFCPlayerName(player.name) : '';

  return (
    <div
      className={`fc-squad-slot ${isFilled ? 'is-filled' : 'is-empty'} ${tierClass} ${
        isFilled && !isInPosition ? 'is-oop' : ''
      }`}
      onClick={() => onSlotClick(slotDef.index)}
    >
      {isFilled ? (
        <div className="fc-card-frame">
          {/* Subtle Remove Button on hover */}
          <button
            type="button"
            className="fc-card-remove"
            title="Remove from squad"
            onClick={(e) => {
              e.stopPropagation();
              onRemovePlayer(slotDef.index);
            }}
          >
            ✕
          </button>

          {/* Card Top Row: Rating & Pos on Left, Club Logo on Right */}
          <div className="fc-card-header">
            <div className="fc-rating-stack">
              <span className="fc-ovr-num">{effectiveOvr}</span>
              <span className="fc-pos-pill">{player.position}</span>
              {penalty > 0 && <span className="fc-penalty-pill">-3</span>}
            </div>

            <div className="fc-crest-stack">
              {player.club?.logo ? (
                <img
                  src={player.club.logo}
                  alt={player.club?.name || 'Club'}
                  className="fc-crest-img"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : (
                <span className="fc-crest-fallback">⚽</span>
              )}
            </div>
          </div>

          {/* Central Cutout Stage */}
          <div className="fc-avatar-stage">
            <PlayerAvatar player={player} size="fc-slot" />
          </div>

          {/* Bottom Nametag Ribbon */}
          <div className="fc-nametag-banner">
            <span className="fc-nametag-text">{surname}</span>
            <div className="fc-rank-stars">
              <span className="star-gem">★</span>
              <span className="star-gem">★</span>
              <span className="star-gem">★</span>
            </div>
          </div>

          {/* Out of position badge */}
          {!isInPosition && (
            <div className="fc-oop-tag" title="Out of Position (-3 OVR penalty)">
              OOP
            </div>
          )}
        </div>
      ) : (
        /* Empty Slot Holographic Shield */
        <div className="fc-empty-hologram">
          <div className="fc-hologram-glow"></div>
          <span className="fc-empty-pos">{slotDef.label}</span>
          <div className="fc-empty-plus-circle">
            <span>+</span>
          </div>
          <span className="fc-empty-tag">ADD</span>
        </div>
      )}
    </div>
  );
};

export default SquadSlot;
