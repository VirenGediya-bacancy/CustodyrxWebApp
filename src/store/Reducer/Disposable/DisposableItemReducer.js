/**
 * Initial state for the disposable item which is empty.
 */
 const initDisposableItemState = {
    disposable: {},
    total: 0,
    pageSize : 20,
    pageIndex : 0,
  };
  
  /**
   * To store disposable item information and alter the data
   * @param {*} state
   * @param {*} action
   * @returns 
   */
export default function disposableItemReducer(state = initDisposableItemState, action) {
      switch(action.type) {
         case 'ADD_DISPOSABLE_ITEM':
          return { ...state, disposable: action.payload};

         default:
           return state;
       }
    }