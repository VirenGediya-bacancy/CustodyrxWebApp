/**
 * Initial state for the drug item which is empty.
 */
 const initDrugItemTagState = {
    drugItemTag: {},
  };
  
  /**
   * To store drug item information and alter the data  
   * @param {*} state
   * @param {*} action
   * @returns 
   */
  export default function drugItemTagReducer(state = initDrugItemTagState, action) {
      switch(action.type) {
         case 'ADD_DRUG_ITEM_TAG':
           return {...state, drugItemTag: action.payload};
  
         default:
           return state;
       }
    }