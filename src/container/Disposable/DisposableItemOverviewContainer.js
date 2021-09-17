import { connect } from "react-redux";
import disposablesService from "service/DisposablesService";
import DisposableItemOverView from "views/disposable/DisposableItemOverview";
import ProductServices from "service/CommonServices";

// To separate the business logic and UI logic

/**
 * Here we mapped disposables item tag information as props to DisposableItemTag component
 * @param {*} dispatch
 * @returns
 */
const mapStateToProps = (state) => {
  return {
    disposableItemTag: state.disposableItemTagReducer.disposableItemTag,
    movementList: state.movementHistoryReducer.movementList,
  };
};

/**
 * To perform add,get,delete and update action on disposable
 * @param {*} dispatch
 * @returns
 */
const mapDispatchToProps = (dispatch) => {
  return {
    getMovementHistory: (obj) =>
      dispatch(ProductServices.getMovementHistory(obj)),
    updateDisposableItemTag: (disposableItemTagObj, id) =>
      dispatch(ProductServices.updateProductItem(disposableItemTagObj, id)), //dispatch(disposablesService.updateDisposableItemTag(disposableItemTagObj, id)),
    getDisposableItemTagList: (obj) =>
      dispatch(disposablesService.getDisposableItemTagList(obj)),
    getDisposableItemTag: (id, productType) =>
      dispatch(ProductServices.getProductItemByID(id, productType)), //dispatch(disposablesService.getDisposableItemTag(id)),
    editDisposableItemStatus: (id, status) =>
      dispatch(ProductServices.updateProductItemStatus(id, status)),
    deleteOneDisposableItem: (id) =>
      dispatch(ProductServices.deleteProductItem(id)),
    getDisposable: (id, productType) =>
      dispatch(ProductServices.getProductByID(id, productType)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DisposableItemOverView);
