import React from 'react';
import SquadSlot from './SquadSlot';
import { useSquad } from '../context/SquadContext';
import './FormationPitch.css';

const FormationPitch = ({ onSelectSlot }) => {
  const { slots, formationSlots, removePlayer, getPositionGroup } = useSquad();

  // Group slots by tactical lines for 4-3-3:
  // Forward line: LW (8), ST (9), RW (10)
  // Midfield line: CM1 (5), CM2 (6), CM3 (7)
  // Defense line: LB (1), CB1 (2), CB2 (3), RB (4)
  // Goalkeeper: GK (0)
  const attackSlots = [formationSlots[8], formationSlots[9], formationSlots[10]];
  const midfieldSlots = [formationSlots[5], formationSlots[6], formationSlots[7]];
  const defenseSlots = [
    formationSlots[1],
    formationSlots[2],
    formationSlots[3],
    formationSlots[4],
  ];
  const goalkeeperSlot = [formationSlots[0]];

  return (
    <div className="pitch-container">
      <div className="pitch-field">
        {/* Pitch Lines */}
        <div className="pitch-line pitch-halfway"></div>
        <div className="pitch-center-circle"></div>
        <div className="pitch-center-spot"></div>

        {/* Top Penalty Box (Opponent End) */}
        <div className="pitch-penalty-area-top"></div>
        <div className="pitch-goal-area-top"></div>

        {/* Bottom Penalty Box (Our GK End) */}
        <div className="pitch-penalty-area-bottom"></div>
        <div className="pitch-goal-area-bottom"></div>

        {/* Tactical 4-3-3 Lines */}
        <div className="pitch-tactical-row row-attack">
          {attackSlots.map((slotDef) => (
            <SquadSlot
              key={slotDef.index}
              slotDef={slotDef}
              player={slots[slotDef.index]}
              onSlotClick={onSelectSlot}
              onRemovePlayer={removePlayer}
              getPositionGroup={getPositionGroup}
            />
          ))}
        </div>

        <div className="pitch-tactical-row row-midfield">
          {midfieldSlots.map((slotDef) => (
            <SquadSlot
              key={slotDef.index}
              slotDef={slotDef}
              player={slots[slotDef.index]}
              onSlotClick={onSelectSlot}
              onRemovePlayer={removePlayer}
              getPositionGroup={getPositionGroup}
            />
          ))}
        </div>

        <div className="pitch-tactical-row row-defense">
          {defenseSlots.map((slotDef) => (
            <SquadSlot
              key={slotDef.index}
              slotDef={slotDef}
              player={slots[slotDef.index]}
              onSlotClick={onSelectSlot}
              onRemovePlayer={removePlayer}
              getPositionGroup={getPositionGroup}
            />
          ))}
        </div>

        <div className="pitch-tactical-row row-goalkeeper">
          {goalkeeperSlot.map((slotDef) => (
            <SquadSlot
              key={slotDef.index}
              slotDef={slotDef}
              player={slots[slotDef.index]}
              onSlotClick={onSelectSlot}
              onRemovePlayer={removePlayer}
              getPositionGroup={getPositionGroup}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormationPitch;
