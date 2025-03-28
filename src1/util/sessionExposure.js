export const sessionExposure = (bets, marketId) => {
  var runnerProfit = {};
  var total = 0;
  var totalArr = [];
  var min = 0,
    max = 0,
    bc = 0;
  for (var j = 0; j < bets.length; j++) {
    if (j == 0) {
      min = parseInt(bets[j].selectionName);
      max = parseInt(bets[j].selectionName);
    } else {
      if (parseInt(bets[j].selectionName) > max)
        max = parseInt(bets[j].selectionName);
      if (parseInt(bets[j].selectionName) < min)
        min = parseInt(bets[j].selectionName);
    }
  }

  for (var i = min - 1; i < max + 1; i++) {
    var result = i;
    var c2 = 0,
      maxLoss = 0;
    for (var bi1 = 0; bi1 < bets.length; bi1++) {
      c2++;
      var b1 = bets[bi1];
      if (b1.type == "Back") {
        if (result >= parseInt(bets[bi1].selectionName)) {
          maxLoss += Math.round(bets[bi1].rate * bets[bi1].stake);
        } else {
          maxLoss -= bets[bi1].stake;
        }
      } else {
        if (result < parseInt(bets[bi1].selectionName)) {
          maxLoss += bets[bi1].stake;
        } else {
          maxLoss -= Math.round(bets[bi1].rate * bets[bi1].stake);
        }
      }
    }
    runnerProfit[i] = maxLoss;
  }

  var w = null;
  if (w != null) {
    if (runnerProfit[w] == null) {
      runnerProfit[w] = 0;
    }
  }
  for (const t in runnerProfit) {
    totalArr.push(runnerProfit[t]);
  }

  return Math.min.apply(Math, totalArr);
};
