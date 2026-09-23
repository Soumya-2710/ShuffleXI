import React from 'react';
import './RatingBar.css';

const RatingBar = ({ label, value, max = 99 }) => {
  const percentage = Math.min(100, Math.round((value / max) * 100));

  // Determine bar color based on stat tier
  const getColorClass = (val) => {
    if (val >= 85) return 'stat-elite';
    if (val >= 75) return 'stat-good';
    if (val >= 60) return 'stat-mid';
    return 'stat-low';
  };

  return (
    <div className="rating-bar-container">
      <div className="rating-bar-header">
        <span className="rating-bar-label">{label}</span>
        <span className={`rating-bar-value ${getColorClass(value)}`}>{value}</span>
      </div>
      <div className="rating-bar-track">
        <div
          className={`rating-bar-fill ${getColorClass(value)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default RatingBar;
