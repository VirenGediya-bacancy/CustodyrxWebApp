import {connect} from 'react-redux';
import disposablesService from 'service/DisposablesService';
import ProductServices from "service/CommonServices";
import DisposableDetailOverView from 'views/disposable/DisposableDetailOverview';

// To separate the business logic and UI logic

/**
 * Here we mapped disposable item tag information as props to DisposableItemTag component
 * @param {*} dispatch 
 * @returns 
 */
 const mapStateToProps = (state) => {
    return {
        disposable: state.disposableItemReducer.disposable,
    };
};

/**
 * To perform add,get,delete and update action on disposable
 * @param {*} dispatch 
 * @returns 
 */
const mapDispatchToProps = (dispatch) => {
    return {
        getDisposable: (disposable_id, productType) =>  dispatch(ProductServices.getProductByID(disposable_id, productType)),//dispatch(disposablesService.getDisposable(disposable_id)),
        getDisposableItemTagList: (obj) => dispatch(disposablesService.getDisposableItemTagList(obj)),
        addDisposableItemTag: (disposableItemTagObj) => dispatch(disposablesService.addDisposableItemTag(disposableItemTagObj)),
        editDisposableStatus: (id, status) => dispatch(ProductServices.updateProductStatus(id, status)), //dispatch(disposablesService.editDisposableStatus(id, status)),
        deleteDisposable: (id) => dispatch(ProductServices.deleteProduct(id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DisposableDetailOverView);