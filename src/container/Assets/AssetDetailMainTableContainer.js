import {connect} from 'react-redux';
import AssetsService from '../../service/AssetsService';
import ProductServices from "../../service/CommonServices";
import AssetDetailMainTable from '../../views/assets/AssetDetailMainTable';
import { withRouter } from 'react-router';
// To separate the business logic and UI logic

/**
 * Here we mapped drugs information as props to DrugDetailMainTable component
 * @param {*} dispatch 
 * @returns 
 */
 const mapStateToProps = (state) => {
  const { assetsList, pageIndex, pageSize,rows,total, currentPage } = state.assetsReducer;
    return {
      assetList: assetsList,
      pageIndex,
      pageSize,
      total,
      currentPage,
      rows,
      columns: [{
        width: "auto",
        // Header: 'Assets',
        Header: "Assets Name",
        Cell: ({ row }) => (
          <div>{row._original.name}</div>
        ),
        accessor: 'title',
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
      getAssetsList: (obj) => dispatch(ProductServices.getAllProductList(obj)),
      changePage : (pageNo) => dispatch(AssetsService.changeAssetsPage(pageNo)),
      changePageSize : (pageSize) => dispatch(AssetsService.changeAssetsPageSize(pageSize)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AssetDetailMainTable));