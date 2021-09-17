import {connect} from 'react-redux';
import AssetsService from '../../service/AssetsService';
import AssetItemOverView from '../../views/assets/AssetItemOverview';
import ProductServices from "../../service/CommonServices";

// To separate the business logic and UI logic

/**
 * Here we mapped drugs item tag information as props to DrugsItemTag component
 * @param {*} dispatch 
 * @returns 
 */
 const mapStateToProps = (state) => {
    return {
        assetItemTag: state.assetItemTagReducer.assetItemTag,
        movementList: state.movementHistoryReducer.movementList,
    };
};

/**
 * To perform add,get,delete and update action on drugs
 * @param {*} dispatch 
 * @returns 
 */
const mapDispatchToProps = (dispatch) => {
    return {
      getMovementHistory: (obj) => dispatch(ProductServices.getMovementHistory(obj)),
      getAssetItemTag: (id, productType) => dispatch(ProductServices.getProductItemByID(id,productType)),
      getAssetItemTagList: (obj) => dispatch(AssetsService.getAssetItemTagList(obj)),
      deleteAssetItem : (id) => dispatch(AssetsService.deleteAssetItem(id)),
      editAssetItemStatus: (id, status) => dispatch(ProductServices.updateProductItemStatus(id, status)),
      deleteOneAssetItem : (id) => dispatch(ProductServices.deleteProductItem(id)),
      getAsset: (drug_id, productType) => dispatch(ProductServices.getProductByID(drug_id, productType)),
      updateAssetItemTag: (assetItemTagObj, id) => dispatch(ProductServices.updateProductItem(assetItemTagObj, id))
      //dispatch(AssetsService.updateAssetItemTag(assetItemTagObj, id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AssetItemOverView);