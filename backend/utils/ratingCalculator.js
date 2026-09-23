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

module.exports = { calculateTeamRating, FORMATION_433, getPositionGroup };
