/**
 * Master Seed Export Module
 * Provides unified access to all 5 major European league datasets (2026/27 season)
 */

const premierLeagueData = require('./premierLeagueData');
const laligaData = require('./laligaData');
const serieAData = require('./serieAData');
const bundesligaData = require('./bundesligaData');
const ligue1Data = require('./ligue1Data');

const allLeaguesData = [
  premierLeagueData,
  laligaData,
  serieAData,
  bundesligaData,
  ligue1Data,
];

module.exports = {
  premierLeagueData,
  laligaData,
  serieAData,
  bundesligaData,
  ligue1Data,
  allLeaguesData,
};
