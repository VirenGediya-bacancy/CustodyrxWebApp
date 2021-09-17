import {connect} from 'react-redux';
import drugsService from '../service/DrugsService';
import DrugDetailMainTable from '../views/drugs/DrugDetailMainTable';
import { withRouter } from 'react-router';
import ProductServices from "../service/CommonServices";
// To separate the business logic and UI logic

/**
 * Here we mapped drugs information as props to DrugDetailMainTable component
 * @param {*} dispatch 
 * @returns 
 */
 const mapStateToProps = (state) => {
   const { drugs, pageIndex, pageSize, total, rows, currentPage } = state.drugsReducer;
    return {
      drugList: drugs,
      pageIndex,
      pageSize,
      drugs,
      total,
      currentPage,
      rows,
      columns: [{
        width: "auto",
        Header: "Drugs Name",
        Cell: ({ row }) => (
          <div>{row._original.name}</div>
        ),
    },]
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
      changePage : (pageNo) => dispatch(drugsService.changePage(pageNo)),
      changePageSize : (pageSize) => dispatch(drugsService.changePageSize(pageSize))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DrugDetailMainTable));