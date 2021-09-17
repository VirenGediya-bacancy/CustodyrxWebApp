import {connect} from 'react-redux';
import DisposableTable from '../../commonComponents/DisposalbleTable';
import ProductServices from '../../service/CommonServices';

// To separate the business logic and UI logic

/**
 * Here we mapped disposables information as props to disposables component
 * @param {*} dispatch 
 * @returns 
 */
 const mapStateToProps = (state) => {
    return {
      disposable: state.disposablesReducer.disposables,
      searchKeyword: state.searchReducer.searchKeyword,
    };
};

/**
 * To perform add,get,delete and update action on disposables
 * @param {*} dispatch 
 * @returns 
 */
const mapDispatchToProps = (dispatch) => {
    return {
      getDisposableList: (obj) => dispatch(ProductServices.getAllProductList(obj)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DisposableTable);