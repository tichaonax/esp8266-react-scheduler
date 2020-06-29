export const createReducer = (initialState, handlers) => (state = initialState, action) => {
  // eslint-disable-next-line
  if (handlers.hasOwnProperty(action.type)) {
    return handlers[action.type](state, action);
  }
  return state;
};

export default createReducer;
