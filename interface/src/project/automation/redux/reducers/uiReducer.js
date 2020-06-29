import produce from 'immer';
import includes from "lodash/includes";
import {SET_LOADER, REMOVE_LOADER} from "../types/ui";

export const uiReducer = (ui = {}, action) => {
  switch (true) {
    case includes(action.type, SET_LOADER):
        const { loading, success, errorMessage } = action.payload;
        return Object.assign({}, ui, { [action.meta.feature]: { loading, success, errorMessage } });
    break;
    case includes(action.type, REMOVE_LOADER):
          return produce(ui, draft => {
            delete draft[action.meta.feature];
          });
    break;
    default:
      return ui;
  }
};
