import {connect} from 'react-redux';
import drugsService from '../service/DrugsService';
import DrugDetailOverview from '../views/drugs/DrugDetailOverview';
import ProductServices from "../service/CommonServices";

// To separate the business logic and UI logic

/**
 * Here we mapped drugs item tag information as props to DrugsItemTag component
 * @param {*} dispatch 
 * @returns 
 */

 const mapStateToProps = (state) => {
    return {
        drug: state.drugItemReducer.drug,
    };
};

/**
 * To perform add,get,delete and update action on drugs
 * @param {*} dispatch 
 * @returns 
 */

const mapDispatchToProps = (dispatch) => {
    return {
      getDrug: (drug_id, productType) => dispatch(ProductServices.getProductByID(drug_id, productType)),
      getDrugItemTagList: (obj) => dispatch(drugsService.getDrugItemTagList(obj)),
      addDrugItemTag: (drugItemTagObj) => dispatch(drugsService.addDrugItemTag(drugItemTagObj)),
      editDrugStatus: (id, status) => dispatch(ProductServices.updateProductStatus(id, status)),
      deleteDrug : (id) => dispatch(ProductServices.deleteProduct(id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DrugDetailOverview);