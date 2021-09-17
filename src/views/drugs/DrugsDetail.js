import DrugDetailMainTableContainer from "../../container/DrugDetailMainTableContainer";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
import DrugDetailOverViewContainer from "../../container/DrugDetailOverviewContainer";
import DrugItemOverviewContainer from "../../container/DrugItemOverviewContainer";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import drugsService from "../../service/DrugsService";
import ProductServices from "../../service/CommonServices";
import { AllList } from '../../commonComponents/DropDown';


class DrugDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      selectedItem : '',
      categoryStatus: "Active",
    };
  }

  getDrugs = (params = {}) => {
    const { pageSize, pageIndex } = this.props;
    let obj = {
      rows: pageSize,
      page: pageIndex,
      field: "name",
      sortOrder: "ASC",
      productType: "drug",
      ...params
    };
    this.props.getDrugList(obj);
  };

  componentDidMount() {
    this.sync();
    this.props.getAllCategory();
  }

  sync = async (params = {}) => {
    await this.getDrugs(params);
    await this.props.getActiveCategory('drug')
  };

  toggleFilter = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };

  handleSelect = async (val) => {
    await this.setState({
      selectedItem: val,
    })
    await this.props.changePage(0);
    val === "All Drugs" ? this.getDrugs() 
    : 
    // this.sync({
    //   isActive : parseInt(val)
    // });
    (val === '0' || val === '1') ? this.sync({
      isActive : parseInt(val)
    }) :  this.sync({
      isActive : '1',
      category: val
    })
  };

  render() {
    const { match, location, activeCategories } = this.props;
    const {dropdownOpen, selectedItem, categoryStatus} = this.state;
    let isDrugItemTagPage = false;
    let drug_id;
    let drug_item_tag_id;
    let { drugName } = location?.state ? location?.state : "";
    /**
     * To display main table in all screen,
     * drug_id and drug_item_id is inserted into the URL to switch between the pages
     */
     drug_id = match.params.drug_id;
    if (match.params.drug_item_id) {
      drug_item_tag_id = match.params.drug_item_id;
    }
    return (
      <div>
        <Row className="drug-detail-table-actions">
          <Col lg="3 quick-navigation">
            {/* <Col
              lg="12"
              className="drug-detail-table-inner-actions overview_table"
            > */}
            <Row>
              <Col lg="4" md="3" sm="2">
              <AllList
                toggleFilter={this.toggleFilter}
                dropdownOpen={dropdownOpen}
                handleSelect={this.handleSelect}
                name={"Drugs"}
                selectedItem={selectedItem}
                categoryStatus={categoryStatus}
                list={activeCategories}
              />
              </Col>
              <Col lg="8" md="6" sm="4" className="table-inner-actions">
                <div>
                  <Button variant="primary">
                    <Link to="/addDrug"> New </Link>
                  </Button>
                </div>
                <div className="sync">
                  <a href="#" onClick={this.sync}>
                    <i className="fas fa-sync"></i>
                  </a>
                </div>
              {/* </div> */}
            </Col>
            </Row>
            <DrugDetailMainTableContainer
              drug_id={drug_id}
            ></DrugDetailMainTableContainer>
          </Col>

          {
            match.params.drug_item_id ?
              <Col lg='9' className='drug-item-detail-overview'>
                <DrugItemOverviewContainer 
                  drugName={drugName} 
                  drug_id={drug_id} 
                  drug_item_tag_id={drug_item_tag_id} />
              </Col>
            :
              <Col lg="9" className="detail-overview">
                <DrugDetailOverViewContainer
                  drugName={drugName}
                  drug_id={drug_id}
                />
              </Col>
          }
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { drugs, activeCategories, rows, pageIndex, pageSize } = state.drugsReducer;
  return {
    activeCategories,
    drugs: drugs,
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
    getDrugList: (obj) => dispatch(ProductServices.getAllProductList(obj)),
    getActiveCategory : (obj) => dispatch(ProductServices.getActiveCategory(obj)),
    getFilteredDrugList: (type) =>
      dispatch(drugsService.getFilteredDrugList(type)),
    getAllCategory: () => dispatch(ProductServices.getAllCategory()),
    changePage: (pageNo) => dispatch(drugsService.changePage(pageNo)),
    // allProductCategory: () => dispatch(drugsService.allProductCategory()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DrugDetail);
