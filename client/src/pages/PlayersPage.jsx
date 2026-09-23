import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axiosClient';
import PlayerCard from '../components/PlayerCard';
import './PlayersPage.css';

const PlayersPage = () => {
  const { clubId } = useParams();
  const [club, setClub] = useState(null);
  const [players, setPlayers] = useState([]);
  const [positionFilter, setPositionFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('overall');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [clubRes, playersRes] = await Promise.all([
          api.get(`/clubs/${clubId}`),
          api.get(`/players?club=${clubId}`),
        ]);

        if (clubRes.data?.success) {
          setClub(clubRes.data.data);
        }

        if (playersRes.data?.success) {
          setPlayers(playersRes.data.data);
        }
      } catch (err) {
        setError('Failed to load club roster.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clubId]);

  // Filter logic
  const filteredPlayers = players.filter((player) => {
    if (positionFilter === 'ALL') return true;
    if (positionFilter === 'GK') return player.position === 'GK';
    if (positionFilter === 'DEF') return ['CB', 'LB', 'RB'].includes(player.position);
    if (positionFilter === 'MID') return ['CDM', 'CM', 'CAM'].includes(player.position);
    if (positionFilter === 'ATK') return ['LW', 'RW', 'ST', 'CF'].includes(player.position);
    return true;
  });

  // Sort logic
  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    return (b[sortBy] || 0) - (a[sortBy] || 0);
  });

  return (
    <div className="page players-page">
      <div className="container">
        <div className="breadcrumb-nav">
          {club?.league && (
            <Link
              to={`/leagues/${typeof club.league === 'object' ? club.league._id : club.league}`}
              className="breadcrumb-link"
            >
              ← Back to {club.league.name || 'League Clubs'}
            </Link>
          )}
        </div>

        <div className="page-header">
          <div className="club-header-banner">
            <div>
              <div className="page-header-pre">
                <span className="badge badge-green">
                  {club?.league?.name || 'League'}
                </span>
                <span className="badge badge-gold" style={{ marginLeft: '6px' }}>
                  {club?.stadium || 'Home Ground'}
                </span>
              </div>
              <h1 className="page-title">{club?.name || 'Club Roster'}</h1>
              <p className="page-subtitle">
                Inspect player attributes and click <strong>+ Add</strong> to draft players into your squad.
              </p>
            </div>
          </div>
        </div>

        {/* Filter and Sort Toolbar */}
        <div className="roster-toolbar card">
          <div className="filter-group">
            <span className="toolbar-label">Position:</span>
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

          <div className="sort-group">
            <span className="toolbar-label">Sort by:</span>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="overall">Overall Rating</option>
              <option value="pace">Pace (PAC)</option>
              <option value="shooting">Shooting (SHO)</option>
              <option value="passing">Passing (PAS)</option>
              <option value="dribbling">Dribbling (DRI)</option>
              <option value="defending">Defending (DEF)</option>
              <option value="physical">Physical (PHY)</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : error ? (
          <div className="error-banner card">{error}</div>
        ) : sortedPlayers.length === 0 ? (
          <div className="empty-state card">
            <h3>No players found</h3>
            <p>No players match the selected position filter.</p>
          </div>
        ) : (
          <div className="grid-4 stagger">
            {sortedPlayers.map((player) => (
              <PlayerCard key={player._id} player={player} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayersPage;
