const mongoose = require('mongoose');

const leagueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'League name is required'],
      unique: true,
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    logo: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('League', leagueSchema);
