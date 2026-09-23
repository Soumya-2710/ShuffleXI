import React from 'react';
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

  return (
    <div
      className={`squad-slot ${isFilled ? 'filled' : 'empty'} ${
        isFilled && !isInPosition ? 'slot-penalty' : ''
      }`}
      onClick={() => onSlotClick(slotDef.index)}
    >
      {isFilled ? (
        <div className="slot-player-content">
          <button
            type="button"
            className="slot-remove-btn"
            title="Remove player from squad"
            onClick={(e) => {
              e.stopPropagation();
              onRemovePlayer(slotDef.index);
            }}
          >
            ✕
          </button>

          <div className="slot-ovr-tag">
            <span className="slot-ovr-val">
              {player.overall - penalty}
            </span>
            {penalty > 0 && <span className="slot-penalty-indicator">(-3)</span>}
          </div>

          <div className="slot-pos-badge">{player.position}</div>
          <span className="slot-player-name">{player.name}</span>

          {!isInPosition && (
            <span className="slot-oop-pill" title="Out of natural position">
              OOP
            </span>
          )}
        </div>
      ) : (
        <div className="slot-empty-content">
          <span className="slot-target-label">{slotDef.label}</span>
          <span className="slot-plus-icon">+</span>
        </div>
      )}
    </div>
  );
};

export default SquadSlot;
