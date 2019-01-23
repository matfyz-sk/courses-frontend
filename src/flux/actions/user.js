import {SWITCH_USER_TYPE} from '../types';
import dispatcher from "../dispatcher";

export const switchUser = (isAdmin) => {
  dispatcher.dispatch({
    type: SWITCH_USER_TYPE,
    isAdmin
  });

};
