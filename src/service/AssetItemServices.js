import axios from "axios";
import { trackPromise } from "react-promise-tracker";
const { BaseURL } = require("Constant/BaseURL");


const getAllServiceEventList = (obj) => {
    const { itemId } = obj;
    return  function(dispatch) {
       return trackPromise(
           new Promise((resolve, reject) => {
               axios(`${BaseURL}/assetservice/?itemTagGuid=${itemId}`, {
                   method: "GET",
               }).then((res) => {
                   dispatch({ type: 'ADD_ASSET_SERVICE_HISTORY_LIST', payload: res.data.data })
                   resolve(res.data.data);
               }).catch(
                   function (error) {
                       reject(error);
                   }
               )
           })
       )
   };
}

const getAssetServiceEventDetails = (obj) => {
    return  function(dispatch) {
       return trackPromise(
           new Promise((resolve, reject) => {
               axios(`${BaseURL}/assetservice/${obj}`, {
                   method: "GET",
               }).then((res) => {
                //    dispatch({ type: 'ADD_ASSET_SERVICE_HISTORY_LIST', payload: res.data.data })
                   resolve(res.data.data);
               }).catch(
                   function (error) {
                       reject(error);
                   }
               )
           })
       )
   };
}

const addAssetServiceEvent = (formData) => {
    return function (dispatch) {
        return trackPromise(
            new Promise((resolve, reject) => {
                axios(`${BaseURL}/assetservice`, {
                    method: "POST",
                    data: formData,
                }).then((res) => {
                    resolve(res.data);
                }).catch(
                    function (error) {
                        reject(error);
                    }
                )
            })
        )
    };
}

const updateAssetServiceEvent = (id, formData) => {
    return function (dispatch) {
        return trackPromise(
            new Promise((resolve, reject) => {
                axios(`${BaseURL}/assetservice/${id}`, {
                    method: "PUT",
                    data: formData,
                }).then((res) => {
                    resolve(!res.is_error);
                }).catch(
                    function (error) {
                        reject(error);
                    }
                )
            })
        )
    };
}

const updateAttachments = (formData) => {
    return function (dispatch) {
        return trackPromise(
            new Promise((resolve, reject) => {
                axios(`${BaseURL}/assetservice/attachments`, {
                    method: "PUT",
                    data: formData,
                }).then((res) => {
                    resolve(!res.is_error);
                }).catch(
                    function (error) {
                        reject(error);
                    }
                )
            })
        )
    };
}

const deleteAssetSeviceEvent = (id) => {
    return  function(dispatch) {
       return trackPromise(
           new Promise((resolve, reject) => {
               axios(`${BaseURL}/assetservice/${id}`, {
                   method: "DELETE",
               }).then((res) => {
                   resolve(res.data);
               }).catch(
                   function (error) {
                       reject(error);
                   }
               )
           })
       )
   };
}



export default {
    addAssetServiceEvent,
    getAllServiceEventList,
    deleteAssetSeviceEvent,
    getAssetServiceEventDetails,
    updateAssetServiceEvent,
    updateAttachments
}