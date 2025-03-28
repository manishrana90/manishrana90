export const sessionProfitCalculate = (betstest) => {
  let newarr = [];
  for (let i = 0; i < betstest.length; i++) {
    let data = newarr.filter((item) => {
      return (
        item.selectionName === betstest[i].selectionName &&
        item.marketName === betstest[i].marketName
      );
    });

    if (data.length > 0) {
    } else {
      newarr.push(betstest[i]);
    }
  }

  const resultArray = newarr.map((a, index) => {
    let totalBack = 0;
    let totaLay = 0;
    let oppBack = 0;
    let minimumStake = 0;

    betstest.forEach((b) => {
      if (b.type === "Back" && b.selectionName <= a.selectionName) {
        totalBack = betstest.some((item) => item.type === "Lay")
          ? totalBack + b.stake * b.rate
          : totalBack + b.stake;
      } else if (b.type === "Lay" && b.selectionName <= a.selectionName) {
        totaLay =
          b.rate === 1
            ? totaLay + b.stake * b.rate
            : totaLay - b.stake * b.rate;
      } else if (b.type === "Back" && b.selectionName >= a.selectionName) {
        oppBack = oppBack + b.stake * b.rate;
      }

      if (minimumStake === 0) {
        minimumStake = b.selectionName;
      } else if (minimumStake > b.selectionName) {
        minimumStake = b.selectionName;
      }
    });

    if (newarr.length - 1 === index) {
      let opp = 0;
      if (a.type === "Lay") {
        opp = oppBack;
      }
      let backtotal = totalBack + totaLay - opp;

      return backtotal > 0 ? 0 - backtotal : backtotal;
    }
  });

  const lastEntry = resultArray.length === 0 ? 0 : resultArray.pop().toFixed(0);

  return lastEntry;
};
