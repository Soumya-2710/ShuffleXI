import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axiosClient';
import './ClubsPage.css';

const ClubsPage = () => {
  const { leagueId } = useParams();
  const [league, setLeague] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [playerCounts, setPlayerCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [leagueRes, clubsRes, playersRes] = await Promise.all([
          api.get(`/leagues/${leagueId}`),
          api.get(`/clubs?league=${leagueId}`),
          api.get(`/players?league=${leagueId}`),
        ]);

        if (leagueRes.data?.success) {
          setLeague(leagueRes.data.data);
        }

        if (clubsRes.data?.success) {
          setClubs(clubsRes.data.data);
        }

        if (playersRes.data?.success) {
          const counts = {};
          playersRes.data.data.forEach((p) => {
            const cId = typeof p.club === 'object' ? p.club._id : p.club;
            counts[cId] = (counts[cId] || 0) + 1;
          });
          setPlayerCounts(counts);
        }
      } catch (err) {
        setError('Failed to load clubs for this league.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [leagueId]);

  return (
    <div className="page clubs-page">
      <div className="container">
        <div className="breadcrumb-nav">
          <Link to="/leagues" className="breadcrumb-link">
            ← Back to All Leagues
          </Link>
        </div>

        <div className="page-header">
          <div className="page-header-pre">
            <span className="badge badge-green">{league?.country || 'League'}</span>
          </div>
          <h1 className="page-title">{league?.name || 'Clubs'}</h1>
          <p className="page-subtitle">
            Select a club to view its roster, player attributes, and scout additions for your squad.
          </p>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : error ? (
          <div className="error-banner card">{error}</div>
        ) : clubs.length === 0 ? (
          <div className="empty-state card">
            <h3>No clubs found</h3>
            <p>No clubs registered under this league yet.</p>
          </div>
        ) : (
          <div className="grid-3 stagger">
            {clubs.map((club) => (
              <Link
                key={club._id}
                to={`/clubs/${club._id}`}
                className="club-card card"
              >
                <div className="club-badge-icon">
                  {club.logo ? (
                    <img
                      src={club.logo}
                      alt={club.name}
                      className="club-crest-img"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling && (e.target.nextSibling.style.display = 'inline');
                      }}
                    />
                  ) : null}
                  <span style={{ display: club.logo ? 'none' : 'inline' }}>🛡️</span>
                </div>
                <div className="club-info">
                  <h3 className="club-name">{club.name}</h3>
                  <p className="club-stadium">🏟️ {club.stadium || 'Home Stadium'}</p>
                </div>
                <div className="club-footer">
                  <span className="badge badge-gold">
                    {playerCounts[club._id] || 0} Players
                  </span>
                  <span className="view-squad-link">View Squad →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubsPage;
