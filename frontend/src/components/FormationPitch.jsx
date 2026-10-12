import React from 'react';
import SquadSlot from './SquadSlot';
import { useSquad } from '../context/SquadContext';
import './FormationPitch.css';

const FormationPitch = ({ onSelectSlot }) => {
  const { slots, formationSlots, removePlayer, getPositionGroup, rating, chemistry, filledCount } = useSquad();

  // Tactical lines for 4-3-3:
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

  const filledPlayers = slots.filter(Boolean);
  const currentOvr = rating
    ? rating.overall
    : filledPlayers.length > 0
    ? Math.round(filledPlayers.reduce((a, p) => a + p.overall, 0) / filledPlayers.length)
    : '--';

  return (
    <div className="pitch-container">
      {/* EA SPORTS FC 26 Matchday HUD Overlay */}
      <div className="fc-matchday-hud">
        <div className="fc-hud-tactic">
          <span className="fc-hud-icon">▼</span>
          <div className="fc-hud-tactic-text">
            <span className="fc-hud-scheme">4-3-3 ATTACK</span>
            <span className="fc-hud-playstyle">EA FC 26 TACTICAL</span>
          </div>
        </div>

        <div className="fc-hud-center-rating">
          <div className="fc-hud-ovr-box">
            <span className="fc-hud-ovr-val">{currentOvr}</span>
            <span className="fc-hud-ovr-tag">TEAM OVR</span>
          </div>
        </div>

        <div className="fc-hud-chem-box">
          <div className="fc-hud-chem-row">
            <span className={`fc-hud-diamond-pip ${chemistry?.chemistry > 0 ? 'active' : ''}`}>◆</span>
            <span className={`fc-hud-diamond-pip ${chemistry?.chemistry >= 15 ? 'active' : ''}`}>◆</span>
            <span className={`fc-hud-diamond-pip ${chemistry?.chemistry >= 28 ? 'active' : ''}`}>◆</span>
          </div>
          <span className="fc-hud-chem-score">{chemistry?.chemistry || 0}/33 CHEM</span>
        </div>
      </div>

      {/* Stadium Pitch Field */}
      <div className="pitch-field">
        {/* Stadium Floodlights Glow Effect */}
        <div className="stadium-floodlight floodlight-left"></div>
        <div className="stadium-floodlight floodlight-right"></div>
        <div className="stadium-vignette"></div>

        {/* Pitch Lines */}
        <div className="pitch-line pitch-halfway"></div>
        <div className="pitch-center-circle">
          <div className="fc-crest-watermark">
            <span className="fc-watermark-triangle">▼</span>
            <span className="fc-watermark-text">FC 26</span>
          </div>
        </div>
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
