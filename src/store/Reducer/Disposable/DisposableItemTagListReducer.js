/**
 * Initial state for the disposable item tag which is empty.
 */
const initDisposablesState = {
  disposableItemTags: [],
  itemTotal: 0,
  itemPageSize: 20,
  itemPageIndex: 0,
};

/**
 * To store disposable item tag information and alter the data  
 * @param {*} state
 * @param {*} action
 * @returns 
 */
export default function disposableItemTagListReducer(state = initDisposablesState, action) {
  switch (action.type) {
    case 'ADD_DISPOSABLE_ITEM_TAG_LIST':
      let { data, count, items, page, rows } = action.payload;
      return { ...state, disposableItemTags: data, itemTotal: count, itemCurrentPage: page, itemRows: rows };

    case 'CHANGE_DISPOSABLE_ITEM_PAGE_SIZE':
      return { ...state, itemPageSize: action.payload }

    case 'CHANGE_DISPOSABLE_ITEM_PAGE':
      return { ...state, itemPageIndex: action.payload }

    default:
      return state;
  }
}

