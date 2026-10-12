/**
 * Team Rating Calculator
 *
 * Formation: 4-3-3
 * Weights: GK 10%, DEF 30%, MID 30%, ATK 30%
 *
 * Position-fit: Players out of their natural position group
 * receive a -3 penalty to their effective overall.
 */

const GK_POSITIONS = ['GK'];
const DEF_POSITIONS = ['CB', 'LB', 'RB'];
const MID_POSITIONS = ['CDM', 'CM', 'CAM'];
const ATK_POSITIONS = ['LW', 'RW', 'ST', 'CF'];

// 4-3-3 slot definitions with their position group
const FORMATION_433 = [
  { slot: 'GK', group: 'GK' },
  { slot: 'LB', group: 'DEF' },
  { slot: 'CB1', group: 'DEF' },
  { slot: 'CB2', group: 'DEF' },
  { slot: 'RB', group: 'DEF' },
  { slot: 'CM1', group: 'MID' },
  { slot: 'CM2', group: 'MID' },
  { slot: 'CM3', group: 'MID' },
  { slot: 'LW', group: 'ATK' },
  { slot: 'ST', group: 'ATK' },
  { slot: 'RW', group: 'ATK' },
];

/**
 * Get the position group for a player's natural position
 */
function getPositionGroup(position) {
  if (GK_POSITIONS.includes(position)) return 'GK';
  if (DEF_POSITIONS.includes(position)) return 'DEF';
  if (MID_POSITIONS.includes(position)) return 'MID';
  if (ATK_POSITIONS.includes(position)) return 'ATK';
  return null;
}

/**
 * Calculate team rating from an array of 11 squad entries.
 *
 * @param {Array} squad - Array of { player, slotIndex } objects.
 *   player must have `overall` and `position` fields.
 *   slotIndex is the index into FORMATION_433.
 *
 * @returns {Object} { overall, gk, def, mid, atk, players[] }
 */
function calculateTeamRating(squad) {
  if (!squad || squad.length !== 11) {
    return null;
  }

  const groups = { GK: [], DEF: [], MID: [], ATK: [] };

  const playerDetails = squad.map(({ player, slotIndex }) => {
    const slot = FORMATION_433[slotIndex];
    const naturalGroup = getPositionGroup(player.position);
    const isInPosition = naturalGroup === slot.group;
    const penalty = isInPosition ? 0 : 3;
    const effectiveOverall = Math.max(1, player.overall - penalty);

    groups[slot.group].push(effectiveOverall);

    return {
      name: player.name,
      position: player.position,
      slot: slot.slot,
      slotGroup: slot.group,
      overall: player.overall,
      effectiveOverall,
      isInPosition,
      penalty,
    };
  });

  const avg = (arr) => (arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

  const gkAvg = avg(groups.GK);
  const defAvg = avg(groups.DEF);
  const midAvg = avg(groups.MID);
  const atkAvg = avg(groups.ATK);
  const overall = Math.round(gkAvg * 0.1 + defAvg * 0.3 + midAvg * 0.3 + atkAvg * 0.3);

  return {
    overall,
    gk: Math.round(gkAvg),
    def: Math.round(defAvg),
    mid: Math.round(midAvg),
    atk: Math.round(atkAvg),
    players: playerDetails,
  };
}

/**
 * Calculate authentic EA FC 24/25 style squad chemistry (0 to 33 points).
 * Each of 11 players can earn up to 3 chemistry points based on:
 * - Same Club: 2 players = +1 pt, 4 players = +2 pts, 7 players = +3 pts
 * - Same League: 3 players = +1 pt, 5 players = +2 pts, 8 players = +3 pts
 * - Same Nationality: 2 players = +1 pt, 5 players = +2 pts, 8 players = +3 pts
 */
function calculateSquadChemistry(squad) {
  if (!squad || !Array.isArray(squad)) {
    return { chemistry: 0, maxChemistry: 33, details: [] };
  }

  const validPlayers = squad
    .map((s, idx) => (s?.player ? { ...s.player, slotIndex: s.slotIndex ?? idx } : s ? { ...s, slotIndex: s.slotIndex ?? idx } : null))
    .filter(Boolean);

  if (validPlayers.length === 0) {
    return { chemistry: 0, maxChemistry: 33, details: [] };
  }

  // Count frequencies
  const clubCounts = {};
  const leagueCounts = {};
  const nationCounts = {};

  validPlayers.forEach((p) => {
    const clubId = p.club?._id?.toString() || p.club?.name || p.club;
    const leagueId = p.league?._id?.toString() || p.league?.name || p.league;
    const nation = p.nationality;

    if (clubId) clubCounts[clubId] = (clubCounts[clubId] || 0) + 1;
    if (leagueId) leagueCounts[leagueId] = (leagueCounts[leagueId] || 0) + 1;
    if (nation) nationCounts[nation] = (nationCounts[nation] || 0) + 1;
  });

  // Calculate points per player
  let totalChemistry = 0;
  const playerDetails = validPlayers.map((p) => {
    const clubId = p.club?._id?.toString() || p.club?.name || p.club;
    const leagueId = p.league?._id?.toString() || p.league?.name || p.league;
    const nation = p.nationality;

    const clubCount = clubId ? clubCounts[clubId] || 0 : 0;
    const leagueCount = leagueId ? leagueCounts[leagueId] || 0 : 0;
    const nationCount = nation ? nationCounts[nation] || 0 : 0;

    let clubPoints = 0;
    if (clubCount >= 7) clubPoints = 3;
    else if (clubCount >= 4) clubPoints = 2;
    else if (clubCount >= 2) clubPoints = 1;

    let leaguePoints = 0;
    if (leagueCount >= 8) leaguePoints = 3;
    else if (leagueCount >= 5) leaguePoints = 2;
    else if (leagueCount >= 3) leaguePoints = 1;

    let nationPoints = 0;
    if (nationCount >= 8) nationPoints = 3;
    else if (nationCount >= 5) nationPoints = 2;
    else if (nationCount >= 2) nationPoints = 1;

    // A player's chemistry is capped at 3
    const playerChem = Math.min(3, clubPoints + leaguePoints + nationPoints);
    totalChemistry += playerChem;

    return {
      playerId: p._id,
      name: p.name,
      chemistry: playerChem,
      clubPoints,
      leaguePoints,
      nationPoints,
    };
  });

  return {
    chemistry: totalChemistry,
    maxChemistry: 33,
    details: playerDetails,
  };
}

module.exports = { calculateTeamRating, calculateSquadChemistry, FORMATION_433, getPositionGroup };
