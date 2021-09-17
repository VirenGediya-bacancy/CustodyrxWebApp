import {connect} from 'react-redux';
import AssetsService from 'service/AssetsService';
import AssetItemList from '../../views/assets/AssetItemList';

// To separate the business logic and UI logic

/**
 * Here we mapped drug item tag information as props to DrugsItemTag component
 * @param {*} dispatch 
 * @returns 
 */
 const mapStateToProps = (state) => {
    return {
      assetItemTags: state.assetItemTagListReducer.assetItemTags,
    };
};

/**
 * To perform add,get,delete and update action on drugs
 * @param {*} dispatch 
 * @returns 
 */
const mapDispatchToProps = (dispatch) => {
    return {
      getAssetItemTagList: (obj) => dispatch(AssetsService.getAssetItemTagList(obj)),
      updateAssetItemTag: (assetItemTagObj, id) => dispatch(AssetsService.updateAssetItemTag(assetItemTagObj, id)),
      getAssetItemTag: (id) => dispatch(AssetsService.getAssetItemTag(id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AssetItemList);