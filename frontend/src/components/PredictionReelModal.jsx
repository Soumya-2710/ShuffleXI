import React, { useState, useEffect, useRef } from 'react';
import FCMobileCard from './FCMobileCard';
import PlayerAvatar from './PlayerAvatar';
import { REEL_LEAGUES, getLeagueMetadata } from '../utils/leagueReelData';
import {
  playTick,
  playLock,
  playWhoosh,
  playBassDrop,
  playPackOpening,
} from '../utils/audioEffects';
import { triggerConfetti } from '../utils/confetti';
import './PredictionReelModal.css';

const PredictionReelModal = ({
  isOpen,
  targetSlot,
  chosenPlayer,
  allClubs = [],
  onConfirmPlace,
  onReroll,
  onClose,
  rerollsLeft = 0,
  canReroll = true,
}) => {
  // Animation phases: 'LEAGUE' | 'CLUB' | 'WALKOUT' | 'SHOWCASE'
  const [phase, setPhase] = useState('LEAGUE');

  // Reel states
  const [activeLeagueIdx, setActiveLeagueIdx] = useState(0);
  const [lockedLeague, setLockedLeague] = useState(null);

  const [activeClubIdx, setActiveClubIdx] = useState(0);
  const [clubCandidates, setClubCandidates] = useState([]);
  const [lockedClub, setLockedClub] = useState(null);

  // Walkout suspense steps: 0=start, 1=pos, 2=nat, 3=ovr, 4=full card!
  const [walkoutStep, setWalkoutStep] = useState(0);

  // Timers ref for cleanup
  const timersRef = useRef([]);

  const clearAllTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  useEffect(() => {
    if (!isOpen || !chosenPlayer) {
      clearAllTimers();
      setPhase('LEAGUE');
      setLockedLeague(null);
      setLockedClub(null);
      setWalkoutStep(0);
      return;
    }

    clearAllTimers();
    setPhase('LEAGUE');
    setLockedLeague(null);
    setLockedClub(null);
    setWalkoutStep(0);

    // Identify target league & target club for chosen player
    const playerLeagueName =
      typeof chosenPlayer.league === 'object'
        ? chosenPlayer.league?.name
        : chosenPlayer.league || 'La Liga';

    const targetLeagueMeta = getLeagueMetadata(playerLeagueName);

    const playerClubName =
      typeof chosenPlayer.club === 'object'
        ? chosenPlayer.club?.name
        : chosenPlayer.club || 'Club';

    const playerClubLogo =
      typeof chosenPlayer.club === 'object' ? chosenPlayer.club?.logo : null;

    // Filter clubs belonging to target league
    let leagueClubs = allClubs.filter((c) => {
      const cLeague = typeof c.league === 'object' ? c.league?.name : c.league;
      return (
        cLeague &&
        cLeague.toLowerCase().includes(targetLeagueMeta.name.toLowerCase())
      );
    });

    if (leagueClubs.length < 3) {
      // Fallback sample clubs
      leagueClubs = targetLeagueMeta.sampleClubs.map((name) => ({
        name,
        logo: name === playerClubName ? playerClubLogo : null,
      }));
    }

    // Ensure the actual player's club is in the list
    if (!leagueClubs.some((c) => c.name === playerClubName)) {
      leagueClubs.push({ name: playerClubName, logo: playerClubLogo });
    }

    setClubCandidates(leagueClubs);

    // ----------------------------------------------------
    // STAGE 1: LEAGUE ROULETTE (TikTok / YouTube Reel Style)
    // ----------------------------------------------------
    const targetLeagueIndex = Math.max(
      0,
      REEL_LEAGUES.findIndex((l) => l.name === targetLeagueMeta.name)
    );

    const leagueTicks = 14;
    let currentTick = 0;

    const runLeagueTick = () => {
      currentTick++;
      setActiveLeagueIdx((prev) => (prev + 1) % REEL_LEAGUES.length);
      playTick();

      if (currentTick < leagueTicks) {
        // Decelerate
        const delay = 40 + Math.pow(currentTick / leagueTicks, 2) * 160;
        const t = setTimeout(runLeagueTick, delay);
        timersRef.current.push(t);
      } else {
        // Lock in the chosen league!
        setActiveLeagueIdx(targetLeagueIndex);
        setLockedLeague(targetLeagueMeta);
        playLock();

        // Pause 750ms to celebrate league lock, then move to CLUB
        const t2 = setTimeout(() => {
          playWhoosh();
          startClubRoulette(leagueClubs, playerClubName, targetLeagueMeta);
        }, 800);
        timersRef.current.push(t2);
      }
    };

    const initialTimer = setTimeout(runLeagueTick, 200);
    timersRef.current.push(initialTimer);

    return () => clearAllTimers();
  }, [isOpen, chosenPlayer, allClubs]);

  // ----------------------------------------------------
  // STAGE 2: CLUB ROULETTE
  // ----------------------------------------------------
  const startClubRoulette = (clubs, targetClubName, leagueMeta) => {
    setPhase('CLUB');
    const targetClubIndex = Math.max(
      0,
      clubs.findIndex((c) => c.name === targetClubName)
    );

    const clubTicks = 16;
    let currentTick = 0;

    const runClubTick = () => {
      currentTick++;
      setActiveClubIdx((prev) => (prev + 1) % clubs.length);
      playTick();

      if (currentTick < clubTicks) {
        const delay = 45 + Math.pow(currentTick / clubTicks, 2) * 180;
        const t = setTimeout(runClubTick, delay);
        timersRef.current.push(t);
      } else {
        // Lock in the chosen club!
        setActiveClubIdx(targetClubIndex);
        const finalClub = clubs[targetClubIndex] || { name: targetClubName };
        setLockedClub(finalClub);
        playBassDrop();

        // Pause 850ms to celebrate club lock, then trigger WALKOUT
        const t2 = setTimeout(() => {
          startPlayerWalkout();
        }, 900);
        timersRef.current.push(t2);
      }
    };

    runClubTick();
  };

  // ----------------------------------------------------
  // STAGE 3: PLAYER WALKOUT & SUSPENSE SEQUENCE
  // ----------------------------------------------------
  const startPlayerWalkout = () => {
    setPhase('WALKOUT');
    playWhoosh();

    // Step 1: Position reveal (400ms)
    const t1 = setTimeout(() => {
      setWalkoutStep(1);
      playLock();
    }, 450);

    // Step 2: Nationality reveal (1100ms)
    const t2 = setTimeout(() => {
      setWalkoutStep(2);
      playLock();
    }, 1150);

    // Step 3: OVR rating reveal (1850ms)
    const t3 = setTimeout(() => {
      setWalkoutStep(3);
      playBassDrop();
    }, 1900);

    // Step 4: EXPLOSIVE CARD REVEAL (2700ms)
    const t4 = setTimeout(() => {
      setWalkoutStep(4);
      setPhase('SHOWCASE');
      playPackOpening();
      triggerConfetti();
    }, 2750);

    timersRef.current.push(t1, t2, t3, t4);
  };

  if (!isOpen || !chosenPlayer) return null;

  const currentLeague = lockedLeague || REEL_LEAGUES[activeLeagueIdx] || REEL_LEAGUES[0];
  const currentClub =
    lockedClub ||
    clubCandidates[activeClubIdx] ||
    (clubCandidates[0] ? clubCandidates[0] : { name: 'Selecting Club...' });

  const clubLogo =
    currentClub.logo ||
    (typeof chosenPlayer.club === 'object' &&
    currentClub.name === chosenPlayer.club?.name
      ? chosenPlayer.club.logo
      : null);

  return (
    <div className="reel-modal-overlay">
      {onClose && (
        <button
          type="button"
          className="reel-close-btn"
          onClick={onClose}
          title="Close Prediction Reel"
        >
          ✕
        </button>
      )}

      <div className="reel-backdrop-flair">
        <div className="reel-light-beam beam-left" />
        <div className="reel-light-beam beam-right" />
        <div className="reel-stadium-fog" />
      </div>

      <div className="reel-modal-container">
        {/* Top Header Badge */}
        <div className="reel-header-badge">
          <span className="reel-flair-icon">⚡</span>
          <span className="reel-header-title">
            EA FC PREDICTION REEL • {targetSlot?.label || 'SLOT'} REVEAL
          </span>
          <span className="reel-flair-icon">⚡</span>
        </div>

        {/* Progress Tracker (Breadcrumbs) */}
        <div className="reel-stage-stepper">
          <div
            className={`step-pill ${phase === 'LEAGUE' ? 'active' : ''} ${
              lockedLeague ? 'completed' : ''
            }`}
          >
            <span className="step-num">1</span>
            <span className="step-lbl">
              {lockedLeague ? `${lockedLeague.flag} ${lockedLeague.name}` : 'League'}
            </span>
          </div>
          <div className="step-connector" />
          <div
            className={`step-pill ${phase === 'CLUB' ? 'active' : ''} ${
              lockedClub ? 'completed' : ''
            }`}
          >
            <span className="step-num">2</span>
            <span className="step-lbl">
              {lockedClub ? lockedClub.name : 'Club'}
            </span>
          </div>
          <div className="step-connector" />
          <div
            className={`step-pill ${
              phase === 'WALKOUT' || phase === 'SHOWCASE' ? 'active' : ''
            } ${phase === 'SHOWCASE' ? 'completed' : ''}`}
          >
            <span className="step-num">3</span>
            <span className="step-lbl">Player</span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* PHASE 1: LEAGUE ROULETTE STAGE */}
        {/* ======================================================== */}
        {phase === 'LEAGUE' && (
          <div className="reel-stage-box league-stage animate-enter">
            <h2 className="reel-stage-heading">
              {lockedLeague ? 'LEAGUE LOCKED IN!' : 'SHUFFLING LEAGUE...'}
            </h2>
            <div
              className={`reel-spinner-card league-card ${
                lockedLeague ? 'is-locked-in' : 'is-spinning'
              }`}
              style={{ '--league-glow': currentLeague.color }}
            >
              <div className="league-flag-huge">{currentLeague.flag}</div>
              <div className="league-logo-wrap">
                <img
                  src={currentLeague.logo}
                  alt={currentLeague.name}
                  className="league-logo-img"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <h3 className="league-name-banner">{currentLeague.name}</h3>
              <span className="league-country-tag">{currentLeague.country}</span>
              {lockedLeague && (
                <div className="locked-badge-pulse">✓ LOCKED IN</div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PHASE 2: CLUB ROULETTE STAGE */}
        {/* ======================================================== */}
        {phase === 'CLUB' && (
          <div className="reel-stage-box club-stage animate-enter">
            <h2 className="reel-stage-heading">
              {lockedClub ? 'CLUB LOCKED IN!' : `SHUFFLING ${currentLeague.name.toUpperCase()} CLUB...`}
            </h2>
            <div
              className={`reel-spinner-card club-card ${
                lockedClub ? 'is-locked-in' : 'is-spinning'
              }`}
            >
              <div className="club-crest-huge">
                {clubLogo ? (
                  <img
                    src={clubLogo}
                    alt={currentClub.name}
                    className="club-crest-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="club-fallback-emoji">🛡️</span>
                )}
              </div>
              <h3 className="club-name-banner">{currentClub.name}</h3>
              <span className="club-league-pill">
                {currentLeague.flag} {currentLeague.name}
              </span>
              {lockedClub && (
                <div className="locked-badge-pulse">✓ LOCKED IN</div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PHASE 3: SUSPENSE WALKOUT STAGE */}
        {/* ======================================================== */}
        {phase === 'WALKOUT' && (
          <div className="reel-stage-box walkout-stage animate-enter">
            <h2 className="reel-stage-heading">WALKOUT INCOMING...</h2>

            <div className="walkout-doors-stage">
              {/* Suspense Step 1: Position */}
              <div
                className={`walkout-clue clue-pos ${
                  walkoutStep >= 1 ? 'revealed' : 'hidden'
                }`}
              >
                <span className="clue-label">POSITION</span>
                <span className="clue-val-pos">{chosenPlayer.position}</span>
              </div>

              {/* Suspense Step 2: Nationality */}
              <div
                className={`walkout-clue clue-nat ${
                  walkoutStep >= 2 ? 'revealed' : 'hidden'
                }`}
              >
                <span className="clue-label">NATION</span>
                <span className="clue-val-nat">{chosenPlayer.nationality}</span>
              </div>

              {/* Suspense Step 3: OVR Rating */}
              <div
                className={`walkout-clue clue-ovr ${
                  walkoutStep >= 3 ? 'revealed' : 'hidden'
                }`}
              >
                <span className="clue-label">RATING</span>
                <span className="clue-val-ovr">{chosenPlayer.overall}</span>
              </div>

              {/* Mysterious Silhouette glowing in smoke */}
              <div className="walkout-silhouette-box">
                <div className="silhouette-aura-pulse" />
                <PlayerAvatar player={chosenPlayer} size="xl" />
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PHASE 4: FULL SHOWCASE & ADMIRATION (Player Card Slam) */}
        {/* ======================================================== */}
        {phase === 'SHOWCASE' && (
          <div className="reel-stage-box showcase-stage animate-slam">
            <div className="showcase-announcement">
              <span className="showcase-super-tag">
                🎉 {chosenPlayer.overall >= 88 ? '🔥 MASSIVE WALKOUT!' : 'WALKOUT REVEAL!'}
              </span>
              <h2 className="showcase-player-name">{chosenPlayer.name}</h2>
              <p className="showcase-club-line">
                {currentClub.name} • {chosenPlayer.position} • {chosenPlayer.overall} OVR
              </p>
            </div>

            {/* Hero FC Mobile 3D Card */}
            <div className="showcase-card-stage">
              <FCMobileCard
                player={chosenPlayer}
                size="reel"
                showActions={false}
                interactive={true}
              />
            </div>

            {/* Bottom Actions Toolbar */}
            <div className="showcase-actions-bar">
              <button
                type="button"
                className="btn btn-confirm-place"
                onClick={() => onConfirmPlace(chosenPlayer)}
              >
                ✨ Place in Squad ({targetSlot?.label || 'Slot'})
              </button>

              {canReroll && rerollsLeft > 0 && (
                <button
                  type="button"
                  className="btn btn-reroll-reel"
                  onClick={onReroll}
                >
                  🔄 Reroll Player ({rerollsLeft} left)
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionReelModal;
