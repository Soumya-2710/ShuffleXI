import React from 'react';
import { Link } from 'react-router-dom';
import { useSquad } from '../context/SquadContext';
import PlayerAvatar from './PlayerAvatar';
import { getFCPlayerName } from '../utils/fcFormatting';
import './PlayerCard.css';

const PlayerCard = ({ player, onSelectForSlot, isSlotPicker = false, currentSlotGroup = null }) => {
  const { isPlayerInSquad, addPlayer, formationSlots, slots, getPositionGroup } = useSquad();
  const alreadyInSquad = isPlayerInSquad(player._id);

  // Position group check
  const playerGroup = getPositionGroup(player.position);
  const isOptimalPosition = currentSlotGroup ? playerGroup === currentSlotGroup : true;

  const getTierClass = (overall) => {
    if (overall >= 86) return 'card-tier-elite';
    if (overall >= 82) return 'card-tier-gold';
    return 'card-tier-silver';
  };

  const getPositionBadgeClass = (pos) => {
    if (['GK'].includes(pos)) return 'badge-gk';
    if (['CB', 'LB', 'RB'].includes(pos)) return 'badge-def';
    if (['CDM', 'CM', 'CAM'].includes(pos)) return 'badge-mid';
    return 'badge-atk';
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

  const fcSurname = getFCPlayerName(player.name);

  return (
    <div className={`player-card ${getTierClass(player.overall)}`}>
      <div className="player-card-header">
        <div className="player-badges">
          {player.number && (
            <span className="player-number-badge" title={`Squad #${player.number}`}>
              #{player.number}
            </span>
          )}
          <span className={`player-pos-badge ${getPositionBadgeClass(player.position)}`}>
            {player.position}
          </span>
          <span className="player-nat">{player.nationality}</span>
          {player.age && (
            <span className="player-age-badge" title={`Age: ${player.age} years`}>
              {player.age}y
            </span>
          )}
          {player.club?.logo && (
            <img src={player.club.logo} alt={player.club.name} className="player-card-club-logo" />
          )}
        </div>
        <div className="player-ovr-badge">
          <span className="ovr-number">{player.overall}</span>
          <span className="ovr-label">OVR</span>
        </div>
      </div>

      <div className="player-card-body">
        <PlayerAvatar player={player} size="card" />
        <h4 className="player-name" title={player.name}>
          {fcSurname}
        </h4>
        <p className="player-team">
          {player.name !== fcSurname ? player.name : ''} {player.club?.name ? `• ${player.club.name}` : ''}
        </p>

        {isSlotPicker && currentSlotGroup && !isOptimalPosition && (
          <div className="position-warning">
            ⚠️ Out of position (-3 OVR penalty)
          </div>
        )}

        <div className="player-stats-grid">
          <div className="stat-pill"><span className="stat-label">PAC</span> {player.pace}</div>
          <div className="stat-pill"><span className="stat-label">SHO</span> {player.shooting}</div>
          <div className="stat-pill"><span className="stat-label">PAS</span> {player.passing}</div>
          <div className="stat-pill"><span className="stat-label">DRI</span> {player.dribbling}</div>
          <div className="stat-pill"><span className="stat-label">DEF</span> {player.defending}</div>
          <div className="stat-pill"><span className="stat-label">PHY</span> {player.physical}</div>
        </div>
      </div>

      <div className="player-card-actions">
        {isSlotPicker ? (
          <button
            type="button"
            className={`btn btn-sm ${alreadyInSquad ? 'btn-secondary' : 'btn-primary'}`}
            disabled={alreadyInSquad}
            onClick={() => onSelectForSlot(player)}
          >
            {alreadyInSquad ? 'Already in Squad' : 'Select for Slot'}
          </button>
        ) : (
          <>
            <Link to={`/players/${player._id}`} className="btn btn-secondary btn-sm">
              Stats
            </Link>
            <button
              type="button"
              className={`btn btn-sm ${alreadyInSquad ? 'btn-secondary' : 'btn-primary'}`}
              disabled={alreadyInSquad}
              onClick={handleAutoAddToSquad}
            >
              {alreadyInSquad ? 'In Squad ✓' : '+ Add'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PlayerCard;
