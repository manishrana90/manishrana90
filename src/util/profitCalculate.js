export const profitCalculate = (betsData, selectionId, marketId) => {

    let laystaketotal = betsData.filter((item) => {
          return item.runnerId != selectionId && item.marketId === marketId;
      });

      let betsValue = betsData.filter((item) => {
          return item.runnerId == selectionId && item.marketId === marketId;
      });


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
    
      let markettotal = backtotal + laytotal;

      return markettotal;
}