/**
 * Initial state for the drug item which is empty.
 */
 const initDrugItemState = {
    drug: {},
  };
  
  /**
   * To store drug item information and alter the data  
   * @param {*} state
   * @param {*} action
   * @returns 
   */
  export default function drugItemReducer(state = initDrugItemState, action) {
      switch(action.type) {
         case 'ADD_DRUG_ITEM':
           return {...state, drug: action.payload};
  
         default:
           return state;
       }
    }