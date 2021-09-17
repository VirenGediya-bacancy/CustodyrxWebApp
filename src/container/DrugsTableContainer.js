import {connect} from 'react-redux';
import ProductServices from '../service/CommonServices';
import Table from '../commonComponents/Table'; 

// To separate the business logic and UI logic

/**
 * Here we mapped drugs information as props to drugs component
 * @param {*} dispatch 
 * @returns 
 */
 const mapStateToProps = (state) => {
    return {
      drugs: state.drugsReducer.drugs,
      searchKeyword: state.searchReducer.searchKeyword,
    };
};

/**
 * To perform add,get,delete and update action on drugs
 * @param {*} dispatch 
 * @returns 
 */
const mapDispatchToProps = (dispatch) => {
    return {
      getDrugList: (obj) => dispatch(ProductServices.getAllProductList(obj)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Table);