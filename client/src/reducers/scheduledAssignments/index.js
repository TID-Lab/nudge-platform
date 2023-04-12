const initState = [];

export default function scheduledAssignmentsReducer(state = initState, action) {
  switch (action.type) {
    case "scheduledAssignments/add":
      return [...state, action.payload];
    case "scheduledAssignments/set":
      return action.payload;
    case "scheduledAssignments/delete":
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
