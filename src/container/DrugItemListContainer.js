import {connect} from 'react-redux';
import drugsService from '../service/DrugsService';
import ProductServices from '../service/CommonServices';
import DrugItemList from '../views/drugs/DrugItemList';

// To separate the business logic and UI logic

/**
 * Here we mapped drug item tag information as props to DrugsItemTag component
 * @param {*} dispatch 
 * @returns 
 */
 const mapStateToProps = (state) => {
    return {
      drugItemTags: state.drugItemTagListReducer.drugItemTags,
    };
};

/**
 * To perform add,get,delete and update action on drugs
 * @param {*} dispatch 
 * @returns 
 */
const mapDispatchToProps = (dispatch) => {
    return {
      getDrugItemTagList: (obj) => dispatch(drugsService.getDrugItemTagList(obj)),
      updateDrugItemTag: (drugItemTagObj, id) => dispatch(drugsService.updateDrugItemTag(drugItemTagObj, id)),
      getDrugItemTag: (id, productType) => dispatch(ProductServices.getProductItemByID(id,productType)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DrugItemList);