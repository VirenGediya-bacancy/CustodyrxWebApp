/**
 * Initial state for the drug item tag which is empty.
 */
const initDrugsState = {
    drugItemTags: [],
    itemTotal: 0,
    itemPageSize : 20,
    itemPageIndex : 0,
  };
  /**
   * To store drug item tag information and alter the data  
   * @param {*} state
   * @param {*} action
   * @returns 
   */
  export default function drugItemTagListReducer(state = initDrugsState, action) {
      switch(action.type) {
         case 'ADD_DRUG_ITEM_TAG_LIST':
          let { data, count, items, page, rows } = action.payload;
          return {...state, drugItemTags: data, itemTotal: count, itemCurrentPage: page, itemRows: rows };

         default:
           return state;
       }
    }