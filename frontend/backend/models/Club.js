const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Club name is required'],
      trim: true,
    },
    league: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'League',
      required: [true, 'League reference is required'],
      index: true,
    },
    logo: {
      type: String,
      default: '',
    },
    stadium: {
      type: String,
      default: '',
    },
    manager: {
      type: String,
      default: '',
    },
    founded: {
      type: Number,
      default: null,
    },
    shortName: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index: club name must be unique within a league
clubSchema.index({ name: 1, league: 1 }, { unique: true });

module.exports = mongoose.model('Club', clubSchema);
