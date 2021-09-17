import {connect} from 'react-redux';
import disposablesService from 'service/DisposablesService';
import DisposableDetailMainTable from 'views/disposable/DisposableDetailMainTable';
import { withRouter } from 'react-router';
import ProductServices from "../../service/CommonServices";

// To separate the business logic and UI logic

/**
 * Here we mapped disposables information as props to DisposableDetailMainTable component
 * @param {*} dispatch 
 * @returns 
 */
 const mapStateToProps = (state) => {
    const { disposables, pageIndex, pageSize, total, currentPage, rows  } = state.disposablesReducer;
    return {
      disposables,
      pageIndex,
      pageSize,
      total,
      currentPage,
      rows,
      columns: [{
        width: "auto",
        Header: 'Disposables Name',
        Cell: ({ row }) => (
          <div>{row._original.name}</div>),
        accessor: 'title',
    },]
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
      changePage : (pageNo) => dispatch(disposablesService.changeDisposablePage(pageNo)),
      changePageSize : (pageSize) => dispatch(disposablesService.changeDisposablePageSize(pageSize))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DisposableDetailMainTable));