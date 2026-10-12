import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosClient';
import PlayerAvatar from '../components/PlayerAvatar';
import PredictionReelModal from '../components/PredictionReelModal';
import { useSquad } from '../context/SquadContext';
import { getFCPlayerName, getCardTier } from '../utils/fcFormatting';
import {
  playTick,
  playLock,
  playReroll,
  playFanfare,
  toggleSound,
  isSoundMuted,
} from '../utils/audioEffects';
import { triggerConfetti } from '../utils/confetti';
import './ShuffleGamePage.css';

// Formation presets with pitch layout coordinates (percentages)
const FORMATIONS = {
  '4-3-3': {
    name: '4-3-3 Attack',
    slots: [
      { index: 0, label: 'GK', group: 'GK', position: 'GK', top: 84, left: 50 },
      { index: 1, label: 'LB', group: 'DEF', position: 'LB', top: 66, left: 16 },
      { index: 2, label: 'CB', group: 'DEF', position: 'CB', top: 68, left: 38 },
      { index: 3, label: 'CB', group: 'DEF', position: 'CB', top: 68, left: 62 },
      { index: 4, label: 'RB', group: 'DEF', position: 'RB', top: 66, left: 84 },
      { index: 5, label: 'CM', group: 'MID', position: 'CM', top: 46, left: 24 },
      { index: 6, label: 'CAM', group: 'MID', position: 'CAM', top: 38, left: 50 },
      { index: 7, label: 'CM', group: 'MID', position: 'CM', top: 46, left: 76 },
      { index: 8, label: 'LW', group: 'ATK', position: 'LW', top: 20, left: 18 },
      { index: 9, label: 'ST', group: 'ATK', position: 'ST', top: 15, left: 50 },
      { index: 10, label: 'RW', group: 'ATK', position: 'RW', top: 20, left: 82 },
    ],
  },
  '4-4-2': {
    name: '4-4-2 Classic',
    slots: [
      { index: 0, label: 'GK', group: 'GK', position: 'GK', top: 84, left: 50 },
      { index: 1, label: 'LB', group: 'DEF', position: 'LB', top: 66, left: 16 },
      { index: 2, label: 'CB', group: 'DEF', position: 'CB', top: 68, left: 38 },
      { index: 3, label: 'CB', group: 'DEF', position: 'CB', top: 68, left: 62 },
      { index: 4, label: 'RB', group: 'DEF', position: 'RB', top: 66, left: 84 },
      { index: 5, label: 'LM', group: 'MID', position: 'LW', top: 44, left: 18 },
      { index: 6, label: 'CM', group: 'MID', position: 'CM', top: 46, left: 39 },
      { index: 7, label: 'CM', group: 'MID', position: 'CM', top: 46, left: 61 },
      { index: 8, label: 'RM', group: 'MID', position: 'RW', top: 44, left: 82 },
      { index: 9, label: 'ST', group: 'ATK', position: 'ST', top: 18, left: 38 },
      { index: 10, label: 'ST', group: 'ATK', position: 'ST', top: 18, left: 62 },
    ],
  },
  '3-5-2': {
    name: '3-5-2 Italian',
    slots: [
      { index: 0, label: 'GK', group: 'GK', position: 'GK', top: 84, left: 50 },
      { index: 1, label: 'CB', group: 'DEF', position: 'CB', top: 68, left: 24 },
      { index: 2, label: 'CB', group: 'DEF', position: 'CB', top: 70, left: 50 },
      { index: 3, label: 'CB', group: 'DEF', position: 'CB', top: 68, left: 76 },
      { index: 4, label: 'LWB', group: 'DEF', position: 'LB', top: 48, left: 12 },
      { index: 5, label: 'CDM', group: 'MID', position: 'CDM', top: 52, left: 38 },
      { index: 6, label: 'CDM', group: 'MID', position: 'CDM', top: 52, left: 62 },
      { index: 7, label: 'RWB', group: 'DEF', position: 'RB', top: 48, left: 88 },
      { index: 8, label: 'CAM', group: 'MID', position: 'CAM', top: 34, left: 50 },
      { index: 9, label: 'ST', group: 'ATK', position: 'ST', top: 16, left: 38 },
      { index: 10, label: 'ST', group: 'ATK', position: 'ST', top: 16, left: 62 },
    ],
  },
};

const DIFFICULTY_SETTINGS = {
  standard: { name: 'Standard (5 Rerolls)', rerolls: 5, multiplier: 1.0 },
  hardcore: { name: 'Hardcore (3 Rerolls)', rerolls: 3, multiplier: 1.5 },
  sandbox: { name: 'Sandbox (Unlimited)', rerolls: 999, multiplier: 0.8 },
};

// Tactical Chemistry Link Connections for authentic FIFA / EA FC Pitch
const FORMATION_LINKS = {
  '4-3-3': [
    [0, 2], [0, 3],
    [1, 2], [2, 3], [3, 4],
    [1, 5], [2, 6], [3, 6], [4, 7],
    [5, 6], [6, 7],
    [8, 5], [9, 6], [10, 7],
    [8, 9], [9, 10],
  ],
  '4-4-2': [
    [0, 2], [0, 3],
    [1, 2], [2, 3], [3, 4],
    [1, 5], [2, 6], [3, 7], [4, 8],
    [5, 6], [6, 7], [7, 8],
    [5, 9], [6, 9], [7, 10], [8, 10],
    [9, 10],
  ],
  '3-5-2': [
    [0, 1], [0, 2], [0, 3],
    [1, 2], [2, 3],
    [1, 4], [1, 5], [2, 5], [2, 6], [3, 6], [3, 7],
    [4, 5], [5, 6], [6, 7],
    [5, 8], [6, 8],
    [8, 9], [8, 10],
    [9, 10],
  ],
};

const getLinkChemistry = (p1, p2) => {
  if (!p1 || !p2) return 'empty';
  const c1 = typeof p1.club === 'object' ? p1.club?.name : p1.club;
  const c2 = typeof p2.club === 'object' ? p2.club?.name : p2.club;
  const sameClub = c1 && c2 && c1 === c2;
  const sameNation = p1.nationality && p2.nationality && p1.nationality === p2.nationality;
  const l1 = typeof p1.club === 'object' ? p1.club?.league : p1.league;
  const l2 = typeof p2.club === 'object' ? p2.club?.league : p2.league;
  const sameLeague = l1 && l2 && l1 === l2;

  if (sameClub && sameNation) return 'hyper';
  if (sameClub || (sameNation && sameLeague)) return 'perfect';
  if (sameNation || sameLeague) return 'strong';
  return 'weak';
};

const ShuffleGamePage = () => {
  const navigate = useNavigate();
  const { setSquad } = useSquad();

  // Settings
  const [formationKey, setFormationKey] = useState('4-3-3');
  const [difficulty, setDifficulty] = useState('standard');
  const [selectedLeague, setSelectedLeague] = useState('');
  const [leagues, setLeagues] = useState([]);
  const [allClubs, setAllClubs] = useState([]);
  const [isMuted, setIsMuted] = useState(isSoundMuted());

  // Game state
  const [slotsState, setSlotsState] = useState(() =>
    FORMATIONS['4-3-3'].slots.map((def) => ({
      def,
      player: null,
      isSpinning: false,
      isLocked: false,
      tickerName: '',
      tickerOvr: null,
      tickerImage: null,
    }))
  );

  const [rerollsLeft, setRerollsLeft] = useState(
    DIFFICULTY_SETTINGS.standard.rerolls
  );
  const [isSpinningAny, setIsSpinningAny] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationDismissed, setCelebrationDismissed] = useState(false);
  const [hasCelebrated, setHasCelebrated] = useState(false);

  // Cinematic 3-Stage Prediction Reel Modal State
  const [reelModal, setReelModal] = useState({
    isOpen: false,
    targetSlotIndex: null,
    targetSlotDef: null,
    chosenPlayer: null,
    isReroll: false,
  });

  const [highScores, setHighScores] = useState(() => {
    try {
      const saved = localStorage.getItem('football_shuffle_highscores');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Fetch leagues and clubs for cinematic roulette
  useEffect(() => {
    api
      .get('/leagues')
      .then((res) => {
        if (res.data?.success) setLeagues(res.data.data);
      })
      .catch(() => {});

    api
      .get('/clubs')
      .then((res) => {
        if (res.data?.success) setAllClubs(res.data.data);
      })
      .catch(() => {});
  }, []);

  // Update formation
  const handleFormationChange = (newKey) => {
    if (isSpinningAny || reelModal.isOpen) return;
    setFormationKey(newKey);
    setSlotsState(
      FORMATIONS[newKey].slots.map((def) => ({
        def,
        player: null,
        isSpinning: false,
        isLocked: false,
        tickerName: '',
        tickerOvr: null,
        tickerImage: null,
      }))
    );
    setRerollsLeft(DIFFICULTY_SETTINGS[difficulty].rerolls);
    setShowCelebration(false);
    setHasCelebrated(false);
  };

  // Restart Game
  const handleResetGame = () => {
    if (isSpinningAny || reelModal.isOpen) return;
    setSlotsState(
      FORMATIONS[formationKey].slots.map((def) => ({
        def,
        player: null,
        isSpinning: false,
        isLocked: false,
        tickerName: '',
        tickerOvr: null,
        tickerImage: null,
      }))
    );
    setRerollsLeft(DIFFICULTY_SETTINGS[difficulty].rerolls);
    setShowCelebration(false);
    setHasCelebrated(false);
  };

  // Sound toggle
  const handleToggleSound = () => {
    const isNowMuted = !toggleSound();
    setIsMuted(isNowMuted);
  };

  // Compute excluded player IDs currently in squad
  const getExcludedIds = (currentIndex = -1) => {
    return slotsState
      .map((s, idx) => (idx !== currentIndex && s.player ? s.player._id : null))
      .filter(Boolean);
  };

  // Spin a single slot with Cinematic 3-Stage Prediction Reel
  const spinSlot = async (slotIndex, isReroll = false) => {
    const slot = slotsState[slotIndex];
    if (!slot || slot.isLocked || isSpinningAny) return;

    if (isReroll) {
      if (rerollsLeft <= 0 && difficulty !== 'sandbox') return;
      playReroll();
      if (difficulty !== 'sandbox') {
        setRerollsLeft((prev) => Math.max(0, prev - 1));
      }
    }

    // Set slot spinning state
    setSlotsState((prev) =>
      prev.map((s, idx) => (idx === slotIndex ? { ...s, isSpinning: true } : s))
    );
    setIsSpinningAny(true);

    try {
      const excluded = getExcludedIds(slotIndex).join(',');
      const params = new URLSearchParams({
        slot: slot.def.position,
        group: slot.def.group,
        count: '12',
      });
      if (selectedLeague) params.set('league', selectedLeague);
      if (excluded) params.set('exclude', excluded);

      const res = await api.get(`/players/shuffle-candidates?${params.toString()}`);
      const candidates = res.data?.candidates || [];

      if (candidates.length === 0) {
        // Fallback: pick any player
        const fallbackRes = await api.get('/players?limit=12');
        candidates.push(...(fallbackRes.data?.data || []));
      }

      // Pick random candidate with authentic cutout priority
      const chosenPlayer =
        candidates[Math.floor(Math.random() * candidates.length)] || candidates[0];

      if (chosenPlayer) {
        // Launch 3-Stage Cinematic YouTube/TikTok Prediction Reel Modal!
        setReelModal({
          isOpen: true,
          targetSlotIndex: slotIndex,
          targetSlotDef: slot.def,
          chosenPlayer,
          isReroll,
          candidates,
        });
      } else {
        setSlotsState((prev) =>
          prev.map((s, idx) => (idx === slotIndex ? { ...s, isSpinning: false } : s))
        );
      }
    } catch (err) {
      console.error('Error spinning slot:', err);
      setSlotsState((prev) =>
        prev.map((s, idx) => (idx === slotIndex ? { ...s, isSpinning: false } : s))
      );
    } finally {
      setIsSpinningAny(false);
    }
  };

  // Place player into slot after cinematic reveal
  const handleConfirmReelPlacement = (player) => {
    const idx = reelModal.targetSlotIndex;
    if (idx !== null && player) {
      playLock();
      setSlotsState((prev) =>
        prev.map((s, i) =>
          i === idx ? { ...s, player, isSpinning: false } : s
        )
      );
    }
    setReelModal({
      isOpen: false,
      targetSlotIndex: null,
      targetSlotDef: null,
      chosenPlayer: null,
      isReroll: false,
    });
  };

  // Reroll from within the prediction reel
  const handleReelReroll = () => {
    if (rerollsLeft <= 0 && difficulty !== 'sandbox') return;
    const idx = reelModal.targetSlotIndex;
    if (idx !== null) {
      setReelModal((prev) => ({ ...prev, isOpen: false }));
      setTimeout(() => {
        spinSlot(idx, true);
      }, 100);
    }
  };

  // Spin next unlocked / empty slot in cinematic reel
  const spinAllSlots = async () => {
    if (isSpinningAny || reelModal.isOpen) return;

    const firstEmptyIndex = slotsState.findIndex(
      (s) => !s.isLocked && !s.player
    );

    if (firstEmptyIndex !== -1) {
      await spinSlot(firstEmptyIndex, false);
    }
  };

  // Toggle lock on a slot
  const toggleLockSlot = (slotIndex) => {
    setSlotsState((prev) =>
      prev.map((s, idx) =>
        idx === slotIndex ? { ...s, isLocked: !s.isLocked } : s
      )
    );
  };

  // Live Squad Stats & Chemistry Calculations
  const squadStats = useMemo(() => {
    const filled = slotsState.filter((s) => s.player !== null);
    if (filled.length === 0) {
      return { overall: 0, chemistry: 0, totalScore: 0, isComplete: false };
    }

    const ovrSum = filled.reduce((sum, s) => sum + s.player.overall, 0);
    const overall = Math.round(ovrSum / filled.length);

    // Chemistry (club, league, nationality links)
    const clubs = {};
    const leaguesCount = {};
    const nations = {};

    filled.forEach((s) => {
      const p = s.player;
      const c = p.club?.name || p.club;
      const l = p.league?.name || p.league;
      const n = p.nationality;
      if (c) clubs[c] = (clubs[c] || 0) + 1;
      if (l) leaguesCount[l] = (leaguesCount[l] || 0) + 1;
      if (n) nations[n] = (nations[n] || 0) + 1;
    });

    let totalChem = 0;
    filled.forEach((s) => {
      const p = s.player;
      const c = p.club?.name || p.club;
      const l = p.league?.name || p.league;
      const n = p.nationality;

      let chem = 0;
      if (clubs[c] >= 7) chem += 3;
      else if (clubs[c] >= 4) chem += 2;
      else if (clubs[c] >= 2) chem += 1;

      if (leaguesCount[l] >= 8) chem += 3;
      else if (leaguesCount[l] >= 5) chem += 2;
      else if (leaguesCount[l] >= 3) chem += 1;

      if (nations[n] >= 8) chem += 3;
      else if (nations[n] >= 5) chem += 2;
      else if (nations[n] >= 2) chem += 1;

      totalChem += Math.min(3, chem);
    });

    const isComplete = filled.length === 11;
    const rerollBonus =
      difficulty !== 'sandbox' ? rerollsLeft * 80 : 0;
    const baseScore = overall * 12 + totalChem * 25 + rerollBonus;
    const multiplier = DIFFICULTY_SETTINGS[difficulty].multiplier;
    const totalScore = Math.round(baseScore * multiplier);

    return {
      overall,
      chemistry: totalChem,
      totalScore,
      isComplete,
      filledCount: filled.length,
    };
  }, [slotsState, rerollsLeft, difficulty]);

  // Handle celebration when squad is completed (does NOT block the screen!)
  useEffect(() => {
    if (
      squadStats.isComplete &&
      !hasCelebrated &&
      !isSpinningAny &&
      !reelModal.isOpen
    ) {
      setHasCelebrated(true);
      triggerConfetti();
      playFanfare();

      // Record high score
      const newScore = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        formation: FORMATIONS[formationKey].name,
        difficulty: DIFFICULTY_SETTINGS[difficulty].name,
        overall: squadStats.overall,
        chemistry: squadStats.chemistry,
        score: squadStats.totalScore,
        mvp: slotsState.reduce(
          (top, s) => (!top || (s.player?.overall || 0) > (top?.overall || 0) ? s.player : top),
          null
        )?.name,
      };

      setHighScores((prev) => {
        const updated = [newScore, ...prev]
          .sort((a, b) => b.score - a.score)
          .slice(0, 10);
        try {
          localStorage.setItem(
            'football_shuffle_highscores',
            JSON.stringify(updated)
          );
        } catch {}
        return updated;
      });
    }
  }, [squadStats.isComplete, isSpinningAny, reelModal.isOpen, hasCelebrated]);

  // Transfer squad to main Squad Builder
  const handleTransferToMainSquad = () => {
    const full11 = slotsState.map((s) => s.player);
    setSquad(full11);
    navigate('/squad');
  };

  // Copy squad text summary to clipboard
  const handleCopySummary = () => {
    const summary = [
      `🎰 Squad Shuffle Roulette Result!`,
      `Formation: ${FORMATIONS[formationKey].name}`,
      `Squad Rating: ${squadStats.overall} OVR | Chemistry: ${squadStats.chemistry}/33 | Score: ${squadStats.totalScore} pts`,
      `Star Players: ${slotsState
        .filter((s) => s.player && s.player.overall >= 85)
        .map((s) => s.player.name)
        .join(', ')}`,
      `Play now on Football Squad Builder!`,
    ].join('\n');

    navigator.clipboard?.writeText(summary);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  // Tier designation
  const getRankTier = (overall, chem) => {
    if (overall >= 88 && chem >= 25)
      return { title: '🏆 GOAT Legend', color: '#00e676' };
    if (overall >= 84 && chem >= 20)
      return { title: '🥇 Champions Tier', color: '#ffd700' };
    if (overall >= 80)
      return { title: '🥈 Master Tactician', color: '#00b0ff' };
    if (overall >= 75)
      return { title: '🥉 Pro Squad', color: '#c084fc' };
    return { title: '⚽ Rising Rookie', color: '#94a3b8' };
  };

  const rank = getRankTier(squadStats.overall, squadStats.chemistry);

  return (
    <div className="shuffle-game-page">
      <div className="container">
        {/* Top Control Bar */}
        <header className="shuffle-header">
          <div className="header-title-group">
            <div className="title-with-badge">
              <span className="ea-fc-triangle" style={{ width: '22px', height: '22px', fontSize: '11px' }}>▼</span>
              <h1 className="shuffle-title">
                EA SPORTS FC 26 <span className="title-highlight">Shuffle Roulette</span>
              </h1>
              <span className="live-game-badge">ARCADE MODE</span>
            </div>
            <p className="shuffle-subtitle">
              Spin, draft & match chemistry across 5 major European leagues.
              Manage your rerolls to construct the ultimate dream squad!
            </p>
          </div>

          <div className="header-actions">
            <button
              type="button"
              className="btn btn-secondary btn-icon"
              onClick={handleToggleSound}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? '🔇 Muted' : '🔊 Sound On'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowLeaderboard(true)}
            >
              🏆 Leaderboard
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleResetGame}
              disabled={isSpinningAny}
            >
              ↺ Reset
            </button>
          </div>
        </header>

        {/* Game Dashboard & Controls */}
        <div className="shuffle-dashboard">
          {/* Options Row */}
          <div className="dashboard-options">
            <div className="option-group">
              <label>Formation</label>
              <select
                value={formationKey}
                onChange={(e) => handleFormationChange(e.target.value)}
                disabled={isSpinningAny}
              >
                {Object.entries(FORMATIONS).map(([key, f]) => (
                  <option key={key} value={key}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="option-group">
              <label>Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => {
                  setDifficulty(e.target.value);
                  setRerollsLeft(DIFFICULTY_SETTINGS[e.target.value].rerolls);
                }}
                disabled={isSpinningAny}
              >
                {Object.entries(DIFFICULTY_SETTINGS).map(([key, d]) => (
                  <option key={key} value={key}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="option-group">
              <label>League Challenge</label>
              <select
                value={selectedLeague}
                onChange={(e) => setSelectedLeague(e.target.value)}
                disabled={isSpinningAny}
              >
                <option value="">All Leagues (European Pool)</option>
                {leagues.map((l) => (
                  <option key={l._id} value={l._id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-spin-all"
              onClick={spinAllSlots}
              disabled={
                isSpinningAny ||
                slotsState.every((s) => s.isLocked || s.player !== null)
              }
            >
              ⚡ Spin Remaining ({11 - (squadStats.filledCount || 0)})
            </button>
          </div>

          {/* Stats Bar */}
          <div className="dashboard-stats-bar">
            <div className="stat-card stat-ovr">
              <span className="stat-label">SQUAD OVR</span>
              <span className="stat-value">{squadStats.overall || '--'}</span>
            </div>

            <div className="stat-card stat-chem">
              <span className="stat-label">CHEMISTRY</span>
              <span className="stat-value">
                {squadStats.chemistry} <span className="stat-max">/ 33</span>
              </span>
            </div>

            <div className="stat-card stat-rerolls">
              <span className="stat-label">REROLLS</span>
              <span className="stat-value rerolls-pill">
                {difficulty === 'sandbox' ? '∞' : rerollsLeft}
              </span>
            </div>

            <div className="stat-card stat-score">
              <span className="stat-label">LIVE SCORE</span>
              <span className="stat-value score-highlight">
                {squadStats.totalScore.toLocaleString()}
              </span>
            </div>

            <div className="stat-card stat-tier">
              <span className="stat-label">RANK</span>
              <span className="stat-value rank-pill" style={{ color: rank.color }}>
                {rank.title}
              </span>
            </div>
          </div>
        </div>

        {/* 3D EA Sports FC 26 Matchday Stadium Pitch */}
        <div className="shuffle-pitch-container">
          <div className="shuffle-pitch">
            {/* Volumetric Corner Floodlight Beams */}
            <div className="stadium-floodlight floodlight-top-left" />
            <div className="stadium-floodlight floodlight-top-right" />
            <div className="stadium-vignette" />

            {/* Stadium Pitch LED Boards (Top & Bottom Touchlines) */}
            <div className="pitch-led-board led-top">
              <div className="led-marquee">
                <span>EA SPORTS FC 26 ★ ULTIMATE TEAM ★ HYPERMOTION V ★ THE WORLD'S GAME ★ SQUAD ROULETTE ★ EA SPORTS FC 26 ★</span>
              </div>
            </div>

            {/* Pitch Markings */}
            <div className="pitch-center-circle">
              <div className="fc-crest-watermark">
                <span className="fc-watermark-triangle">▲</span>
                <span className="fc-watermark-text">FC 26</span>
              </div>
            </div>
            <div className="pitch-center-spot" />
            <div className="pitch-center-line" />
            <div className="pitch-penalty-box top">
              <div className="pitch-penalty-arc top" />
              <div className="pitch-penalty-spot top" />
            </div>
            <div className="pitch-penalty-box bottom">
              <div className="pitch-penalty-arc bottom" />
              <div className="pitch-penalty-spot bottom" />
            </div>

            {/* Corner Arcs */}
            <div className="pitch-corner-arc arc-tl" />
            <div className="pitch-corner-arc arc-tr" />
            <div className="pitch-corner-arc arc-bl" />
            <div className="pitch-corner-arc arc-br" />

            {/* Authentic FUT Chemistry Link Lines */}
            <svg className="pitch-chem-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
              {(FORMATION_LINKS[formationKey] || []).map(([fromIdx, toIdx], linkIndex) => {
                const s1 = slotsState[fromIdx];
                const s2 = slotsState[toIdx];
                if (!s1 || !s2) return null;
                const linkType = getLinkChemistry(s1.player, s2.player);
                return (
                  <line
                    key={`chem-${linkIndex}-${fromIdx}-${toIdx}`}
                    x1={`${s1.def.left}%`}
                    y1={`${s1.def.top}%`}
                    x2={`${s2.def.left}%`}
                    y2={`${s2.def.top}%`}
                    className={`chem-link-line link-${linkType}`}
                  />
                );
              })}
            </svg>

            {/* 11 Slots */}
            {slotsState.map((slot, index) => {
              const { def, player, isSpinning, isLocked, tickerName, tickerOvr, tickerImage } = slot;
              const hasPlayer = Boolean(player);

              return (
                <div
                  key={index}
                  className={`shuffle-slot ${hasPlayer ? 'slot-filled' : 'slot-empty'} ${
                    hasPlayer ? getCardTier(player.overall) : ''
                  } ${isSpinning ? 'slot-spinning' : ''} ${isLocked ? 'slot-locked' : ''}`}
                  style={{ top: `${def.top}%`, left: `${def.left}%` }}
                >
                  {isSpinning ? (
                    // Spinning Ticker
                    <div className="slot-ticker-wrapper">
                      <div className="slot-ticker-glow"></div>
                      <div className="slot-ticker-avatar">
                        <PlayerAvatar
                          player={{ name: tickerName, image: tickerImage }}
                          size="fc-slot"
                        />
                      </div>
                      <span className="ticker-ovr">{tickerOvr || '??'}</span>
                      <span className="ticker-name">{getFCPlayerName(tickerName) || 'SPINNING...'}</span>
                    </div>
                  ) : hasPlayer ? (
                    // Filled EA FC Mobile FUT Shield Card
                    <div className="slot-card-content">
                      <div className="slot-card-glare" />

                      {/* Card Header: OVR + Position Badge & Crest + Nation */}
                      <div className="slot-card-header">
                        <div className="slot-card-badges">
                          <span className="slot-card-ovr">{player.overall}</span>
                          <span className={`slot-card-pos pos-${def.group.toLowerCase()}`}>
                            {player.position}
                          </span>
                        </div>

                        <div className="slot-card-crests">
                          {player.club?.logo && (
                            <img
                              src={player.club.logo}
                              alt={player.club?.name || 'Club'}
                              className="shuffle-slot-club-crest"
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                          )}
                          {player.nationality && (
                            <span className="shuffle-slot-nat" title={player.nationality}>
                              {player.nationality.slice(0, 3).toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Heroic Portrait Stage (Authentic FIFA Card Bleed, NO CIRCLES!) */}
                      <div className="slot-portrait-container">
                        <PlayerAvatar player={player} size="fc-slot" />
                        <div className="slot-portrait-vignette" />
                      </div>

                      {/* Angular Metallic Nameplate with Rank Stars */}
                      <div className="shuffle-nametag-banner">
                        <span className="slot-card-name" title={player.name}>
                          {getFCPlayerName(player.name)}
                        </span>
                        <div className="slot-card-stars">
                          <span className="slot-star active">★</span>
                          <span className="slot-star active">★</span>
                          <span className="slot-star active">★</span>
                        </div>
                      </div>

                      {/* Card Overlay Controls on hover */}
                      <div className="slot-card-actions">
                        <button
                          type="button"
                          className={`btn-action-icon ${isLocked ? 'btn-locked' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLockSlot(index);
                          }}
                          title={isLocked ? 'Unlock Slot' : 'Lock Slot'}
                        >
                          {isLocked ? '🔒' : '🔓'}
                        </button>
                        {!isLocked && (
                          <button
                            type="button"
                            className="btn-action-icon btn-reroll"
                            onClick={(e) => {
                              e.stopPropagation();
                              spinSlot(index, true);
                            }}
                            disabled={isSpinningAny || (rerollsLeft <= 0 && difficulty !== 'sandbox')}
                            title="Reroll Player (-1 Reroll)"
                          >
                            🔄
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    // Empty Clickable Slot
                    <div
                      className="slot-placeholder"
                      onClick={() => !isSpinningAny && spinSlot(index, false)}
                    >
                      <span className="slot-role-tag">{def.label}</span>
                      <span className="slot-spin-symbol">🎲</span>
                      <span className="slot-spin-text">SPIN</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Victory Celebration Stadium Deck (Dedicated deck BELOW the pitch, NEVER blocking players!) */}
        {squadStats.isComplete && !showCelebration && !celebrationDismissed && (
          <div className="stadium-victory-deck animate-deck-appear">
            <button
              type="button"
              className="deck-dismiss-btn"
              onClick={() => setCelebrationDismissed(true)}
              title="Dismiss banner to view pitch"
            >
              ✕
            </button>

            <div className="deck-left">
              <div className="deck-trophy-aura">
                <span className="deck-trophy-icon">🏆</span>
              </div>
              <div className="deck-text-group">
                <div className="deck-title-row">
                  <span className="deck-badge-gold">MATCHDAY COMPLETE</span>
                  <span
                    className="deck-rank-badge"
                    style={{ borderColor: rank.color, color: rank.color }}
                  >
                    {rank.title}
                  </span>
                </div>
                <h3 className="deck-heading">
                  SQUAD COMPLETE! • 11/11 DRAFTED
                </h3>
                <span className="deck-subheading">
                  Total Squad Score: <strong className="gold-score">{squadStats.totalScore.toLocaleString()} pts</strong>
                </span>
              </div>
            </div>

            <div className="deck-center-stats">
              <div className="deck-stat-chip">
                <span className="deck-stat-lbl">SQUAD OVR</span>
                <span className="deck-stat-val val-ovr">{squadStats.overall}</span>
              </div>
              <div className="deck-stat-chip">
                <span className="deck-stat-lbl">CHEMISTRY</span>
                <span className="deck-stat-val val-chem">
                  {squadStats.chemistry}<small>/33</small>
                </span>
              </div>
            </div>

            <div className="deck-right-actions">
              <button
                type="button"
                className="btn btn-deck-gold"
                onClick={() => setShowCelebration(true)}
              >
                📊 Full Squad Summary
              </button>
              <button
                type="button"
                className="btn btn-deck-cyan"
                onClick={handleTransferToMainSquad}
              >
                🚀 Transfer to Squad
              </button>
              <button
                type="button"
                className="btn btn-deck-glass"
                onClick={handleResetGame}
              >
                ↺ Play Again
              </button>
            </div>
          </div>
        )}

        {/* 3-Stage Cinematic YouTube / TikTok Prediction Reel Modal */}
        <PredictionReelModal
          isOpen={reelModal.isOpen}
          targetSlot={reelModal.targetSlotDef}
          chosenPlayer={reelModal.chosenPlayer}
          allClubs={allClubs}
          onConfirmPlace={handleConfirmReelPlacement}
          onReroll={handleReelReroll}
          onClose={() => setReelModal((prev) => ({ ...prev, isOpen: false }))}
          rerollsLeft={rerollsLeft}
          canReroll={difficulty === 'sandbox' || rerollsLeft > 0}
        />

        {/* Victory Celebration Modal (User can inspect & dismiss anytime!) */}
        {showCelebration && (
          <div className="modal-overlay" onClick={() => setShowCelebration(false)}>
            <div
              className="celebration-modal card"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="modal-close-btn celebration-close-x"
                onClick={() => setShowCelebration(false)}
                title="Close and inspect pitch"
              >
                ✕
              </button>

              <div className="celebration-trophy">🏆</div>
              <h2 className="celebration-title">Squad Complete!</h2>
              <p className="celebration-rank" style={{ color: rank.color }}>
                {rank.title}
              </p>

              <div className="celebration-stats-grid">
                <div className="c-stat-box">
                  <span className="c-stat-label">Squad OVR</span>
                  <span className="c-stat-num">{squadStats.overall}</span>
                </div>
                <div className="c-stat-box">
                  <span className="c-stat-label">Chemistry</span>
                  <span className="c-stat-num">{squadStats.chemistry} / 33</span>
                </div>
                <div className="c-stat-box">
                  <span className="c-stat-label">Final Score</span>
                  <span className="c-stat-num gold-text">
                    {squadStats.totalScore.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="celebration-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleTransferToMainSquad}
                >
                  🚀 Transfer to My Squad Pitch
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCopySummary}
                >
                  {copiedNotification ? '✓ Copied to Clipboard!' : '📋 Share Squad Score'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCelebration(false)}
                >
                  👀 Close & View Pitch
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleResetGame}
                >
                  ↺ Play Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* High Scores Modal */}
        {showLeaderboard && (
          <div className="modal-overlay" onClick={() => setShowLeaderboard(false)}>
            <div
              className="leaderboard-modal card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>🏆 Shuffle Game High Scores</h3>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setShowLeaderboard(false)}
                >
                  ✕
                </button>
              </div>

              {highScores.length === 0 ? (
                <p className="empty-leaderboard">No recorded runs yet. Complete a 11-player squad to record your first score!</p>
              ) : (
                <div className="leaderboard-table-wrapper">
                  <table className="leaderboard-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Score</th>
                        <th>OVR</th>
                        <th>Chem</th>
                        <th>Formation</th>
                        <th>MVP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {highScores.map((h, i) => (
                        <tr key={h.id || i}>
                          <td className="rank-num">{i + 1}</td>
                          <td className="score-cell">{h.score.toLocaleString()}</td>
                          <td>{h.overall}</td>
                          <td>{h.chemistry}/33</td>
                          <td>{h.formation}</td>
                          <td>{h.mvp || '--'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShuffleGamePage;
