
import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';

const SquadContext = createContext();

// 4-3-3 formation slots
const FORMATION_SLOTS = [
  { index: 0, slot: 'GK', group: 'GK', label: 'GK' },
  { index: 1, slot: 'LB', group: 'DEF', label: 'LB' },
  { index: 2, slot: 'CB1', group: 'DEF', label: 'CB' },
  { index: 3, slot: 'CB2', group: 'DEF', label: 'CB' },
  { index: 4, slot: 'RB', group: 'DEF', label: 'RB' },
  { index: 5, slot: 'CM1', group: 'MID', label: 'CM' },
  { index: 6, slot: 'CM2', group: 'MID', label: 'CM' },
  { index: 7, slot: 'CM3', group: 'MID', label: 'CM' },
  { index: 8, slot: 'LW', group: 'ATK', label: 'LW' },
  { index: 9, slot: 'ST', group: 'ATK', label: 'ST' },
  { index: 10, slot: 'RW', group: 'ATK', label: 'RW' },
];

const GK_POSITIONS = ['GK'];
const DEF_POSITIONS = ['CB', 'LB', 'RB'];
const MID_POSITIONS = ['CDM', 'CM', 'CAM'];
const ATK_POSITIONS = ['LW', 'RW', 'ST', 'CF'];

function getPositionGroup(position) {
  if (GK_POSITIONS.includes(position)) return 'GK';
  if (DEF_POSITIONS.includes(position)) return 'DEF';
  if (MID_POSITIONS.includes(position)) return 'MID';
  if (ATK_POSITIONS.includes(position)) return 'ATK';
  return null;
}

const getInitialSlots = () => {
  try {
    const saved = localStorage.getItem('football_game_squad');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length === 11) {
        return parsed;
      }
    }
  } catch (e) {
    // Ignore storage errors
  }
  return Array(11).fill(null);
};

const initialState = {
  slots: getInitialSlots(),
};

function squadReducer(state, action) {
  switch (action.type) {
    case 'ADD_PLAYER': {
      const { slotIndex, player } = action.payload;
      // Don't allow duplicates
      const alreadyInSquad = state.slots.some(
        (p) => p && p._id === player._id
      );
      if (alreadyInSquad) return state;

      const newSlots = [...state.slots];
      newSlots[slotIndex] = player;
      return { ...state, slots: newSlots };
    }
    case 'REMOVE_PLAYER': {
      const { slotIndex } = action.payload;
      const newSlots = [...state.slots];
      newSlots[slotIndex] = null;
      return { ...state, slots: newSlots };
    }
    case 'CLEAR_SQUAD':
      return { ...state, slots: Array(11).fill(null) };
    default:
      return state;
  }
}

function calculateRating(slots) {
  const filledSlots = slots.filter((s) => s !== null);
  if (filledSlots.length !== 11) return null;

  const groups = { GK: [], DEF: [], MID: [], ATK: [] };

  slots.forEach((player, index) => {
    if (!player) return;
    const slot = FORMATION_SLOTS[index];
    const naturalGroup = getPositionGroup(player.position);
    const isInPosition = naturalGroup === slot.group;
    const penalty = isInPosition ? 0 : 3;
    const effectiveOverall = Math.max(1, player.overall - penalty);
    groups[slot.group].push(effectiveOverall);
  });

  const avg = (arr) =>
    arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  const gk = Math.round(avg(groups.GK));
  const def = Math.round(avg(groups.DEF));
  const mid = Math.round(avg(groups.MID));
  const atk = Math.round(avg(groups.ATK));
  const overall = Math.round(gk * 0.1 + def * 0.3 + mid * 0.3 + atk * 0.3);

  return { overall, gk, def, mid, atk };
}

export function SquadProvider({ children }) {
  const [state, dispatch] = useReducer(squadReducer, initialState);

  // Persist squad in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('football_game_squad', JSON.stringify(state.slots));
    } catch (e) {
      // Ignore storage errors
    }
  }, [state.slots]);

  const addPlayer = useCallback((slotIndex, player) => {
    dispatch({ type: 'ADD_PLAYER', payload: { slotIndex, player } });
  }, []);

  const removePlayer = useCallback((slotIndex) => {
    dispatch({ type: 'REMOVE_PLAYER', payload: { slotIndex } });
  }, []);

  const clearSquad = useCallback(() => {
    dispatch({ type: 'CLEAR_SQUAD' });
  }, []);

  const isPlayerInSquad = useCallback(
    (playerId) => state.slots.some((p) => p && p._id === playerId),
    [state.slots]
  );

  const rating = calculateRating(state.slots);
  const filledCount = state.slots.filter((s) => s !== null).length;

  const value = {
    slots: state.slots,
    formationSlots: FORMATION_SLOTS,
    addPlayer,
    removePlayer,
    clearSquad,
    isPlayerInSquad,
    rating,
    filledCount,
    getPositionGroup,
  };

  return (
    <SquadContext.Provider value={value}>{children}</SquadContext.Provider>
  );
}

export function useSquad() {
  const context = useContext(SquadContext);
  if (!context) {
    throw new Error('useSquad must be used within a SquadProvider');
  }
  return context;
}

export { FORMATION_SLOTS };
