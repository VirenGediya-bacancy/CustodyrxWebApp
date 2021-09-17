import { AssetColumns } from "Constant/Column";

/**
 * Initial state for the Assets which is empty.
 */
 const InitialState = {
    assetsList: [],
    categories : [],
    activeCategories: [],
    assetColumns : AssetColumns,
    currentPage: 0,
    pageSize : 20,
    pageIndex : 0,
    total: 0,
  };
  
  /**
   * To store Assets information and alter the data  
   * @param {*} state
   * @param {*} action
   * @returns 
   */
  export default function assetsReducer(state = InitialState, action) {
      switch(action.type) {
        case 'ADD_ASSET_LIST':
          let { data, count, items, page, rows } = action.payload;
          return {...state, assetsList: data, total: count, currentPage: page, rows: rows };

        case 'GET_ALL_CATEGORIES':
          return { ...state, categories: action.payload }

        case 'UPDATE_ASSET_COLUMNS' : 
          return { ...state, assetColumns: action.payload }

        case 'CHANGE_ASSETS_PAGE_SIZE':
          return {...state, pageSize : action.payload,  pageIndex : 0}

        case 'CHANGE_ASSETS_PAGE':
          return {...state, pageIndex : action.payload}
        case 'GET_ASSET_ACTIVE_CATEGORIES':
          return {...state, activeCategories : action.payload}

        default:
          return state;
       }
    }