import { DisposableColumns } from "Constant/Column";

/**
 * Initial state for the disposables which is empty.
 */
const initDisposablesState = {
  disposables: [],
  categories: [],
  disposableColumns : DisposableColumns,
  activeCategories: [],
  total: 0,
  pageSize : 20,
  pageIndex : 0,
};

/**
 * To store disposables information and alter the data  
 * @param {*} state
 * @param {*} action
 * @returns 
 */
export default function disposablesReducer(state = initDisposablesState, action) {
  switch(action.type) {
    case 'ADD_DISPOSABLES_LIST':
        let { data, count, items, page, rows } = action.payload;
        return {...state, disposables: data, total: count, currentPage: page, rows: rows };

    case 'GET_ALL_CATEGORIES':
      return { ...state, categories: action.payload };

    case 'UPDATE_DISPOSABLE_COLUMNS': 
      return { ... state, disposableColumns: [...action.payload] };
    
    case 'CHANGE_DISPOSABLE_PAGE_SIZE': 
      return {...state, pageSize : action.payload,  pageIndex : 0}

    case 'CHANGE_DISPOSABLE_PAGE':
      return {...state, pageIndex : action.payload}
    case 'GET_DISPOSABLE_ACTIVE_CATEGORIES':
        return {...state, activeCategories : action.payload} 
    default:
      return state;
  }
}