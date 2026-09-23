import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosClient';
import './LeaguesPage.css';

const LeaguesPage = () => {
  const [leagues, setLeagues] = useState([]);
  const [clubsCount, setClubsCount] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [leagueRes, clubsRes] = await Promise.all([
          api.get('/leagues'),
          api.get('/clubs'),
        ]);

        if (leagueRes.data?.success) {
          setLeagues(leagueRes.data.data);
        }

        if (clubsRes.data?.success) {
          const counts = {};
          clubsRes.data.data.forEach((club) => {
            const leagueId = typeof club.league === 'object' ? club.league._id : club.league;
            counts[leagueId] = (counts[leagueId] || 0) + 1;
          });
          setClubsCount(counts);
        }
      } catch (err) {
        setError('Failed to load leagues. Make sure the backend server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="page leagues-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Football Leagues</h1>
          <p className="page-subtitle">
            Explore major leagues, view participating clubs, and scout their player talent pools.
          </p>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : error ? (
          <div className="error-banner card">{error}</div>
        ) : (
          <div className="grid-2 stagger">
            {leagues.map((league) => (
              <Link
                key={league._id}
                to={`/leagues/${league._id}`}
                className="league-card card"
              >
                <div className="league-icon-box">
                  {league.name.includes('Premier') ? '🏴󠁧󠁢󠁥󠁮󠁧󠁿' : '🇪🇸'}
                </div>
                <div className="league-info">
                  <span className="league-country">{league.country}</span>
                  <h3 className="league-name">{league.name}</h3>
                  <div className="league-meta">
                    <span className="badge badge-green">
                      {clubsCount[league._id] || 0} Clubs Enrolled
                    </span>
                  </div>
                </div>
                <div className="league-arrow">➔</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaguesPage;
