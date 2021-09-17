import {connect} from 'react-redux';
import AssetsService from '../../service/AssetsService';
import AssetDetailOverview from '../../views/assets/AssetDetailOverview';
import ProductServices from 'service/CommonServices';

// To separate the business logic and UI logic

/**
 * Here we mapped drugs item tag information as props to DrugsItemTag component
 * @param {*} dispatch 
 * @returns 
 */
 const mapStateToProps = (state) => {
    return {
        asset: state.assetItemReducer.asset,
    };
};

/**
 * To perform add,get,delete and update action on drugs
 * @param {*} dispatch 
 * @returns 
 */
const mapDispatchToProps = (dispatch) => {
    return {
      getAsset: (asset_id, productType) =>  dispatch(ProductServices.getProductByID(asset_id, productType)), //dispatch(AssetsService.getAsset(asset_id)),
      getAssetItemTagList: (obj) => dispatch(AssetsService.getAssetItemTagList(obj)),
      addAssetItemTag: (assetItemTagObj) => dispatch(AssetsService.addAssetItemTag(assetItemTagObj)),
      editAssetStatus: (id, status) => dispatch(ProductServices.updateProductStatus(id, status)),
      deleteAsset : (id) => dispatch(ProductServices.deleteProduct(id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AssetDetailOverview);