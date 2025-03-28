export const calculateBetTotal = (betsValue, laystaketotal) => {
    let backData = betsValue.filter((item) => {
      return item.type == "Back";
    });

    let layData = betsValue.filter((item) => {
      return item.type == "Lay";
    });

    let oppBack = laystaketotal.filter((item) => {
      return item.type == "Back";
    });

    let totalOppBack = 0;
    oppBack.map((b) => {
      totalOppBack = totalOppBack + b.stake;
    });

    let oppLay = laystaketotal.filter((item) => {
      return item.type == "Lay";
    });

    let totalOppLay = 0;
    oppLay.map((b) => {
      totalOppLay = totalOppLay + b.stake;
    });

    let backvalue = 0;
    backData.map((b) => {
      let back = b.stake * (b.rate - 1);
      backvalue = backvalue + back;
    });

    let layvalue = 0;
    layData.map((b) => {
      let lay = b.stake * (b.rate - 1);
      layvalue = layvalue + lay;
    });

    let backtotal = backvalue - totalOppBack;
    let laytotal = totalOppLay - layvalue;

    let layfinal = backtotal + laytotal;
    return layfinal;
  };