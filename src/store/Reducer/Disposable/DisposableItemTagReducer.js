/**
 * Initial state for the disposable item which is empty.
 */
 const initDisposableItemTagState = {
    disposableItemTag: {},
  };
  
  /**
   * To store disposable item information and alter the data  
   * @param {*} state
   * @param {*} action
   * @returns 
   */
export default function disposableItemTagReducer(state = initDisposableItemTagState, action) {
      switch(action.type) {
        case 'ADD_DISPOSABLE_ITEM_TAG':
          return { ...state, disposableItemTag: action.payload};
  
         default:
           return state;
       }
    }