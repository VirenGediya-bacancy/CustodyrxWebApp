import DisposableDetailMainTableContainer from "../../container/Disposable/DisposableDetailMainTableContainer";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
import DisposableDetailOverviewContainer from "container/Disposable/DisposableDetailOverviewContainer";
import DisposableItemOverviewContainer from "container/Disposable/DisposableItemOverviewContainer";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import disposablesService from "service/DisposablesService";
import ProductServices from "service/CommonServices";
import { AllList } from "commonComponents/DropDown";

class DisposableDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      selectedItem: '',
      categoryStatus: "Active",
      categoryName: "",
    }
  }

  getDisposables = (params = {}) => {
    let { pageIndex, pageSize } = this.props;
    let obj = {
      rows: pageSize,
      page: pageIndex,
      field: "name",
      sortOrder: "ASC",
      productType: "disposable",
      ...params,
    };
    this.props.getDisposableList(obj);
  };

  componentDidMount() {
    this.sync();
    this.props.getAllCategory();
  }

  sync = async (params = {}) => {
    await this.getDisposables(params);
    await this.props.getActiveCategory('disposable')
  }

  toggleFilter = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };

  handleSelect = async (val) => {
    await this.setState({
      selectedItem: val,
    })

    await this.props.changePage(0);
    val === "All Disposables" ? this.getDisposables() 
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

  render() {
    const { match, location, activeCategories } = this.props;
    const {dropdownOpen, selectedItem, categoryStatus} = this.state;
    const { disposableName } = location?.state ? location?.state : '' ;
    let isDisposableItemTagPage = false;
    let disposable_id;
    let disposable_item_tag_id;

    /**
     * To display main table in all screen,
     * disposable_id and disposable_item_id is inserted into the URL to switch between the pages
     */
    disposable_id = match.params.disposable_id;

    if (match.params.disposable_item_id) {
      disposable_item_tag_id = match.params.disposable_item_id;
    }
    return (
      <div>
        <Row className="drug-detail-table-actions">
          <Col lg="3 quick-navigation">
            <Row>
              <Col lg="8" md="6" sm="4">
                <AllList
                  name="Disposables"
                  handleSelect={this.handleSelect}
                  dropdownOpen={dropdownOpen}
                  toggleFilter={this.toggleFilter}
                  selectedItem={selectedItem}
                  categoryStatus={categoryStatus}
                  list={activeCategories}
                />
              </Col>
              <Col lg="4" md="3" sm="2" className="table-inner-actions">
                <div>
                  <Button variant="primary">
                    <Link to="/addDisposable"> New </Link>
                  </Button>
                </div>
                <div className="sync">
                  <a href="#" onClick={this.sync}>
                    <i className="fas fa-sync"></i>
                  </a>
                </div>
              </Col>
            </Row>
            <DisposableDetailMainTableContainer disposable_id={disposable_id} />
          </Col>
          {disposable_item_tag_id ? (
            <Col lg="9" className="drug-item-detail-overview">
              <DisposableItemOverviewContainer
                disposableName={disposableName}
                disposable_item_tag_id={disposable_item_tag_id}
                disposable_id={disposable_id}
              ></DisposableItemOverviewContainer>
            </Col>
          ) : (
            <Col lg="9" className="detail-overview">
              <DisposableDetailOverviewContainer
                disposableName={disposableName}
                disposable_id={disposable_id}
              ></DisposableDetailOverviewContainer>
            </Col>
          )}
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { disposables, rows, pageIndex, pageSize, activeCategories } = state.disposablesReducer;
  return {
    disposables,
    activeCategories,
    rows,
    pageIndex,
    pageSize,
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
    getFilteredDisposableList: (type) => dispatch(disposablesService.getFilteredDisposableList(type)),
    changePage : (pageNo) => dispatch(disposablesService.changeDisposablePage(pageNo)),
    getActiveCategory : (obj) => dispatch(ProductServices.getActiveCategory(obj)),
    getAllCategory: () => dispatch(ProductServices.getAllCategory()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DisposableDetail);
