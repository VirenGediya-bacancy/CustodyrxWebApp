import { DrugsColumns } from "Constant/Column";

/**
 * Initial state for the drugs which is empty.
 */
const initDrugsState = {
  drugs: [],
  total: 0,
  pageSize : 20,
  pageIndex : 0,
  activeCategories: [],
  categories : [],
  columns : DrugsColumns,
};

/**
 * To store drugs information and alter the data  
 * @param {*} state
 * @param {*} action
 * @returns 
 */
export default function drugsReducer(state = initDrugsState, action) {
    switch(action.type) {
      case 'ADD_DRUGS_LIST':
        let { data, count, items, page, rows } = action.payload;
        return {...state, drugs: data, total: count, currentPage: page, rows: rows };

      case 'CHANGE_PAGE_SIZE': 
        return {...state, pageSize : action.payload, pageIndex : 0}

      case 'CHANGE_PAGE':
        return {...state, pageIndex : action.payload}

      case 'GET_ALL_CATEGORIES':
        return {...state, categories: action.payload}
        
      case 'UPDATE_DRUGS_COLUMNS' : 
        return {...state, columns : [...action.payload]}
      case 'GET_DRUG_ACTIVE_CATEGORIES':
          return {...state, activeCategories : action.payload} 
      default:
        return state;
    }
  }