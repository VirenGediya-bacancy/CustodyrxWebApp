/**
 * Initial state for the drug item tag which is empty.
 */
const initAssetsState = {
    assetServiceHistoryList: [],
  };
  /**
   * To store drug item tag information and alter the data  
   * @param {*} state
   * @param {*} action
   * @returns 
   */
  export default function assetSeviceHistoryListReducer(state = initAssetsState, action) {
      switch(action.type) {
         case 'ADD_ASSET_SERVICE_HISTORY_LIST':
           return {...state, assetServiceHistoryList: [...action.payload]};
  
         default:
           return state;
       }
    }