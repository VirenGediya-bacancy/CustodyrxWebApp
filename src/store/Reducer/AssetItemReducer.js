/**
 * Initial state for the drug item which is empty.
 */
 const initAssetItemState = {
    asset: {},
  };
  
  /**
   * To store drug item information and alter the data  
   * @param {*} state
   * @param {*} action
   * @returns 
   */
  export default function assetItemReducer(state = initAssetItemState, action) {
      switch(action.type) {
         case 'ADD_ASSET_ITEM':
           return {...state, asset: action.payload};
  
         default:
           return state;
       }
    }