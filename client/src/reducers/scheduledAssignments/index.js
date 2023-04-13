const initState = [];

export default function scheduledAssignmentsReducer(state = initState, action) {
  switch (action.type) {
    case "scheduledAssignments/add":
      return [...state, action.payload];
    case "scheduledAssignments/set":
      return action.payload;
    case "scheduledAssignments/delete":
      return state.filter(({ id }) => id !== action.payload);
    default:
      return state;
  }
}
