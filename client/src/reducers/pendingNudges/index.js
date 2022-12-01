// The reducer for the pending nudges, in order from highest priority to lowest priority

const initState = [];

export default function pendingNudgesReducer(state = initState, action) {
    switch (action.type) {
        case 'pendingNudges/set':
            return action.payload;
        case 'pendingNudges/delete':
            console.log('bruh')
            console.log(state);
            if (action.payload < state.length) {
              console.log('be')
              state.splice(action.payload, 1);
              console.log(state);
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