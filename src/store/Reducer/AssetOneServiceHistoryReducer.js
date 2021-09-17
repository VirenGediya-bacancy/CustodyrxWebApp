/**
 * Initial state for the drug item which is empty.
 */
 const initAssetOneServiceHistoryState = {
    assetServiceHistory: {},
  };
  
  /**
   * To store drug item information and alter the data  
   * @param {*} state
   * @param {*} action
   * @returns 
   */
  export default function assetOneServiceHistoryReducer(state = initAssetOneServiceHistoryState, action) {
      switch(action.type) {
         case 'ADD_ASSET_ONE_SERVICE_HISTORY':
           return {...state, assetServiceHistory: action.payload};
  
         default:
           return state;
       }
    }