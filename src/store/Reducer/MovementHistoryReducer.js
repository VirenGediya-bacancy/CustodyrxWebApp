const initMovementHistoryState = {
    movementList: [],
    total: 0,
  };
  
  export default function movementHistoryReducer(state = initMovementHistoryState, action) {
    switch (action.type) {
      case "GET_ALL_MOVEMENT_LIST":
        let {data, count, page } = action.payload;
       
        // return { ...state, movementList: action.payload };
        return { ...state, movementList: data, total: count, currentPage: page  };
      default:
        return state;
    }
  }