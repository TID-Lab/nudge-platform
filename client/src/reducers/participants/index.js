// The reducer for participants

const initState = [];

export default function participantsReducer(state = initState, action) {
  switch (action.type) {
    case "participants/set":
      return action.payload;
    case "participants/delete":
      if (action.payload < state.length) {
        state.splice(action.payload, 1);
        // Redux needs a new object for updates
        return [...state];
      } else {
        return state;
      }
    case "participants/add":
      return [...state, action.payload];
    case "participants/update":
      state[action.payload.index] = action.payload.participant;

      return [...state];
    default:
      return state;
  }
}
