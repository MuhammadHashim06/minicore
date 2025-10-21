function calcLevel(xp) { return Math.min(10, Math.floor(xp / 100) + 1); }
function xpDeltaForScore(score) { return score >= 60 ? 10 : 5; }
module.exports = { calcLevel, xpDeltaForScore };
