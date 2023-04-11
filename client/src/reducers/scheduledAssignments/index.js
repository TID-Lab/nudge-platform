const initState = [];

export default function scheduledAssignmentsReducer(state = initState, action) {
  switch (action.type) {
    case "scheduledAssignment/add":
      return [...state, action.payload];
    case "scheduledAssignment/set":
      return action.payload;
    case "scheduledAssignment/delete":
      if (action.payload < state.length) {
        state.splice(action.payload, 1);
        return [...state];
      } else {
        return state;
      }
    default:
      return state;
  }
}
