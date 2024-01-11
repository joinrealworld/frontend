/* Instruments */
import { combineReducers } from "redux";
import { userReducer } from './slices'

export const reducer = combineReducers({
  user: userReducer
});
