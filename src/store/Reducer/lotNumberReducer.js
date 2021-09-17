const initLotNumberState = {
  lotNumber: [],
  locationList : []
};

export default function lotNumberReducer(state = initLotNumberState, action) {
  switch (action.type) {
    case "GET_ALL_LOT_NUMBERS":
      return { ...state, lotNumber: action.payload };
    case "GET_ALL_LOCATIONS":
      return { ...state, locationList: action.payload };
    default:
      return state;
  }
}