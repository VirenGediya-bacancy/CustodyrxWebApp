/**
 * Initial state for the search.
 */
 const initSearchState = {
    searchKeyword: '',
  };
  
  /**
   * It will store the user search keyword 
   * @param {*} state
   * @param {*} action
   * @returns 
   */
  export default function searchReducer(state = initSearchState, action) {
      switch(action.type) {
         case 'SAVE_SEARCH':
           return {...state, searchKeyword: action.payload};
           case 'CLEAR_SEARCH':
           return {...state, searchKeyword: ""};
         default:
           return state;
       }
    }