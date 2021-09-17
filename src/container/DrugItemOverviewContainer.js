import {connect} from 'react-redux';
import drugsService from '../service/DrugsService';
import DrugItemOverview from '../views/drugs/DrugItemOverview';
import ProductServices from "../service/CommonServices";

// To separate the business logic and UI logic

/**
 * Here we mapped drugs item tag information as props to DrugsItemTag component
 * @param {*} dispatch 
 * @returns 
 */
 const mapStateToProps = (state) => {
    return {
        drugItemTag: state.drugItemTagReducer.drugItemTag,
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
      getDrugItemTag: (id, productType) => dispatch(ProductServices.getProductItemByID(id,productType)),
      getDrugItemTagList: (obj) => dispatch(drugsService.getDrugItemTagList(obj)),
      updateDrugItemTag: (drugItemTagObj, id) => dispatch(ProductServices.updateProductItem(drugItemTagObj, id)),//dispatch(drugsService.updateDrugItemTag(drugItemTagObj, id)),
      editDrugItemStatus: (id, status) => dispatch(ProductServices.updateProductItemStatus(id, status)),
      deleteDrugItem : (id) => dispatch(ProductServices.deleteProductItem(id)),
      getDrug: (drug_id, productType) => dispatch(ProductServices.getProductByID(drug_id, productType))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DrugItemOverview);