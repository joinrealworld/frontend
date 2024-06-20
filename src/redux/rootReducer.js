/* Instruments */
import { combineReducers } from "redux";
import { userReducer, chatReducer } from './slices';

export const reducer = combineReducers({
  user: userReducer,
  chat: chatReducer,
});
