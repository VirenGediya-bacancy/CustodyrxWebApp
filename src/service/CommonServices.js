import axios from 'axios';
import { BaseURL } from 'Constant/BaseURL';
import { trackPromise } from 'react-promise-tracker';

const getAllProductList = (obj) => {
    const { page, rows, field, sortOrder, productType, isActive, searchKeyword, category } = obj;
    let url = `${BaseURL}/products?page=${page + 1}&rows=${rows}&sortOrder=${sortOrder}&field=${field}&productType=${productType}`;
    url = isActive === 1 || isActive === 0  ? `${url}&isActive=${isActive}` : url;
    url = searchKeyword ? `${url}&searchKeyword=${searchKeyword}` : url;
    url = category ? `${url}&isActive=${isActive}&category=${category}` : url;
    
    return (dispatch) => {
        return trackPromise(
            new Promise((resolve, reject) => {
                axios(url, { method: "GET" }).then((res) => {
                    productType === "drug" &&  dispatch({ type: 'ADD_DRUGS_LIST', payload: res.data.data });
                    productType === "asset" &&  dispatch({ type: 'ADD_ASSET_LIST', payload: res.data.data });
                    productType === "disposable" && dispatch({ type: 'ADD_DISPOSABLES_LIST', payload: res.data.data });
                    resolve(res.data.data.data);
                }).catch((error) => {
                    // dispatch({ type: 'ADD_DRUGS_LIST', payload: [] })
                    productType === "drug" &&  dispatch({ type: 'ADD_DRUGS_LIST', payload: [] });
                    productType === "asset" &&  dispatch({ type: 'ADD_ASSET_LIST', payload: [] });
                    productType === "disposable" && dispatch({ type: 'ADD_DISPOSABLES_LIST', payload: [] });
                    reject(error);
                })
            })
        )
    };
}

const addProduct = (obj, productType) => {
    return function (dispatch) {
        return trackPromise(
            new Promise((resolve, reject) => {
                axios(`${BaseURL}/products/${productType}`, {
                    method: "POST",
                    data: obj,
                }).then((res) => {
                    resolve(res.data);
                }).catch((error) => {
                        reject(error);
                    }
                )
            })
        )
    };
}

const getProductByID = (id, productType) => {
    return function (dispatch) {
        return trackPromise(
            new Promise((resolve, reject) => {
                axios(`${BaseURL}/products/${id}`, {
                    method: "GET",
                }).then((res) => {
                    productType === "drug" && dispatch({ type: 'ADD_DRUG_ITEM', payload: res.data.data });
                    productType === "asset" && dispatch({ type: 'ADD_ASSET_ITEM', payload: res.data.data });
                    productType === "disposable" && dispatch({ type: 'ADD_DISPOSABLE_ITEM', payload: res.data.data });
                    resolve(res.data.data);
                }).catch((error) => {
                    reject(error);
                })
            })
        )
    };
}

const getProductItems = (obj) => {
    const { page, rows, field, sortOrder, id, productType, lotNumber, from, to, location } = obj;
    let url = `${BaseURL}/items?productGuid=${id}&sortOrder=${sortOrder}&page=${page + 1}&rows=${rows}&field=${field}`;
    url = lotNumber ? `${url}&lotNumber=${lotNumber}` : url;
    url = location ? `${url}&location=${location}` : url;
    url = from && to ? `${url}&from=${from}&to=${to}` : url;

    return function (dispatch) {
        return trackPromise(
            new Promise((resolve, reject) => {
                axios(url, {
                    method: "GET",
                }).then((res) => {
                    productType === "drug" && dispatch({ type: 'ADD_DRUG_ITEM_TAG_LIST', payload: res.data.data });
                    productType === "asset" && dispatch({ type: 'ADD_ASSET_ITEM_TAG_LIST', payload: res.data.data });
                    productType === "disposable" && dispatch({ type: 'ADD_DISPOSABLE_ITEM_TAG_LIST', payload: res.data.data });
                    resolve(res.data.data.data);
                }).catch(
                    function (error) {
                        productType === "drug" && dispatch({ type: 'ADD_DRUG_ITEM_TAG_LIST', payload: [] });
                        productType === "asset" && dispatch({ type: 'ADD_ASSET_ITEM_TAG_LIST', payload: [] });
                        productType === "disposable" && dispatch({ type: 'ADD_DISPOSABLE_ITEM_TAG_LIST', payload: [] });
                        reject(error);
                    }
                )
            })
        )
    };
}

const addProductItemTag = (obj, productType) => {
    return function (dispatch) {
        return trackPromise(
            new Promise((resolve, reject) => {
                axios(`${BaseURL}/items/${productType}`, {
                    method: "POST",
                    data: obj,
                }).then((res) => {
                     resolve(res.data);
                })
                .catch(
                    function (error) {
                        reject(error);
                    }
                )
            })
        )
    };
}


const updateProduct = (obj, id) => {
    return function (dispatch) {
        return trackPromise(
            new Promise((resolve, reject) => {
                axios(`${BaseURL}/products/${id}`, {
                    method: "PUT",
                    data: obj,
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

const updateProductStatus = (ids, status) => {
    return function(dispatch) {
        let url = status ? `/products/bulk-mark-active` : `/products/bulk-mark-inactive`;
        return trackPromise(
            new Promise((resolve, reject) => {
                axios(`${BaseURL}${url}`, {
                    method: "PUT",
                    data: {
                        'GUIDS': ids
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

const deleteProduct = (id) => {
    return function(dispatch) {
        return trackPromise(
            new Promise((resolve, reject) => {
                axios(`${BaseURL}/products/${id}`, {
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

const deleteBulkProducts = (ids) => {
    return function(dispatch) {
        return trackPromise(
            new Promise((resolve, reject) => {
                axios(`${BaseURL}/products/bulk-delete-product`, {
                    method: "DELETE",
                    data : { GUIDS : ids}
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

const getProductItemByID = (id, productType) => {
    return function (dispatch) {
        return trackPromise(
            new Promise((resolve, reject) => {
                axios(`${BaseURL}/items/${id}`, {
                    method: "GET",
                }).then((res) => {
                    productType === "drug" && dispatch({ type: 'ADD_DRUG_ITEM_TAG', payload: res.data.data });
                    productType === "asset" && dispatch({ type: 'ADD_ASSET_ITEM_TAG', payload: res.data.data });
                    productType === "disposable" && dispatch({ type: 'ADD_DISPOSABLE_ITEM_TAG', payload: res.data.data });
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

const updateProductItem = (drugItemTagObj, id) => {
    return function (dispatch) {
        return trackPromise(
            new Promise((resolve, reject) => {
                axios(`${BaseURL}/items/${id}`, {
                    method: "PUT",
                    data: drugItemTagObj,
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

const updateProductItemStatus = (ids, status) => {
    return function(dispatch) {
        let url = status ? `/items/bulk-mark-active` : `/items/bulk-mark-inactive`;
        return trackPromise(
            new Promise((resolve, reject) => {
                axios(`${BaseURL}${url}`, {
                    method: "PUT",
                    data: {
                        'GUIDS': ids
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

const getActiveCategory = (productType) => {
    let url = `${BaseURL}/productCategory/active-categories?&isActive=1&productType=${productType}`;

    return (dispatch) => {
        return trackPromise(
            new Promise((resolve, reject) => {
                axios(url, { method: "GET" }).then((res) => {
                    productType === "drug" &&  dispatch({ type: 'GET_DRUG_ACTIVE_CATEGORIES', payload: res.data.data });
                    productType === "asset" &&  dispatch({ type: 'GET_ASSET_ACTIVE_CATEGORIES', payload: res.data.data });
                    productType === "disposable" && dispatch({ type: 'GET_DISPOSABLE_ACTIVE_CATEGORIES', payload: res.data.data });
                    resolve(res.data.data.data);
                }).catch((error) => {
                    productType === "drug" &&  dispatch({ type: 'GET_DRUG_ACTIVE_CATEGORIES', payload: [] });
                    productType === "asset" &&  dispatch({ type: 'GET_ASSET_ACTIVE_CATEGORIES', payload: [] });
                    productType === "disposable" && dispatch({ type: 'GET_DISPOSABLE_ACTIVE_CATEGORIES', payload: [] });
                    reject(error);
                })
            })
        )
    };
}

const deleteProductItem = (id) => {
    return function(dispatch) {
        return trackPromise(
            new Promise((resolve, reject) => {
                axios(`${BaseURL}/items/${id}`, {
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

const deleteBulkProductItems = (ids) => {
    return function(dispatch) {
        return trackPromise(
            new Promise((resolve, reject) => {
                axios(`${BaseURL}/items/bulk-delete-items`, {
                    method: "DELETE",
                    data : { GUIDS : ids}
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

const getAllCategory = () => {
    return function(dispatch) {
        return trackPromise(
            new Promise((resolve, reject) => {
                axios(`${BaseURL}/productCategory/`, {
                    method: "GET",
                }).then((res) => {
                    dispatch({type : "GET_ALL_CATEGORIES",payload: res.data.data});
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

const addProductCategory = (obj, productType) => {
    let { name, GUIDS, description } = obj;
    return function (dispatch) {
        return trackPromise(
            new Promise((resolve, reject) => {
                axios.post(`${BaseURL}/productCategory/bulk`, { name, GUIDS, description },
                ).then((res) => {
                    resolve(res.data)
                }).catch(
                    function (error) {
                        reject(error);
                    }
                )
            })
        )
    };
}

const getAllLotNumber = (id) => {
    return function(dispatch) {
        return trackPromise(
            new Promise((resolve, reject) => {
                axios(`${BaseURL}/items/lotNumber-list?productGuid=${id}`, {
                    method: "GET",
                }).then((res) => {
                    dispatch({type : "GET_ALL_LOT_NUMBERS",payload: res.data.data});
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

const getAllLocations = (id) => {
    return function(dispatch) {
        return trackPromise(
            new Promise((resolve, reject) => {
                axios(`${BaseURL}/items/location-list?productGuid=${id}`, {
                    method: "GET",
                }).then((res) => {
                    dispatch({type : "GET_ALL_LOCATIONS",payload: res.data.data});
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

const getMovementHistory = (obj) => {
    const { page, rows, GUID, sortOrder, field } = obj;
    return (dispatch) => {
      return trackPromise(
          new Promise((resolve, reject) => {
           axios(`${BaseURL}/movements?sortOrder=${sortOrder}&page=${page}&field=${field}&rows=${rows}&itemTagGuid=${GUID}`, { method: "GET" })
            .then((res) => {
              dispatch({ type: "GET_ALL_MOVEMENT_LIST", payload: res.data.data });
              resolve(res.data.data);
            })
            .catch((error) => {
              dispatch({ type: "GET_ALL_MOVEMENT_LIST", payload: [] });
              reject(error);
            });
        })
      );
    };
  };

export default {
    getAllProductList,
    addProduct,
    getProductByID,
    getActiveCategory,
    getProductItems,
    addProductItemTag,
    updateProduct,
    updateProductStatus,
    deleteProduct,
    deleteBulkProducts,
    getProductItemByID,
    updateProductItem,
    updateProductItemStatus,
    deleteProductItem,
    deleteBulkProductItems,
    getAllCategory,
    addProductCategory,
    getAllLotNumber,
    getAllLocations,
    getMovementHistory
}