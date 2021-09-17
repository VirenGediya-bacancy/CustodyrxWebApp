import axios from "axios";
import { BaseURL } from "Constant/BaseURL";
import { trackPromise } from "react-promise-tracker";

const addUser = (userObj) => {
  return (dispatch) => {
    return trackPromise(
      new Promise((resolve, reject) => {
        axios(`${BaseURL}/user/register`, {
          method: "POST",
          data: userObj,
        })
          .then((res) => {
            resolve(res.data);
          })
          .catch((error) => {
            reject(error);
          });
      })
    );
  };
};

const getAllUserList = (obj) => {
  const { page, rows, field, sortOrder, isActive } = obj;
  let url = `${BaseURL}/user?page=${
    page + 1
  }&rows=${rows}&sortOrder=${sortOrder}&field=${field}`;
  url = isActive === 1 || isActive === 0 ? `${url}&isActive=${isActive}` : url;

  return (dispatch) => {
    return trackPromise(
      new Promise((resolve, reject) => {
        axios(url, { method: "GET" })
          .then((res) => {
            dispatch({ type: "GET_USERS_LIST", payload: res.data.data });
            resolve(res.data.data.data);
          })
          .catch((error) => {
            dispatch({ type: "GET_USERS_LIST", payload: [] });
            reject(error);
          });
      })
    );
  };
};

const updateUserStatus = (ids, status) => {
  return function (dispatch) {
    let url = status ? `/user/bulk-mark-active` : `/user/bulk-mark-inactive`;
    return trackPromise(
      new Promise((resolve, reject) => {
        axios(`${BaseURL}${url}`, {
          method: "PUT",
          data: {
            GUIDS: ids,
          },
        })
          .then((res) => {
            resolve(res.data);
          })
          .catch(function (error) {
            reject(error);
          });
      })
    );
  };
};

const deleteBulkUsers = (ids) => {
  return function (dispatch) {
    return trackPromise(
      new Promise((resolve, reject) => {
        axios(`${BaseURL}/user/bulk-delete-users`, {
          method: "DELETE",
          data: { GUIDS: ids },
        })
          .then((res) => {
            return resolve(res.data);
          })
          .catch(function (error) {
            reject(error);
          });
      })
    );
  };
};

const getUserDetails = (userId) => {
  return (dispatch) => {
    return trackPromise(
      new Promise((resolve, reject) => {
        axios(`${BaseURL}/user/${userId}`, { method: "GET" })
          .then((res) => {
            dispatch({ type: "GET_USERS_DETAILS", payload: res.data.data });
            resolve(res.data.data);
          })
          .catch((error) => {
            dispatch({ type: "GET_USERS_DETAILS", payload: [] });
            reject(error);
          });
      })
    );
  };
};

const updateUser = (obj, userId) => {
  return function (dispatch) {
    return trackPromise(
      new Promise((resolve, reject) => {
        axios(`${BaseURL}/user/${userId}`, {
          method: "PUT",
          data: obj,
        })
          .then((res) => {
            resolve(res.data);
          })
          .catch(function (error) {
            reject(error);
          });
      })
    );
  };
};

const changeUsersPageSize = (pageSize) => {
  return { type: "CHANGE_USERS_PAGE_SIZE", payload: pageSize };
};

const changeUsersPage = (pageNumber) => {
  return { type: "CHANGE_USERS_PAGE", payload: pageNumber };
};

const getUserMovementHistory = (obj) => {
  const { page, rows, GUID, sortOrder, field } = obj;
  return (dispatch) => {
    return trackPromise(
      new Promise((resolve, reject) => {
        axios(`${BaseURL}/movements?sortOrder=${sortOrder}&page=${1}&field=${field}&rows=${rows}&itemTagGuid=${GUID}`, { method: "GET" })
          .then((res) => {
            dispatch({ type: "GET_USERS_MOVEMENT_HISTORY", payload: res.data.data.data });
            resolve(res.data.data);
          })
          .catch((error) => {
            dispatch({ type: "GET_USERS_MOVEMENT_HISTORY", payload: [] });
            reject(error);
          });
      })
    );
  };
};

export default {
  getAllUserList,
  updateUserStatus,
  deleteBulkUsers,
  getUserDetails,
  addUser,
  updateUser,
  changeUsersPageSize,
  changeUsersPage,
  getUserMovementHistory,
};
