import React, { useState } from 'react';
import api from '../api/axiosClient';
import { useSquad } from '../context/SquadContext';
import './TeamRating.css';

const TeamRating = () => {
  const { slots, rating, chemistry, filledCount, clearSquad } = useSquad();
  const [serverVerification, setServerVerification] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState(null);

  const isComplete = filledCount === 11;

  const handleVerifyWithBackend = async () => {
    if (!isComplete) return;

    setIsVerifying(true);
    setVerifyError(null);

    try {
      const payload = {
        squad: slots.map((player, idx) => ({
          playerId: player._id,
          slotIndex: idx,
        })),
      };

      const response = await api.post('/squad/rating', payload);
      if (response.data?.success) {
        setServerVerification(response.data.data);
      }
    } catch (err) {
      setVerifyError(err.response?.data?.message || 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="team-rating-card card">
      <div className="rating-card-header">
        <div>
          <h3 className="rating-card-title">EA FC 26 Squad</h3>
          <span className="rating-card-formation">Tactical: 4-3-3 Attack</span>
        </div>
        <div className="rating-badges-cluster">
          <div className="rating-overall-badge">
            <span className="overall-value">{rating ? rating.overall : '--'}</span>
            <span className="overall-label">OVR</span>
          </div>
          <div className="rating-chem-badge">
            <span className="chem-value">{chemistry?.chemistry || 0}</span>
            <span className="chem-label">CHEM</span>
          </div>
        </div>
      </div>

      <div className="squad-progress-section">
        <div className="progress-labels">
          <span>Squad Selection</span>
          <span className={isComplete ? 'complete-label' : ''}>{filledCount}/11 Players</span>
        </div>
        <div className="progress-track">
          <div
            className={`progress-fill ${isComplete ? 'progress-complete' : ''}`}
            style={{ width: `${(filledCount / 11) * 100}%` }}
          />
        </div>
      </div>

      {rating ? (
        <div className="rating-breakdown-list">
          <div className="breakdown-item">
            <span className="breakdown-name">Attack (30%)</span>
            <span className="breakdown-score badge-atk">{rating.atk}</span>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-name">Midfield (30%)</span>
            <span className="breakdown-score badge-mid">{rating.mid}</span>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-name">Defense (30%)</span>
            <span className="breakdown-score badge-def">{rating.def}</span>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-name">Goalkeeper (10%)</span>
            <span className="breakdown-score badge-gk">{rating.gk}</span>
          </div>
        </div>
      ) : (
        <div className="incomplete-squad-msg">
          <p>Fill all 11 positions on the pitch to unlock team rating breakdown and server validation.</p>
        </div>
      )}

      <div className="team-rating-actions">
        <button
          type="button"
          className="btn btn-primary"
          style={{ width: '100%' }}
          disabled={!isComplete || isVerifying}
          onClick={handleVerifyWithBackend}
        >
          {isVerifying ? 'Verifying with Backend...' : 'Verify Rating via API'}
        </button>

        {filledCount > 0 && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={clearSquad}
            style={{ width: '100%', marginTop: 'var(--space-xs)' }}
          >
            Clear Entire Squad
          </button>
        )}
      </div>

      {serverVerification && (
        <div className="server-verification-box">
          <div className="verification-header">
            <span>✓ Verified by Backend REST API</span>
          </div>
          <div className="verification-details">
            <span>Overall: <strong>{serverVerification.overall}</strong></span>
            <span>GK: {serverVerification.gk} | DEF: {serverVerification.def} | MID: {serverVerification.mid} | ATK: {serverVerification.atk}</span>
          </div>
        </div>
      )}

      {verifyError && (
        <div className="verification-error-box">
          ✕ {verifyError}
        </div>
      )}
    </div>
  );
};

export default TeamRating;
