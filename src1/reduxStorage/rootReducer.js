import { combineReducers } from "redux";
import liveBetReducers from "./reducers/liveBetReducers";
import allMarketReducers from "./reducers/allMartketReducers";
import loginReducers from "./reducers/loginReducers";

const rootReducer = combineReducers({
  liveBet: liveBetReducers,
  allMarket: allMarketReducers,
  loginStates: loginReducers,
});

export default rootReducer;
