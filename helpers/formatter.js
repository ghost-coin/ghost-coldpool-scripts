const TICKER = "GHOST";

function formatAmtWithTicker(amt) {
  return `${amt.toLocaleString()} ${TICKER}`;
}

module.exports = { formatAmtWithTicker };
