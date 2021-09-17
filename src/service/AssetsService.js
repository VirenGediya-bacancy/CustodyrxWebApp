import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { getAllCategoryURL, addCategoryURL, editDrugStatusURL, editDrugItemStatusURL, deleteDrugURL } from 'Constant/ApiRoutes';
import { BaseURL } from "../Constant/BaseURL";
import { deleteDrugItemURL } from "Constant/ApiRoutes";

const addAsset = (assetObj) => {
    return function(dispatch) {
        return trackPromise(
            new Promise((resolve, reject) => {
                axios(`${BaseURL}/products/add-Asset-Product`, {
                    method: "POST",
                    data: assetObj,
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

const updateAsset = (assetObj, id) => {
    return function (dispatch) {
        return trackPromise(
            new Promise((resolve, reject) => {
                axios(`${BaseURL}/products/update-product/${id}`, {
                    method: "PUT",
                    data: assetObj,
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

const updateAssetItemTag = (assetItemTagObj, id) => {
    return function (dispatch) {
        return trackPromise(
            new Promise((resolve, reject) => {
                axios(`${BaseURL}/items/update-item/${id}`, {
                    method: "PUT",
                    data: assetItemTagObj,
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

const changeAssetsPageSize = (pageSize) => {
    return { type: 'CHANGE_ASSETS_PAGE_SIZE', payload: pageSize }   
}

const changeAssetsPage = (pageNumber) => {
    return { type: 'CHANGE_ASSETS_PAGE', payload: pageNumber }   
}

const getAssetItemTagList = (obj) => {
    const { rows, page, field, sortOrder, id } = obj;
    return function (dispatch) {
        return trackPromise(
            new Promise((resolve, reject) => {
                axios(`${BaseURL}/items/all-items/${id}`, {
                    method: "POST",
                    data: {
                        productType : "asset",
                        rows : rows,
                        page: page + 1,
                        field: field,
                        sortOrder: sortOrder ? sortOrder : "ASC"
                    }
                }).then((res) => {
                    dispatch({ type: 'ADD_ASSET_ITEM_TAG_LIST', payload: res.data })
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

const editAssetItemStatus = (id, status) => {
    return function(dispatch) {
        return trackPromise(
            new Promise((resolve, reject) => {
                axios(`${BaseURL}${editDrugItemStatusURL}${id}`, {
                    method: "PUT",
                    data: {
                        'isActive': status
                    }
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

const deleteAssetItem = (id) => {
    return function(dispatch) {
        return trackPromise(
            new Promise((resolve, reject) => {
                axios(`${BaseURL}${deleteDrugURL}${id}`, {
                    method: "DELETE",
                }).then((res) => {
                    return resolve(res.data);
                }).catch(
                    function (error) {
                        reject(error);
                    }
                )
            })
        )
    };
}

const editAssetStatus = (id, status) => {
    return function(dispatch) {
        return trackPromise(
            new Promise((resolve, reject) => {
                axios(`${BaseURL}${editDrugStatusURL}${id}`, {
                    method: "PUT",
                    data: {
                        'isActive': status
                    }
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

const updateAssetsColumns = (columns) => {
    return { type: 'UPDATE_ASSET_COLUMNS', payload: columns }
}

const addAssetItemTag = (assetItemTagObj) => {
    return function (dispatch) {
        return trackPromise(
            new Promise((resolve, reject) => {
                axios(`${BaseURL}/items/add-asset-item`, {
                    method: "POST",
                    data: assetItemTagObj,
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

const addAssetServiceEvent = (formData) => {
    return function (dispatch) {
        return trackPromise(
            new Promise((resolve, reject) => {
                axios(`${BaseURL}/assetservice/add-assetServiceEvent`, {
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
                axios(`${BaseURL}/assetservice/update-assetServiceEvent/${id}`, {
                    method: "PUT",
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


const getOneAssetServiceEvent = (id) => {
    return function (dispatch) {
        return trackPromise(
            new Promise((resolve, reject) => {
                axios(`${BaseURL}/assetservice/one-assetServiceEvent/${id}`, {
                    method: "POST",
                }).then((res) => {
                    dispatch({ type: 'ADD_ASSET_ONE_SERVICE_HISTORY', payload: res.data });
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

const getProductCategory = (ids, category) => {
    return function (dispatch) {
        return trackPromise(
            new Promise((resolve, reject) => {
                axios.post(`${BaseURL}/productCategory/add-productcategory`, { name: category, ids: ids },
                ).then((res) => {
                    dispatch({ type: 'ADD_ASSET_LIST', payload: res.data })
                    resolve();
                }).catch(
                    function (error) {
                        reject(error);
                    }
                )
            })
        )
    };
}

const getAssetsList = (obj) => {
    const { page, rows, field, sortOrder } = obj;
    return  function(dispatch) {
       return trackPromise(
           new Promise((resolve, reject) => {
               axios(`${BaseURL}/products/all-products`, {
                    method: "POST",
                    data: {
                        productType : "asset",
                        rows : rows,
                        page: page + 1,
                        field: field,
                        sortOrder: sortOrder ? sortOrder : "ASC"
                    },
               }).then((res) => {
                   dispatch({ type: 'ADD_ASSET_LIST', payload: res.data })
                   resolve();
               }).catch(
                   function (error) {
                       reject(error);
                   }
               )
           })
       )
   };
}

const deleteOneAssetItem = (id) => {
    return function(dispatch) {
        return trackPromise(
            new Promise((resolve, reject) => {
                axios(`${BaseURL}${deleteDrugItemURL}${id}`, {
                    method: "DELETE",
                }).then((res) => {
                    return resolve(res.data);
                }).catch(
                    function (error) {
                        reject(error);
                    }
                )
            })
        )
    };
}

const getCategory = () => {
    return function(dispatch) {
        return trackPromise(
            new Promise((resolve, reject) => {
                axios(`${BaseURL}${getAllCategoryURL}`, {
                    method: "POST",
                    data: {
                        "productType" : "category"
                    }
                }).then((res) => {
                    dispatch({type : "GET_ALL_CATEGORIES",payload: res.data});
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

const deleteBulkAssets = (ids) => {
    return function (dispatch) {
        return trackPromise(
            new Promise((resolve, reject) => {
                axios.delete(`${BaseURL}/products/bulk-delete-product`, {
                    data: { ids: ids }
                }).then((res) => {
                    resolve();
                }).catch(
                    function (error) {
                        reject(error);
                    }
                )
            })
        )
    };
}

const getAsset = (id) => {
    return function (dispatch) {
        return trackPromise(
            new Promise((resolve, reject) => {
                axios(`${BaseURL}/products/get-one/${id}`, {
                    method: "POST",
                }).then((res) => {
                    dispatch({ type: 'ADD_ASSET_ITEM', payload: res.data });
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

const getAssetItemTag = (id) => {
    return function (dispatch) {
        return trackPromise(
            new Promise((resolve, reject) => {
                axios(`${BaseURL}/items/one-item/${id}`, {
                    method: "POST",
                }).then((res) => {
                    dispatch({ type: 'ADD_ASSET_ITEM_TAG', payload: res.data });
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

const getProductFilter = (ids, isActive) => {
    return function (dispatch) {
        return trackPromise(
            new Promise((resolve, reject) => {
                axios.post(`${BaseURL}/products/product-filter`, { isActive: isActive, ids: ids },
                ).then((res) => {
                    dispatch({ type: 'ADD_ASSET_LIST', payload: res.data })
                    resolve();
                }).catch(
                    function (error) {
                        reject(error);
                    }
                )
            })
        )
    };
}

const filterProductByCategory = (category, data) => {
    const { page, rows, field, sortOrder } = data;
    return function (dispatch) {
        return trackPromise(
            new Promise((resolve, reject) => {
                axios.post(`${BaseURL}/products/category-filter/asset`,
                    { 
                        category: category,
                        productType : "asset",
                        rows : rows,
                        page: page + 1,
                        field: field,
                        sortOrder: sortOrder ? sortOrder : "ASC"
                    },
                ).then((res) => {
                    dispatch({ type: 'ADD_ASSET_LIST', payload: res.data})
                    resolve();
                }).catch(
                    function (error) {
                        reject(error);
                    }
                )
            })
        )
    };
}

const getAllItemsByDate = (obj) => {
    const { page, rows, field, productId, sortOrder, from, to } = obj;
    return function (dispatch) {
        return trackPromise(
            new Promise((resolve, reject) => {
                axios.post(`${BaseURL}/items/filter-date`,
                { 
                    rows: rows,
                    page: page + 1,
                    field: field,
                    productId: productId,
                    sortOrder: sortOrder ? sortOrder : "ASC",
                    from: from,
                    to: to
                })
                    .then((res) => {
                        dispatch({ type: 'ADD_ASSET_ITEM_TAG_LIST', payload: res.data });
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

const getAllServiceEventList = (obj) => {
    const { itemId } = obj;
    return  function(dispatch) {
       return trackPromise(
           new Promise((resolve, reject) => {
               axios(`${BaseURL}/assetservice/all-assetServiceEvent`, {
                   method: "POST",
                   data: {
                       'itemTagId' : itemId
                   },
               }).then((res) => {
                   dispatch({ type: 'ADD_ASSET_SERVICE_HISTORY_LIST', payload: res.data })
                   resolve();
               }).catch(
                   function (error) {
                       reject(error);
                   }
               )
           })
       )
   };
}

const getAllLifeCycleList = (obj) => {
    const { itemTagId } = obj;
    return function (dispatch) {
        return trackPromise(
            new Promise((resolve, reject) => {
                axios(`${BaseURL}/assetlifecycle?itemTagGuid=${itemTagId}`, {
                    method: "GET",
                    }).then((res) => {
                    dispatch({ type: 'ADD_ASSET_LIFE_CYCLE_LIST', payload: res.data })
                    resolve();
                }).catch(
                    function (error) {
                        dispatch({ type: 'ADD_ASSET_LIFE_CYCLE_LIST', payload: [] })
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
               axios(`${BaseURL}/assetservice/delete-assetServiceEvent/${id}`, {
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

const getAllAssetItemsByLotNumber = (obj) => {
    const { page, rows, field, sortOrder, id, lotNumber } = obj;
    return function (dispatch) {
        return trackPromise(
            new Promise((resolve, reject) => {
                axios.post(`${BaseURL}/items/filter-lotNumber`,
                    { 
                        rows: rows,
                        page: page + 1,
                        field: field,
                        sortOrder: sortOrder ? sortOrder : "ASC",
                        productId:  id,
                        lotNumber : lotNumber
                    })
                    .then((res) => {
                        dispatch({ type: 'ADD_ASSET_ITEM_TAG_LIST', payload: res.data });
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

const getFilteredAssetsList = (data) => {
    const { page, rows, field, sortOrder, type } = data;
    return  function(dispatch) {
       return trackPromise(
           new Promise((resolve, reject) => {
               axios(`${BaseURL}/products/filter-status/${type}`, {
                   method: "POST",
                   data: {
                        productType : "asset",
                        rows : rows,
                        page: page + 1,
                        field: field,
                        sortOrder: sortOrder ? sortOrder : "ASC"
                    },
               }).then((res) => {
                   dispatch({ type: 'ADD_ASSET_LIST', payload: res.data })
                   resolve();
               }).catch(
                   function (error) {
                    reject(error);
                }
            )
           })
       )
   };

   
}

const getItemFilter = (ids, isActive) => {
    return function (dispatch) {
        return trackPromise(
            new Promise((resolve, reject) => {
                axios.post(`${BaseURL}/items/items-filter`, { isActive: isActive, ids: ids },
                ).then((res) => {
                    dispatch({ type: 'ADD_DRUG_ITEM_TAG_LIST', payload: res.data })
                    resolve();
                }).catch(
                    function (error) {
                        reject(error);
                    }
                )
            })
        )
    };
}

const deleteBulkItems = (ids) => {
    return function (dispatch) {
        return trackPromise(
            new Promise((resolve, reject) => {
                axios.delete(`${BaseURL}/items/bulk-delete-items`, {
                    data: { ids: ids }
                }).then((res) => {
                    resolve();
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
    addAsset,
    updateAssetsColumns,
    getAssetsList,
    deleteBulkAssets,
    getProductCategory,
    getCategory,
    editAssetStatus,
    getProductFilter,
    updateAsset,
    addAssetItemTag,
    updateAssetServiceEvent,
    deleteAssetItem,
    deleteOneAssetItem,
    addAssetServiceEvent,
    getAllServiceEventList,
    editAssetItemStatus,
    getAllLifeCycleList,
    deleteAssetSeviceEvent,
    getAllAssetItemsByLotNumber,
    getAllItemsByDate,
    updateAssetItemTag,
    getOneAssetServiceEvent,
    getAsset,
    getAssetItemTagList,
    getAssetItemTag,
    getFilteredAssetsList,
    filterProductByCategory,
    changeAssetsPage,
    changeAssetsPageSize,
    getItemFilter,
    deleteBulkItems
}