import { UserColumns } from "Constant/UserColumns";

/**
 * Initial state for the Assets which is empty.
 */
const InitialState = {
  usersList: [],
  usersDetails: {},
  usersMovementHistory: [],
  userColumns: UserColumns,
  currentPage: 0,
  pageSize: 20,
  pageIndex: 0,
  total: 0,
};

/**
 * To store Assets information and alter the data
 * @param {*} state
 * @param {*} action
 * @returns
 */
export default function usersReducer(state = InitialState, action) {
  switch (action.type) {
    case "GET_USERS_LIST":
      const { data, count, page, rows } = action.payload;
      return {
        ...state,
        usersList: data,
        total: count,
        currentPage: page,
        rows: rows,
      };
    case "CHANGE_USERS_PAGE_SIZE":
      return { ...state, pageIndex: 0, pageSize: action.payload };

    case "CHANGE_USERS_PAGE":
      return { ...state, pageIndex: action.payload };
    case "GET_USERS_DETAILS":
      return { ...state, usersDetails: action.payload };
    case "GET_USERS_MOVEMENT_HISTORY":
      return { ...state, usersMovementHistory: action.payload };
    default:
      return state;
  }
}
