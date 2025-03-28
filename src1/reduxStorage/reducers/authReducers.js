const INITIAL_STATE = {
  casinoGames: null,
  roomEventId: null,
  eventSession: [],
  userBalance: 0,
  userExpo: 0,
  userBonus: 0,
  casinoBalance: 0,
  appVersion: "1.0",
  depositValue: "1.0",
};

const authReducers = (state = INITIAL_STATE, action) => {
  // console.log("State Reducers", action);
  switch (action.type) {
    case "CASINOGAMES":
      return {
        ...state,
        casinoGames: action.payload,
      };
    case "ROOMEVENTID":
      return {
        ...state,
        roomEventId: action.payload,
      };
    case "EVENTSESSION":
      return {
        ...state,
        eventSession: action.payload,
      };

    case "USERBALANCE":
      return {
        ...state,
        userBalance: action.payload,
      };
    case "USEREXPO":
      return {
        ...state,
        userExpo: action.payload,
      };
    case "USERBONUS":
      return {
        ...state,
        userBonus: action.payload,
      };
    case "CASINOBALANCE":
      return {
        ...state,
        casinoBalance: action.payload,
      };
    case "APPVERSION":
      return {
        ...state,
        appVersion: action.payload,
      };
    case "DEPOSITVALUE":
      return {
        ...state,
        depositValue: action.payload,
      };

    default:
      return state;
  }
};
export default authReducers;
