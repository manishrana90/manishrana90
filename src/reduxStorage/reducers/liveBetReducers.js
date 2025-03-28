const INITIAL_STATE = {
  allData: [],
  marketsData: [],
  allVirData: null,
  allbbbData: null,
  videoUrl: null,
  iphoneUrl: null,
  scoreUrl: null,
  allSession: [],
  betAllData: null,
  allBetData: [],
  refreshing: false,
  modalVisible: false,
  modalBetVisible: false,
  modalType: "",
  betDataType: null,
  loading: false,
  successModalVisible: false,
  playType: "Score",
  limitModalVisible: false,
  limit: { min: 0, max: 0 },
  bookmakerLimit: { min: 0, max: 0 },
  sessionLimit: { min: 0, max: 0 },
  modalVisibleOdds: false,
  betDataTypeOdds: {
    name: "",
    yesRate: "",
    noRate: "",
    betModalType: "",
    selectionId: "",
  },
  betTypeOdds: "yes",
  betAllDataOdds: {},
  oddsMarket: [],
  sessionModalVisible: false,
  sessionProfit: null,
  allStakes: [],
  userBetBalance: 0,
  userBetExposure: 0,
  virtualResult: [],
  bbbResult: [],
  bbbResultModal: false,
  bbbSingleResult: null,
  modalCashout: false,
  anyOdds: false,
  marketLoad: false,
  count: 5,
  placeType: "",
  cricketTime: 5,
  soccerTime: 5,
  tennisTime: 5,
  virtualTime: 3,
  bbbTime: 3,
  bookmakerTime: 2,
  sessionTime: 3,
  visibility: {
    MATCH_ODDS: true,
    Toss: true,
    Special: true,
    SESSION: true,
  }
};

const liveBetReducers = (state = INITIAL_STATE, action) => {
  // console.log("State Reducers", action);
  switch (action.type) {
    case "ALLDATA":
      return {
        ...state,
        allData: action.payload,
      };
    case "MARKETSDATA":
      return {
        ...state,
        marketsData: action.payload,
      };
    case "ALLVIRDATA":
      return {
        ...state,
        allVirData: action.payload,
      };
    case "ALLBBBDATA":
      return {
        ...state,
        allbbbData: action.payload,
      };
    case "SETVIDEO":
      return {
        ...state,
        videoUrl: action.payload,
      };
    case "SETIPHONE":
      return {
        ...state,
        iphoneUrl: action.payload,
      };
    case "SETSCORE":
      return {
        ...state,
        scoreUrl: action.payload,
      };

    case "ALLSESSION":
      return {
        ...state,
        allSession: action.payload,
      };
    case "BETALLDATA":
      return {
        ...state,
        betAllData: action.payload,
      };
    case "ALLBETDATA":
      return {
        ...state,
        allBetData: action.payload,
      };
    case "REFRESHING":
      return {
        ...state,
        refreshing: action.payload,
      };
    case "MODALVISIBLE":
      return {
        ...state,
        modalVisible: action.payload,
      };
    case "MODALBETVISIBLE":
      return {
        ...state,
        modalBetVisible: action.payload,
      };
    case "MODALTYPE":
      return {
        ...state,
        modalType: action.payload,
      };
    case "BETDATATYPE":
      return {
        ...state,
        betDataType: action.payload,
      };
    case "LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "SUCCESSMODALVISIBLE":
      return {
        ...state,
        successModalVisible: action.payload,
      };
    case "PLAYTYPE":
      return {
        ...state,
        playType: action.payload,
      };
    case "LIMITMODALVISIBLE":
      return {
        ...state,
        limitModalVisible: action.payload,
      };
    case "LIIMIT":
      return {
        ...state,
        limit: action.payload,
      };
    case "BOOKMAKERLIMIT":
      return {
        ...state,
        bookmakerLimit: action.payload,
      };
    case "SESSIONLIMIT":
      return {
        ...state,
        sessionLimit: action.payload,
      };
    case "MODALVISIBLEODDS":
      return {
        ...state,
        modalVisibleOdds: action.payload,
      };
    case "BETDATATYPEODDS":
      return {
        ...state,
        betDataTypeOdds: action.payload,
      };
    case "BETTYPEODDS":
      return {
        ...state,
        betTypeOdds: action.payload,
      };
    case "BETALLDATAODDS":
      return {
        ...state,
        betAllDataOdds: action.payload,
      };
    case "ODDSMARKET":
      return {
        ...state,
        oddsMarket: action.payload,
      };
    case "SESSIONMODALVISIBLE":
      return {
        ...state,
        sessionModalVisible: action.payload,
      };
    case "SESSIONPROFIT":
      return {
        ...state,
        sessionProfit: action.payload,
      };
    case "ALLSTAKES":
      return {
        ...state,
        allStakes: action.payload,
      };
    case "BETBALANCE":
      return {
        ...state,
        userBetBalance: action.payload,
      };

    case "BETEXPOSURE":
      return {
        ...state,
        userBetExposure: action.payload,
      };

    case "VIRTUALRESULT":
      return {
        ...state,
        virtualResult: action.payload,
      };
    case "BBBRESULT":
      return {
        ...state,
        bbbResult: action.payload,
      };
    case "BBBRESULTMODAL":
      return {
        ...state,
        bbbResultModal: action.payload,
      };
    case "BBBSINGLERESULT":
      return {
        ...state,
        bbbSingleResult: action.payload,
      };
    case "MODALCASHOUT":
      return {
        ...state,
        modalCashout: action.payload,
      };
    case "ANYODDS":
      return {
        ...state,
        anyOdds: action.payload,
      };
    case "MARKETLOAD":
      return {
        ...state,
        marketLoad: action.payload,
      };
    case "COUNT":
      return {
        ...state,
        count: action.payload,
      };
    case "PLACETYPE":
      return {
        ...state,
        placeType: action.payload,
      };
    case "CRICKETTIME":
      return {
        ...state,
        cricketTime: action.payload,
      };
    case "SOCCERTIME":
      return {
        ...state,
        soccerTime: action.payload,
      };
    case "TENNISTIME":
      return {
        ...state,
        tennisTime: action.payload,
      };
    case "VIRTUALTIME":
      return {
        ...state,
        virtualTime: action.payload,
      };
    case "BBBTIME":
      return {
        ...state,
        bbbTime: action.payload,
      };
    case "BOOKMAKERTIME":
      return {
        ...state,
        bookmakerTime: action.payload,
      };
    case "SESSIONTIME":
      return {
        ...state,
        sessionTime: action.payload,
      };
    case "VISIBILITY":
      return {
        ...state,
        visibility: action.payload,
      };

    default:
      return state;
  }
};
export default liveBetReducers;
