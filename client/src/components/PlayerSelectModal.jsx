import React, { useState, useEffect } from 'react';
import api from '../api/axiosClient';
import PlayerCard from './PlayerCard';
import './PlayerSelectModal.css';

const PlayerSelectModal = ({
  isOpen,
  onClose,
  targetSlotIndex,
  slotDef,
  onSelectPlayer,
}) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [positionFilter, setPositionFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    const fetchPlayers = async () => {
      setLoading(true);
      try {
        const res = await api.get('/players');
        if (res.data?.success) {
          setPlayers(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load players', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [isOpen]);

  // Set default filter based on slot group when modal opens
  useEffect(() => {
    if (slotDef) {
      setPositionFilter(slotDef.group);
    }
  }, [slotDef]);

  if (!isOpen || !slotDef) return null;

  const filteredPlayers = players.filter((player) => {
    const matchesSearch = player.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (positionFilter === 'ALL') return true;
    if (positionFilter === 'GK') return player.position === 'GK';
    if (positionFilter === 'DEF') return ['CB', 'LB', 'RB'].includes(player.position);
    if (positionFilter === 'MID') return ['CDM', 'CM', 'CAM'].includes(player.position);
    if (positionFilter === 'ATK') return ['LW', 'RW', 'ST', 'CF'].includes(player.position);
    return true;
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Select Player for {slotDef.label}</h3>
            <p className="modal-subtitle">
              Slot role: <strong>{slotDef.group}</strong> ({slotDef.slot})
            </p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-filters">
          <input
            type="text"
            className="search-input"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="filter-pills">
            {['ALL', 'GK', 'DEF', 'MID', 'ATK'].map((grp) => (
              <button
                key={grp}
                type="button"
                className={`pill-btn ${positionFilter === grp ? 'active' : ''}`}
                onClick={() => setPositionFilter(grp)}
              >
                {grp === 'ALL' ? 'All Roles' : grp}
              </button>
            ))}
          </div>
        </div>

        <div className="modal-players-list">
          {loading ? (
            <div className="spinner"></div>
          ) : filteredPlayers.length === 0 ? (
            <div className="empty-state">
              <p>No players match the criteria.</p>
            </div>
          ) : (
            <div className="modal-players-grid">
              {filteredPlayers.map((player) => (
                <PlayerCard
                  key={player._id}
                  player={player}
                  isSlotPicker={true}
                  currentSlotGroup={slotDef.group}
                  onSelectForSlot={(selected) => {
                    onSelectPlayer(targetSlotIndex, selected);
                    onClose();
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerSelectModal;
