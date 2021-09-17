import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Button, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AllList } from '../../commonComponents/DropDown';
import AssetsService from 'service/AssetsService';
import AssetDetailMainTableContainer from 'container/Assets/AssetDetailMainTableContainer';
import AssetDetailOverviewContainer from 'container/Assets/AssetDetailOverviewContainer';
import AssetItemOverviewContainer from 'container/Assets/AssetItemOverviewContainer';
import ProductServices from "service/CommonServices";

class AssetsDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      selectedItem: '',
      categoryStatus: "Active",
      categoryName: "",
    };
  }

  getAssets = (params = {}) => {
    let { pageIndex, pageSize } = this.props;
    let obj = {
      rows: pageSize,
      page: pageIndex,
      field: "name",
      sortOrder: "ASC",
      productType: "asset",
      ...params
    };
    this.props.getAssetList(obj);
  };

  componentDidMount() {
    this.sync();
    this.props.getAllCategory();
  }

  sync = async (params = {}) => {
    await this.getAssets(params);
    await this.props.getActiveCategory('asset')
  };

  toggleFilter = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };

  handleSelect = async (val) => {
    await this.setState({
      selectedItem: val,
    })
    await this.props.changePage(0);
    val === "All Assets" ? this.getAssets() 
    : (val === '0' || val === '1') ? this.sync({
      isActive : parseInt(val)
    }) :  this.sync({
      isActive : '1',
      category: val
    })

    // this.sync({
    //   isActive : parseInt(val)
    // });
  };

  // handleSelect = async (e, type) => {
  //   const {
  //     getFilteredAssetsList,
  //     filterProductByCategory,
  //     pageIndex,
  //     pageSize,
  //   } = this.props;
  //   const value = e.target.value;
  //   let obj = {
  //     rows: pageSize,
  //     page: pageIndex,
  //     field: "name",
  //     sortOrder: "ASC",
  //     type: parseInt(value),
  //   };
  //   value === "All Assets"
  //     ? this.sync()
  //     : this.sync({
  //       isActive : parseInt(value)
  //     })
  //   this.setState({ categoryStatus: status });
  // };

  render() {
    const { match, location, activeCategories } = this.props;
    const {dropdownOpen,selectedItem, categoryStatus} = this.state;
    let { assetName } = location?.state ? location?.state : "";
    let isAssetItemTagPage = false;
    let asset_id;
    let asset_item_tag_id;
    /**
     * To display main table in all screen,
     * drug_id and drug_item_id is inserted into the URL to switch between the pages
     */
     asset_id = match.params.assetId;
     
    if (match.params.asset_item_id) {
      asset_item_tag_id = match.params.asset_item_id;
    }
    return (
      <Row className="drug-detail-table-actions">
        <Col lg="3 quick-navigation">
          {/* <Col
            lg="12"
            className="drug-detail-table-inner-actions overview_table"
          > */}
          <Row>
            <Col lg="4" md="3" sm="2">
              <AllList 
                  name='Assets'
                  handleSelect={this.handleSelect} 
                  toggleFilter={this.toggleFilter}
                  dropdownOpen={dropdownOpen} 
                  selectedItem={selectedItem}
                  categoryStatus={categoryStatus}
                  list={activeCategories}
              />
            </Col>
            <Col lg="8" md="6" sm="4" className="table-inner-actions">
              <div>
                <Button variant="primary">
                  <Link to="/addAsset"> New </Link>
                </Button>
              </div>
              <div className="sync">
                <a href="#" onClick={this.sync}>
                  <i className="fas fa-sync"></i>
                </a>
              </div>
            </Col>
          </Row>
          <AssetDetailMainTableContainer asset_id={asset_id} />
        </Col>
        {
          match.params.asset_item_id ?
            <Col lg='9' className='drug-item-detail-overview'>
              <AssetItemOverviewContainer assetName={assetName} asset_id={asset_id} asset_item_tag_id={asset_item_tag_id}></AssetItemOverviewContainer>
            </Col>
          :
            <Col lg="9" className="detail-overview">
              <AssetDetailOverviewContainer
                assetName={assetName}
                asset_id={asset_id}
              ></AssetDetailOverviewContainer>
            </Col>
        }
      </Row>
    );
  }
}

const mapStateToProps = (state) => {
  const { assetsList, activeCategories, rows, pageIndex, pageSize } = state.assetsReducer;
  return {
    activeCategories,
    assetsList: assetsList,
    rows,
    pageIndex,
    pageSize,
  };
};

/**
 * To perform add,get,delete and update action on drugs
 * @param {*} dispatch
 * @returns
 */
const mapDispatchToProps = (dispatch) => {
  return {
    getAssetList: (obj) => dispatch(ProductServices.getAllProductList(obj)),
    getActiveCategory : (obj) => dispatch(ProductServices.getActiveCategory(obj)),
    getAllCategory: () => dispatch(ProductServices.getAllCategory()),
    getFilteredAssetsList: (type) => dispatch(AssetsService.getFilteredAssetsList(type)),
    changePage: (pageNo) => dispatch(AssetsService.changeAssetsPage(pageNo)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AssetsDetails);