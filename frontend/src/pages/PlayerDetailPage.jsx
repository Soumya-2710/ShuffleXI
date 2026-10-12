import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axiosClient';
import RatingBar from '../components/RatingBar';
import PlayerAvatar from '../components/PlayerAvatar';
import FCMobileCard from '../components/FCMobileCard';
import { useSquad } from '../context/SquadContext';
import './PlayerDetailPage.css';

const PlayerDetailPage = () => {
  const { playerId } = useParams();
  const { isPlayerInSquad, addPlayer, formationSlots, slots, getPositionGroup } = useSquad();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/players/${playerId}`);
        if (res.data?.success) {
          setPlayer(res.data.data);
        }
      } catch (err) {
        setError('Player not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [playerId]);

  if (loading) {
    return (
      <div className="page player-detail-page">
        <div className="container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="page player-detail-page">
        <div className="container">
          <div className="error-banner card">{error || 'Player not found'}</div>
          <Link to="/leagues" className="btn btn-secondary" style={{ marginTop: 'var(--space-md)' }}>
            ← Back to Leagues
          </Link>
        </div>
      </div>
    );
  }

  const alreadyInSquad = isPlayerInSquad(player._id);
  const playerGroup = getPositionGroup(player.position);

  const handleAddPlayer = () => {
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

  return (
    <div className="page player-detail-page">
      <div className="container">
        <div className="breadcrumb-nav">
          {player.club && (
            <Link to={`/clubs/${player.club._id}`} className="breadcrumb-link">
              ← Back to {player.club.name} Squad
            </Link>
          )}
        </div>

        <div className="detail-layout">
          {/* Left Column: FC Mobile Hero Card Spotlight */}
          <div className="spotlight-card card">
            <div className="spotlight-fc-header">
              <span className="fc-spotlight-badge">⚡ FC MOBILE ULTIMATE EDITION</span>
            </div>

            <FCMobileCard player={player} size="hero" showActions={false} interactive={true} />

            <div className="spotlight-bio-facts">
              {player.number && (
                <div className="bio-fact-item">
                  <span className="bio-fact-label">Shirt</span>
                  <span className="bio-fact-val">#{player.number}</span>
                </div>
              )}
              {player.age && (
                <div className="bio-fact-item">
                  <span className="bio-fact-label">Age</span>
                  <span className="bio-fact-val">{player.age} yrs</span>
                </div>
              )}
              {player.height && (
                <div className="bio-fact-item">
                  <span className="bio-fact-label">Height</span>
                  <span className="bio-fact-val">{player.height}</span>
                </div>
              )}
              <div className="bio-fact-item">
                <span className="bio-fact-label">Role</span>
                <span className="bio-fact-val">{player.isStarter ? '⭐ Starter' : 'Sub'}</span>
              </div>
            </div>

            <div className="spotlight-actions">
              <button
                type="button"
                className={`btn ${alreadyInSquad ? 'btn-secondary' : 'btn-primary'}`}
                style={{ width: '100%' }}
                disabled={alreadyInSquad}
                onClick={handleAddPlayer}
              >
                {alreadyInSquad ? '✓ Already in Your 11' : '+ Draft into Squad'}
              </button>

              <Link to="/squad" className="btn btn-secondary" style={{ width: '100%', marginTop: 'var(--space-xs)' }}>
                View 4-3-3 Squad Pitch
              </Link>
            </div>
          </div>

          {/* Right Column: Detailed Performance Attributes */}
          <div className="attributes-card card">
            <div className="attributes-header">
              <h3 className="section-heading">Player Attribute Breakdown</h3>
              <span className="natural-role-tag">
                Tactical Group: <strong>{playerGroup}</strong>
              </span>
            </div>

            <p className="attributes-intro">
              Performance metrics calibrated on a standard 1–99 FIFA scale. Position-fit applies if used outside the {playerGroup} group.
            </p>

            <div className="rating-bars-stack">
              <RatingBar label="Pace (PAC)" value={player.pace} />
              <RatingBar label="Shooting (SHO)" value={player.shooting} />
              <RatingBar label="Passing (PAS)" value={player.passing} />
              <RatingBar label="Dribbling (DRI)" value={player.dribbling} />
              <RatingBar label="Defending (DEF)" value={player.defending} />
              <RatingBar label="Physicality (PHY)" value={player.physical} />
            </div>

            {/* Tactical Advice Box */}
            <div className="tactical-advice-box">
              <h4 className="advice-title">💡 Tactical Role Insights</h4>
              <p className="advice-body">
                {playerGroup === 'GK' && 'Essential shot-stopper contributing 10% towards the squad rating. Positioned directly in the goal slot.'}
                {playerGroup === 'DEF' && 'Key defensive anchor contributing 30% towards the squad rating. Excels at ball recoveries and aerial duels.'}
                {playerGroup === 'MID' && 'Midfield controller contributing 30% towards the squad rating. Distributes play and orchestrates transitions.'}
                {playerGroup === 'ATK' && 'Primary attacking threat contributing 30% towards the squad rating. Creates scoring opportunities and finishes in the final third.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerDetailPage;
