const initState = [];

export default function sentAssignmentsReducer(state = initState, action) {
  switch (action.type) {
    case "sentAssignments/add":
      return [...state, action.payload];
    case "sentAssignments/set":
      return action.payload;
    case "sentAssignments/delete":
      return state.filter(({ id }) => id !== action.payload);
    default:
      return state;
  }
}
