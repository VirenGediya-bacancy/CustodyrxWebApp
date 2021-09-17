/**
 * Initial state for the drug item tag which is empty.
 */
const initAssetsState = {
    assetItemTags: [],
  };
  /**
   * To store drug item tag information and alter the data  
   * @param {*} state
   * @param {*} action
   * @returns 
   */
  export default function assetItemTagListReducer(state = initAssetsState, action) {
      switch(action.type) {
         case 'ADD_ASSET_ITEM_TAG_LIST':
          let { data, count, items, page, rows } = action.payload;
          return {...state, assetItemTags: data, itemTotal: count, itemCurrentPage: page, itemRows: rows };

         default:
           return state;
       }
    }