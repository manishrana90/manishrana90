const INITIAL_STATE = {
    inPlay: [],
    cricket: [],
    soccer: [],
    tennis: [],
  };
  
  const allMarketReducers = (state = INITIAL_STATE, action) => {
    // console.log("State Reducers", action);
    switch (action.type) {
      case "INPLAY":
        return {
          ...state,
          inPlay: action.payload,
        };
      case "CRICKET":
        return {
          ...state,
          cricket: action.payload,
        };
      case "SOCCER":
        return {
          ...state,
          soccer: action.payload,
        };
  
      case "TENNIS":
        return {
          ...state,
          tennis: action.payload,
        };
    
      default:
        return state;
    }
  };
  export default allMarketReducers;
  