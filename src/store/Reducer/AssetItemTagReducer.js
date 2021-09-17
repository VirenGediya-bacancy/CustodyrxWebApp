/**
 * Initial state for the drug item which is empty.
 */
 const initAssetItemTagState = {
    assetItemTag: {},
  };
  
  /**
   * To store drug item information and alter the data  
   * @param {*} state
   * @param {*} action
   * @returns 
   */
  export default function assetItemTagReducer(state = initAssetItemTagState, action) {
      switch(action.type) {
         case 'ADD_ASSET_ITEM_TAG':
           return {...state, assetItemTag: action.payload};
  
         default:
           return state;
       }
    }