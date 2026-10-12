const mongoose = require('mongoose');

const POSITIONS = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST', 'CF'];

const statField = {
  type: Number,
  required: true,
  min: [1, 'Stat must be at least 1'],
  max: [99, 'Stat must be at most 99'],
};

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Player name is required'],
      trim: true,
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
      enum: {
        values: POSITIONS,
        message: '{VALUE} is not a valid position',
      },
    },
    nationality: {
      type: String,
      required: [true, 'Nationality is required'],
      trim: true,
    },
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Club',
      required: [true, 'Club reference is required'],
      index: true,
    },
    league: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'League',
      required: [true, 'League reference is required'],
      index: true,
    },
    overall: { ...statField },
    pace: { ...statField },
    shooting: { ...statField },
    passing: { ...statField },
    dribbling: { ...statField },
    defending: { ...statField },
    physical: { ...statField },
    image: {
      type: String,
      default: null,
    },
    thumbnail: {
      type: String,
      default: null,
    },
    imageSource: {
      type: String,
      default: null,
    },
    number: {
      type: Number,
      default: null,
    },
    age: {
      type: Number,
      default: null,
    },
    height: {
      type: String,
      default: null,
    },
    isStarter: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Player', playerSchema);
