import AssetsContainerTable from 'components/Assets/AssetsTable';
import { connect } from 'react-redux';
import ProductServices from 'service/CommonServices';

const mapStateToProps = (state) => {
    const { assetsList } = state.assetsReducer;
    const { searchKeyword } = state.searchReducer;
    return {
        searchKeyword,
        assetsList
    }   
}

const mapDispatchToProps = (dispatch) => {
    return {
        getAssetsList : (obj) => dispatch(ProductServices.getAllProductList(obj)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AssetsContainerTable)
