import axios from 'axios';
import { getAllCategoryURL, editDrugItemStatusURL, addCategoryURL, deleteDrugItemURL, editDrugStatusURL, deleteDrugURL } from 'Constant/ApiRoutes';
import { BaseURL } from 'Constant/BaseURL';
import { trackPromise } from 'react-promise-tracker';

/**
 * To perform network request for the disposables
 */
class DisposablesService {
    url = BaseURL;

    getDisposableList = (obj) => {
        const { rows, page, field, sortOrder } = obj;
        return  function(dispatch) {
            return trackPromise(
                new Promise((resolve, reject) => {
                    axios(`${disposablesService.url}/products/all-products`, {
                        method: "POST",
                        data: {
                            productType : "disposable",
                            rows : rows,
                            page: page + 1,
                            field: field,
                            sortOrder: sortOrder ? sortOrder : "ASC"
                        },
                    }).then((res) => { 
                        dispatch({ type: 'ADD_DISPOSABLES_LIST', payload: res.data })
                        resolve();
                    }).catch(
                        function (error) {
                            dispatch({ type: 'ADD_DISPOSABLES_LIST', payload: [] })
                            reject(error);
                        }
                    )
                })
            )
        };
    }

    changeDisposablePageSize = (pageSize) => {
        return { type: 'CHANGE_DISPOSABLE_PAGE_SIZE', payload: pageSize }   
    }

    changeDisposablePage = (pageNumber) => {
        return { type: 'CHANGE_DISPOSABLE_PAGE', payload: pageNumber }   
    }

    updateDisposableColumns = (columns) => {
        return { 
            type: 'UPDATE_DISPOSABLE_COLUMNS', 
            payload: columns
        }
        
    }

    getFilteredDisposableList = (data) => {
        const { page, rows, field, sortOrder, type } = data;
        return function (dispatch) {
           return trackPromise(
               new Promise((resolve, reject) => {
                   axios(`${disposablesService.url}/products/filter-status/${type}`, {
                       method: "POST",
                       data: {
                            productType : "disposable",
                            rows : rows,
                            page: page + 1,
                            field: field,
                            sortOrder: sortOrder ? sortOrder : "ASC"
                        },
                   }).then((res) => { 
                       dispatch({ type: 'ADD_DISPOSABLES_LIST', payload: res.data })
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

    addDisposable = (disposableObj) => {
        return function(dispatch) {
            return trackPromise(
                new Promise((resolve, reject) => {
                    axios(`${disposablesService.url}/products/add-Disposable-Product`, {
                        method: "POST",
                        data: disposableObj
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

    updateDisposable = (disposableObj, id) => {
        return function(dispatch) {
            return trackPromise(
                new Promise((resolve, reject) => {
                    axios(`${disposablesService.url}/products/update-product/${id}`, {
                        method: "PUT",
                        data: disposableObj,
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

    getDisposable = (id) => {
        return function(dispatch) {
            return trackPromise(
                new Promise((resolve, reject) => {
                    axios(`${disposablesService.url}/products/get-one/${id}`, {
                        method: "POST",
                    }).then((res) => { 
                        dispatch({ type: 'ADD_DISPOSABLE_ITEM', payload: res.data });
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

    getDisposableItemTagList = (obj) => {
        const { rows, page, field, sortOrder, id } = obj;
        return function (dispatch) {
            return trackPromise(
                new Promise((resolve, reject) => {
                    axios(`${disposablesService.url}/items/all-items/${id}`, {
                        method: "POST",
                        data: {
                            rows : rows,
                            page: page + 1,
                            field: field,
                            sortOrder: sortOrder ? sortOrder : "ASC"
                        },
                    }).then((res) => {
                        dispatch({ type: 'ADD_DISPOSABLE_ITEM_TAG_LIST', payload: res.data })
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

    addDisposableItemTag = (disposableItemTagObj) => {
        return function (dispatch) {
            return trackPromise(
                new Promise((resolve, reject) => {
                    axios(`${disposablesService.url}/items/add-disposable-item`, {
                        method: "POST",
                        data: disposableItemTagObj,
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

    getDisposableItemTag  = (id) => {
        return function(dispatch) {
            return trackPromise(
                new Promise((resolve, reject) => {
                    axios(`${disposablesService.url}/items/one-item/${id}`, {
                        method: "POST",
                    }).then((res) => { 
                        dispatch({ type: 'ADD_DISPOSABLE_ITEM_TAG', payload: res.data });
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

    updateDisposableItemTag = (disposableItemTagObj, id) => {
        return function(dispatch) {
            return trackPromise(
                new Promise((resolve, reject) => {
                    axios(`${disposablesService.url}/items/update-item/${id}`, {
                        method: "PUT",
                        data: disposableItemTagObj,
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

    getCategory = () => {
        return function (dispatch) {
            return trackPromise(
                new Promise((resolve, reject) => {
                    axios(`${disposablesService.url}${getAllCategoryURL}`, {
                        method: "POST",
                        data: {
                            "productType": "disposable"
                        }
                    }).then((res) => {
                        dispatch({ type: "GET_ALL_CATEGORIES", payload: res.data });
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

    addCategory = (data) => {
        return function (dispatch) {
            return trackPromise(
                new Promise((resolve, reject) => {
                    axios(`${disposablesService.url}${addCategoryURL}`, {
                        method: "POST",
                        data: data
                    }).then((res) => {
                        dispatch({ type: "GET_ALL_CATEGORIES", payload: res.data });
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

    deleteBulkDisposable = (ids) => {
        return function (dispatch) {
            return trackPromise(
                new Promise((resolve, reject) => {
                    axios.delete(`${disposablesService.url}/products/bulk-delete-product`, {
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

    getProductFilter = (ids, isActive) => {
        return function (dispatch) {
            return trackPromise(
                new Promise((resolve, reject) => {
                    axios.post(`${disposablesService.url}/products/product-filter`, { isActive: isActive, ids: ids },
                    ).then((res) => {
                        dispatch({ type: 'ADD_DISPOSABLES_LIST', payload: res.data })
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

    getProductCategory = (ids, category) => {
        return function (dispatch) {
            return trackPromise(
                new Promise((resolve, reject) => {
                    axios.post(`${disposablesService.url}/productCategory/add-productcategory`, { name: category, ids: ids },
                    ).then((res) => {
                        dispatch({ type: 'ADD_DISPOSABLES_LIST', payload: res.data })
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

    editDisposableStatus = (id, status) => {
        return function (dispatch) {
            return trackPromise(
                new Promise((resolve, reject) => {
                    axios(`${disposablesService.url}${editDrugStatusURL}${id}`, {
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

    deleteDisposableItem = (id) => {
        return function (dispatch) {
            return trackPromise(
                new Promise((resolve, reject) => {
                    axios(`${disposablesService.url}${deleteDrugURL}${id}`, {
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

    filterProductByCategory = (category, data) => {
        const { page, rows, field, sortOrder, type } = data;
        return function (dispatch) {
            return trackPromise(
                new Promise((resolve, reject) => {
                    axios.post(`${disposablesService.url}/products/category-filter`,
                        { 
                            category: category,
                            productType : "disposable",
                            rows : rows,
                            page: page + 1,
                            field: field,
                            sortOrder: sortOrder ? sortOrder : "ASC"
                        },
                    ).then((res) => {
                        dispatch({ type: 'ADD_DISPOSABLES_LIST', payload: res.data })
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

    getAllItemsByLotNumber = (obj) => {
        const { page, rows, field, sortOrder, id, lotNumber } = obj;
        return function (dispatch) {
            return trackPromise(
                new Promise((resolve, reject) => {
                    axios.post(`${disposablesService.url}/items/filter-lotNumber`,
                        { 

                            rows: rows,
                            page: page + 1,
                            field: field,
                            sortOrder: sortOrder ? sortOrder : "ASC",
                            productId:  id,
                            lotNumber : lotNumber
                        })
                        .then((res) => {
                            dispatch({ type: 'ADD_DISPOSABLE_ITEM_TAG_LIST', payload: res.data });
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

    deleteOneDisposableItem = (id) => {
        return function(dispatch) {
            return trackPromise(
                new Promise((resolve, reject) => {
                    axios(`${disposablesService.url}${deleteDrugItemURL}${id}`, {
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

    editDisposableItemStatus = (id, status) => {
        return function(dispatch) {
            return trackPromise(
                new Promise((resolve, reject) => {
                    axios(`${disposablesService.url}${editDrugItemStatusURL}${id}`, {
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

    getAllItemsByDate = (obj) => {
        const { page, rows, field, sortOrder, productId, from, to } = obj;
        return function (dispatch) {
            return trackPromise(
                new Promise((resolve, reject) => {
                    axios.post(`${ disposablesService.url }/items/filter-date`,
                    { 
                        rows: rows,
                        page: page + 1,
                        field: field,
                        sortOrder: sortOrder ? sortOrder : "ASC",
                        productId: productId,
                        from: from,
                        to: to
                    })
                        .then((res) => {
                            dispatch({ type: 'ADD_DISPOSABLE_ITEM_TAG_LIST', payload: res.data });
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

    getItemFilter = (ids, isActive) => {
        return function (dispatch) {
            return trackPromise(
                new Promise((resolve, reject) => {
                    axios.post(`${disposablesService.url}/items/items-filter`, { isActive: isActive, ids: ids },
                    ).then((res) => {
                        dispatch({ type: 'ADD_DISPOSABLE_ITEM_TAG_LIST', payload: res.data })
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

    deleteBulkItems = (ids) => {
        return function (dispatch) {
            return trackPromise(
                new Promise((resolve, reject) => {
                    axios.delete(`${disposablesService.url}/items/bulk-delete-items`, {
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

}

const disposablesService = new DisposablesService();
export default disposablesService