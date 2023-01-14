// The reducer for the pending nudges, in order from highest priority to lowest priority

const initState = [];

export default function pendingNudgesReducer(state = initState, action) {
    switch (action.type) {
        case 'pendingNudges/set':
            return action.payload;
        case 'pendingNudges/delete':
            if (action.payload < state.length) {
              state.splice(action.payload, 1);
              // Redux needs a new object for updates
              return [...state]
            } else {
              return state
            }
        case 'pendingNudges/add':
          return [...state, action.payload]
        default:
            return state;
    }
}