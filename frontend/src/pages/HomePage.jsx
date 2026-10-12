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
            ⚡ EA SPORTS FC 26 — 2026/27 SEASON EDITION
          </div>
          <h1 className="hero-title">
            BUILD YOUR ULTIMATE <br />
            <span className="hero-gradient-text">EA SPORTS FC 26 SQUAD</span>
          </h1>
          <p className="hero-description">
            Experience authentic FC 26 Ultimate Team squads, transparent player headshots, real 2026/27 rosters across 5 major leagues, and high-stakes Squad Shuffle Roulette.
          </p>

          <div className="hero-cta-group">
            <Link to="/shuffle" className="btn btn-primary hero-btn" style={{ background: 'linear-gradient(135deg, #00e676 0%, #00b0ff 100%)', color: '#050b14', fontWeight: 800 }}>
              <span>🎰 Play Squad Shuffle Roulette</span>
              <span className="badge badge-gold" style={{ color: '#000' }}>
                NEW ARCADE
              </span>
            </Link>
            <Link to="/squad" className="btn btn-secondary hero-btn">
              <span>⚽ Squad Builder</span>
              <span className="badge badge-green">
                {filledCount}/11 Ready
              </span>
            </Link>
            <Link to="/leagues" className="btn btn-secondary hero-btn">
              <span>🏆 Browse Leagues</span>
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
              <span className="stat-name">Real Players</span>
            </div>
            <div className="hero-stat-card card">
              <span className="stat-number">🎰</span>
              <span className="stat-name">Shuffle Roulette</span>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="features-section">
          <h2 className="section-title">Engine Features & Game Modes</h2>
          <div className="grid-3 stagger">
            <div className="feature-card card" style={{ border: '1px solid rgba(0, 230, 118, 0.4)', background: 'linear-gradient(180deg, rgba(0, 230, 118, 0.08) 0%, rgba(10, 14, 26, 0.6) 100%)' }}>
              <div className="feature-icon">🎰</div>
              <h3 className="feature-heading">Squad Shuffle Roulette</h3>
              <p className="feature-body">
                Fast-paced roulette game: spin through candidate cards, manage limited rerolls, lock slots, and maximize squad chemistry (0 to 33) across 5 major leagues.
              </p>
            </div>
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
