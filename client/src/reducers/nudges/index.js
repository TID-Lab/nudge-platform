const initState = [];

export default function nudgesReducer(state = initState, action) {
  switch (action.type) {
    case "nudges/set":
      return action.payload;
    case "nudges/delete":
      if (action.payload < state.length) {
        state.splice(action.payload, 1);
        return [...state];
      } else {
        return state;
      }
    case "nudges/replace":
      return state.map((nudge) => {
        if (nudge.key === action.payload.key) {
          return action.payload;
        } else {
          return nudge;
        }
      });
    default:
      return state;
  }
}
