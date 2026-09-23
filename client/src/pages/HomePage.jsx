import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosClient';
import { useSquad } from '../context/SquadContext';
import './HomePage.css';

const HomePage = () => {
  const { filledCount } = useSquad();
  const [stats, setStats] = useState({ leagues: 2, clubs: 6, players: 48 });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [lRes, cRes, pRes] = await Promise.all([
          api.get('/leagues'),
          api.get('/clubs'),
          api.get('/players'),
        ]);
        setStats({
          leagues: lRes.data?.count || 2,
          clubs: cRes.data?.count || 6,
          players: pRes.data?.count || 48,
        });
      } catch (err) {
        console.error('Failed to load stats', err);
      }
    };
    fetchCounts();
  }, []);

  return (
    <div className="page home-page">
      <div className="container">
        {/* Hero Section */}
        <section className="hero-section fade-in">
          <div className="hero-badge badge badge-green">
            ⚡ Version 1 — Squad Builder & Core Engine
          </div>
          <h1 className="hero-title">
            BUILD YOUR ULTIMATE <br />
            <span className="hero-gradient-text">FOOTBALL SQUAD</span>
          </h1>
          <p className="hero-description">
            Browse world-class leagues, inspect real player statistics, construct your dream 11 in a 4-3-3 tactical system, and watch your team rating calculate with position-fit accuracy.
          </p>

          <div className="hero-cta-group">
            <Link to="/squad" className="btn btn-primary hero-btn">
              <span>⚽ Open Squad Builder</span>
              <span className="badge badge-gold" style={{ color: '#000' }}>
                {filledCount}/11 Ready
              </span>
            </Link>
            <Link to="/leagues" className="btn btn-secondary hero-btn">
              <span>🏆 Browse Leagues & Clubs</span>
            </Link>
          </div>

          {/* Quick Counter Grid */}
          <div className="hero-stats-grid stagger">
            <div className="hero-stat-card card">
              <span className="stat-number">{stats.leagues}</span>
              <span className="stat-name">Major Leagues</span>
            </div>
            <div className="hero-stat-card card">
              <span className="stat-number">{stats.clubs}</span>
              <span className="stat-name">Clubs</span>
            </div>
            <div className="hero-stat-card card">
              <span className="stat-number">{stats.players}</span>
              <span className="stat-name">Unique Players</span>
            </div>
            <div className="hero-stat-card card">
              <span className="stat-number">4-3-3</span>
              <span className="stat-name">Tactical Formation</span>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="features-section">
          <h2 className="section-title">Engine Features in Version 1</h2>
          <div className="grid-3 stagger">
            <div className="feature-card card">
              <div className="feature-icon">🔍</div>
              <h3 className="feature-heading">League & Club Directory</h3>
              <p className="feature-body">
                Drill down from top leagues to respective clubs and inspect full squad rosters with position tagging and overall ratings.
              </p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-heading">Detailed Player Cards</h3>
              <p className="feature-body">
                View six key performance attributes: Pace, Shooting, Passing, Dribbling, Defending, and Physical stats with tier classifications.
              </p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon">🎯</div>
              <h3 className="feature-heading">Tactical 4-3-3 Pitch</h3>
              <p className="feature-body">
                Slot players directly onto the pitch. The engine enforces position-fit rules, applying a -3 OVR penalty to out-of-position selections.
              </p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon">⚖️</div>
              <h3 className="feature-heading">Weighted Team Rating</h3>
              <p className="feature-body">
                Calculates overall chemistry with exact weights: Goalkeeper (10%), Defense (30%), Midfield (30%), Attack (30%).
              </p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon">🔗</div>
              <h3 className="feature-heading">REST API Verified</h3>
              <p className="feature-body">
                Client squad compositions can be sent to the Express backend endpoint to recalculate and verify team ratings server-side.
              </p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon">🚀</div>
              <h3 className="feature-heading">Scalable Architecture</h3>
              <p className="feature-body">
                Structured cleanly for upcoming V2 features: matchmaking, lucky pack openings, opponent simulation, and PvP battles.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
