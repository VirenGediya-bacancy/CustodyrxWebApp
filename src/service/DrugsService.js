import axios from 'axios';
import { getAllCategoryURL, addCategoryURL, editDrugStatusURL,
    deleteDrugURL, editDrugItemStatusURL, deleteDrugItemURL } from 'Constant/ApiRoutes';
import { BaseURL } from 'Constant/BaseURL';
import { trackPromise } from 'react-promise-tracker';

/**
 * To perform network request for the drugs
 */
class DrugsService {
    url = BaseURL;

    getDrugList = (obj) => {
        const { page, rows, field, sortOrder } = obj;
        return function (dispatch) {
            return trackPromise(
                new Promise((resolve, reject) => {
                    axios(`${drugsService.url}/products/all-products`, {
                        method: "POST",
                        data: {
                            productType : "drug",
                            rows : rows,
                            page: page + 1,
                            field: field,
                            sortOrder: sortOrder ? sortOrder : "ASC"
                        },
                    }).then((res) => {
                        dispatch({ type: 'ADD_DRUGS_LIST', payload: res.data })
                        resolve();
                    }).catch(
                        function (error) {
                            dispatch({ type: 'ADD_DRUGS_LIST', payload: [] })
                            reject(error);
                        }
                    )
                })
            )
        };
    }

    changePageSize = (pageSize) => {
        return { type: 'CHANGE_PAGE_SIZE', payload: pageSize }   
    }

    changePage = (pageNumber) => {
        return { type: 'CHANGE_PAGE', payload: pageNumber }   
    }

    updateColumns = (columns) => {
        return {
            type : 'UPDATE_DRUGS_COLUMNS',
            payload : columns
        }
    }

    getFilteredDrugList = (data) => {
        const { page, rows, field, sortOrder, type } = data;
        return function (dispatch) {
            return trackPromise(
                new Promise((resolve, reject) => {
                    axios(`${drugsService.url}/products/filter-status/${type}`, {
                        method: "POST",
                        data: {
                            productType: "drug",
                            rows : rows,
                            page: page + 1,
                            field: field,
                            sortOrder: sortOrder ? sortOrder : "ASC"
                        },
                    }).then((res) => {
                        dispatch({ type: 'ADD_DRUGS_LIST', payload: res.data })
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

    addDrug = (drugObj) => {
        return function (dispatch) {
            return trackPromise(
                new Promise((resolve, reject) => {
                    axios(`${drugsService.url}/products/add-Drug-Product`, {
                        method: "POST",
                        data: drugObj,
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

    updateDrug = (drugObj, id) => {
        return function (dispatch) {
            return trackPromise(
                new Promise((resolve, reject) => {
                    axios(`${drugsService.url}/products/update-product/${id}`, {
                        method: "PUT",
                        data: drugObj,
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

    getDrug = (id) => {
        return function (dispatch) {
            return trackPromise(
                new Promise((resolve, reject) => {
                    axios(`${drugsService.url}/products/get-one/${id}`, {
                        method: "POST",
                    }).then((res) => {
                        dispatch({ type: 'ADD_DRUG_ITEM', payload: res.data });
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

    getDrugItemTagList = (obj) => {
        const { page, rows, field, sortOrder, id } = obj;
        return function (dispatch) {
            return trackPromise(
                new Promise((resolve, reject) => {
                    axios(`${drugsService.url}/items/all-items/${id}`, {
                        method: "POST",
                        data: {
                            productType : "drug",
                            rows : rows,
                            page: page + 1,
                            field: field,
                            sortOrder: sortOrder ? sortOrder : "ASC"
                        },
                    }).then((res) => {
                        dispatch({ type: 'ADD_DRUG_ITEM_TAG_LIST', payload: res.data })
                        resolve(res.data.data);
                    }).catch(
                        function (error) {
                            dispatch({ type: 'ADD_DRUG_ITEM_TAG_LIST', payload: [] })
                            reject(error);
                        }
                    )
                })
            )
        };
    }

    addDrugItemTag = (drugItemTagObj) => {
        return function (dispatch) {
            return trackPromise(
                new Promise((resolve, reject) => {
                    axios(`${drugsService.url}/items/add-drug-item`, {
                        method: "POST",
                        data: drugItemTagObj,
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

    getDrugItemTag = (id) => {
        return function (dispatch) {
            return trackPromise(
                new Promise((resolve, reject) => {
                    axios(`${drugsService.url}/items/one-item/${id}`, {
                        method: "POST",
                    }).then((res) => {
                        dispatch({ type: 'ADD_DRUG_ITEM_TAG', payload: res.data });
                        resolve(res.data);
                    }).catch(
                        function (error) {
                            reject(error);
                        }
                    )
                })
            )
        // }
        };
    }

    updateDrugItemTag = (drugItemTagObj, id) => {
        return function (dispatch) {
            return trackPromise(
                new Promise((resolve, reject) => {
                    axios(`${drugsService.url}/items/update-item/${id}`, {
                        method: "PUT",
                        data: drugItemTagObj,
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

    getAllItemsByLotNumber = (obj) => {
        const { page, rows, field, sortOrder, id, lotNumber } = obj;
        return function (dispatch) {
            return trackPromise(
                new Promise((resolve, reject) => {
                    axios.post(`${drugsService.url}/items/filter-lotNumber`,
                        { 
                            rows: rows,
                            page: page + 1,
                            field: field,
                            sortOrder: sortOrder ? sortOrder : "ASC",
                            productId:  id,//parseInt(this.props.drug_id),
                            lotNumber : lotNumber
                        })
                        .then((res) => { 
                            dispatch({ type: 'ADD_DRUG_ITEM_TAG_LIST', payload: res.data });
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
        const { page, rows, field, productId, sortOrder, from, to } = obj;
        return function (dispatch) {
            return trackPromise(
                new Promise((resolve, reject) => {
                    axios.post(`${drugsService.url}/items/filter-date`,
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
                            dispatch({ type: 'ADD_DRUG_ITEM_TAG_LIST', payload: res.data });
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

    deleteBulkDrugs = (ids) => {
        return function (dispatch) {
            return trackPromise(
                new Promise((resolve, reject) => {
                    axios.delete(`${drugsService.url}/products/bulk-delete-product`, {
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
                    axios.post(`${drugsService.url}/products/product-filter`, { isActive: isActive, ids: ids },
                    ).then((res) => {
                        dispatch({ type: 'ADD_DRUGS_LIST', payload: res.data })
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
                    axios.post(`${drugsService.url}/productCategory/add-productcategory`, { name: category, ids: ids },
                    ).then((res) => {
                        dispatch({ type: 'ADD_DRUGS_LIST', payload: res.data })
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

   getCategory = () => {
        return function(dispatch) {
            return trackPromise(
                new Promise((resolve, reject) => {
                    axios(`${drugsService.url}${getAllCategoryURL}`, {
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

    addCategory = (data) => {
        return function(dispatch) {
            return trackPromise(
                new Promise((resolve, reject) => {
                    axios(`${drugsService.url}${addCategoryURL}`, {
                        method: "POST",
                        data: data
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

    filterProductByCategory = (category,data) => {
        const { page, rows, field, sortOrder, type } = data;
        return function (dispatch) {
            return trackPromise(
                new Promise((resolve, reject) => {
                    axios.post(`${drugsService.url}/products/category-filter/drug`,
                        { 
                            category: category,
                            productType : "drug",
                            rows : rows,
                            page: page + 1,
                            field: field,
                            sortOrder: sortOrder ? sortOrder : "ASC"
                        },
                    ).then((res) => {
                        dispatch({ type: 'ADD_DRUGS_LIST', payload: res.data})
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

    editDrugStatus = (id, status) => {
        return function(dispatch) {
            return trackPromise(
                new Promise((resolve, reject) => {
                    axios(`${drugsService.url}${editDrugStatusURL}${id}`, {
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

    editDrugItemStatus = (id, status) => {
        return function(dispatch) {
            return trackPromise(
                new Promise((resolve, reject) => {
                    axios(`${drugsService.url}${editDrugItemStatusURL}${id}`, {
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

    deleteDrugProduct = (id) => {
        return function(dispatch) {
            return trackPromise(
                new Promise((resolve, reject) => {
                    axios(`${drugsService.url}${deleteDrugURL}${id}`, {
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

    deleteDrugItem = (id) => {
        return function(dispatch) {
            return trackPromise(
                new Promise((resolve, reject) => {
                    axios(`${drugsService.url}${deleteDrugItemURL}${id}`, {
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

    getFilteredItemList = (obj) => {
        const { page, rows, field, sortOrder, type, productId } = obj;
        return function (dispatch) {
            return trackPromise(
                new Promise((resolve, reject) => {
                    axios(`${drugsService.url}/items/list-by-status/${type}`, {
                        method: "POST",
                        data: {
                            productId : productId,
                            rows : rows,
                            page: page + 1,
                            field: field,
                            sortOrder: sortOrder ? sortOrder : "ASC"
                        },
                    }).then((res) => {
                        dispatch({ type: 'ADD_DRUG_ITEM_TAG_LIST', payload: res.data.data })
                        resolve(res.data.data);
                    }).catch(
                        function (error) {
                            dispatch({ type: 'ADD_DRUG_ITEM_TAG_LIST', payload: [] })
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
                    axios.post(`${drugsService.url}/items/items-filter`, { isActive: isActive, ids: ids },
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

    deleteBulkItems = (ids) => {
        return function (dispatch) {
            return trackPromise(
                new Promise((resolve, reject) => {
                    axios.delete(`${drugsService.url}/items/bulk-delete-items`, {
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

const drugsService = new DrugsService();
export default drugsService;