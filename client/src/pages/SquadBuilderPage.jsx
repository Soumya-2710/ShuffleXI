import React, { useState } from 'react';
import FormationPitch from '../components/FormationPitch';
import TeamRating from '../components/TeamRating';
import PlayerSelectModal from '../components/PlayerSelectModal';
import { useSquad } from '../context/SquadContext';
import api from '../api/axiosClient';
import './SquadBuilderPage.css';

const SquadBuilderPage = () => {
  const { formationSlots, addPlayer, clearSquad, filledCount } = useSquad();
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAutoFilling, setIsAutoFilling] = useState(false);

  const handleOpenSlotPicker = (slotIndex) => {
    setSelectedSlotIndex(slotIndex);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSlotIndex(null);
  };

  const currentSlotDef =
    selectedSlotIndex !== null ? formationSlots[selectedSlotIndex] : null;

  // Auto-fill an optimal 11-player squad from DB for immediate testing
  const handleAutoFillSquad = async () => {
    setIsAutoFilling(true);
    try {
      const res = await api.get('/players');
      if (res.data?.success) {
        const allPlayers = res.data.data;
        clearSquad();

        // Slot definitions for 4-3-3:
        // 0: GK
        // 1: LB, 2: CB, 3: CB, 4: RB
        // 5: CM, 6: CM, 7: CM
        // 8: LW, 9: ST, 10: RW
        const usedIds = new Set();

        const pickPlayer = (allowedPos, fallbackGroup) => {
          let found = allPlayers.find(
            (p) => !usedIds.has(p._id) && allowedPos.includes(p.position)
          );
          if (!found) {
            found = allPlayers.find((p) => !usedIds.has(p._id));
          }
          if (found) usedIds.add(found._id);
          return found;
        };

        const squadPlan = [
          { idx: 0, p: pickPlayer(['GK']) },
          { idx: 1, p: pickPlayer(['LB']) },
          { idx: 2, p: pickPlayer(['CB']) },
          { idx: 3, p: pickPlayer(['CB']) },
          { idx: 4, p: pickPlayer(['RB']) },
          { idx: 5, p: pickPlayer(['CM', 'CDM', 'CAM']) },
          { idx: 6, p: pickPlayer(['CM', 'CDM', 'CAM']) },
          { idx: 7, p: pickPlayer(['CM', 'CDM', 'CAM']) },
          { idx: 8, p: pickPlayer(['LW']) },
          { idx: 9, p: pickPlayer(['ST', 'CF']) },
          { idx: 10, p: pickPlayer(['RW']) },
        ];

        squadPlan.forEach(({ idx, p }) => {
          if (p) addPlayer(idx, p);
        });
      }
    } catch (err) {
      console.error('Failed to auto-fill squad', err);
    } finally {
      setIsAutoFilling(false);
    }
  };

  return (
    <div className="page squad-builder-page">
      <div className="container">
        <div className="squad-builder-header">
          <div>
            <h1 className="page-title">4-3-3 Squad Builder</h1>
            <p className="page-subtitle">
              Click any slot on the pitch to assign a player. Manage position chemistry and calculate your team rating.
            </p>
          </div>

          <div className="squad-builder-toolbar">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleAutoFillSquad}
              disabled={isAutoFilling}
            >
              {isAutoFilling ? 'Drafting...' : '⚡ Auto-Draft 11'}
            </button>
            {filledCount > 0 && (
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={clearSquad}
              >
                Reset Pitch
              </button>
            )}
          </div>
        </div>

        <div className="squad-builder-layout">
          {/* Football Pitch */}
          <div className="pitch-column">
            <FormationPitch onSelectSlot={handleOpenSlotPicker} />
          </div>

          {/* Tactical Rating Card & Stats */}
          <div className="rating-column">
            <TeamRating />

            <div className="formation-info-card card">
              <h4 className="info-title">📋 4-3-3 System Rules</h4>
              <ul className="info-list">
                <li>
                  <strong>Goalkeeper:</strong> 1 GK slot • 10% weight.
                </li>
                <li>
                  <strong>Defense:</strong> 1 LB, 2 CB, 1 RB • 30% weight.
                </li>
                <li>
                  <strong>Midfield:</strong> 3 CM / CDM / CAM • 30% weight.
                </li>
                <li>
                  <strong>Attack:</strong> 1 LW, 1 ST / CF, 1 RW • 30% weight.
                </li>
                <li>
                  <strong>Chemistry Penalty:</strong> Players deployed outside their natural line receive <strong>-3 OVR penalty</strong>.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Player Selection Modal */}
        <PlayerSelectModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          targetSlotIndex={selectedSlotIndex}
          slotDef={currentSlotDef}
          onSelectPlayer={addPlayer}
        />
      </div>
    </div>
  );
};

export default SquadBuilderPage;
