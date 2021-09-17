import DrugsTableContainer from "../../container/DrugsTableContainer";
import React from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import ModalDialog from "../../commonComponents/ModalDialog";
import { Link } from "react-router-dom";
import { AllList } from "../../commonComponents/DropDown";
import { BulkAction } from "../../commonComponents/ItemDropDown";
import { connect } from "react-redux";
import ProductServices from "../../service/CommonServices";
import drugsService from "../../service/DrugsService";
import AssetsColumnSelector from "commonComponents/AssetsColumnSelector";
import { DrugsColumns } from "Constant/Column";
import Multiselect from "multiselect-react-dropdown";

class Drugs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      isMultiSelected: false,
      selectedFilter: "",
      columnModal: false,
      name: "",
      selectedIds: [],
      selectedItem: '',
      categoryStatus: "Active",
      categoryName: "",
      categoryList: [],
      isMatched: false,
      dropdownOpen: false,
      bulkActionOpen: false,
      description : "",
      isDescription: false
    };
    if (localStorage.getItem("drugsColumns")) {
      localStorage.getItem("drugsColumns")
    } else {
      localStorage.setItem("drugsColumns", JSON.stringify(DrugsColumns));
    }
  }

  toggleFilter = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };

  toggleBulk = () => {
    this.setState({ bulkActionOpen: !this.state.bulkActionOpen });
  };

  /**
   * Perform network request to get drugs list data
   */
  componentDidMount() {
    this.sync();
    this.props.getAllCategory();
  }

  /**
   * handle sync action to get latest data from server
   */
  sync = async (params = {}) => {
    const { pageSize, pageIndex } = this.props;
    let obj = {
      rows: pageSize,
      page: pageIndex,
      field: "name",
      sortOrder: "ASC",
      productType: "drug",
      ...params
    };
    
    await this.props.getDrugList(obj);
    await this.props.getActiveCategory('drug') //.then(this.setState({categoryStatus: 'Active'}))
  };

  /**
 * Toggle add category modal
 */
  toggleModal = (e) => {
    this.setState({ show: !this.state.show });
  };

  handleSubmit = async (e) => {
    const { getProductCategory } = this.props;
    const { selectedIds, categoryList } = this.state;
    // let isDescription = description.length === 0;
    let isMatched = categoryList.length === 0;
    
    if(!isMatched){
      let category = categoryList[0].name; // categoryList.map((item) => item.name);
      let obj = {
        GUIDS: selectedIds,
        name: category,
        // description : description
      }
      await getProductCategory(obj, "drug").then(() => {
        this.sync();
      });
      this.setState({ show: !this.state.show, categoryList: [], selectedIds : [] });
    }else{
      this.setState({ isMatched })
    }
  };

  handleDelete = () => {
    const { deleteBulkDrugs } = this.props;
    const { selectedIds } = this.state;
    if (selectedIds !== []) {
      deleteBulkDrugs(selectedIds).then(() => {
        this.sync();
      });
    }
    this.setState({ selectedIds: [], isMultiSelected: false });
  };

  handleActiveFilter = async(val) => {
    const { getProductFilter } = this.props;
    const { selectedIds } = this.state;
    if (selectedIds !== []) {
      let filterActive = val === "0" ? false : true;
      await getProductFilter(selectedIds, filterActive).then(() => {
        this.sync();
      });
    }
    this.setState({ selectedIds: [], isMultiSelected: false, selectedItem : '' });
  };

  handleSelectAction = async (value) => {
    // await this.props.changePage(0);
    value === "Category"
      ? this.setState({ show: !this.state.show })
      : value === "Delete"
        ? this.handleDelete()
        : value === "0"
          ? this.handleActiveFilter(value)
          : value === "1"
            ? this.handleActiveFilter(value)
            : this.sync();
  };

  handleSelect = async (value) => {
    this.setState({
      selectedItem: value,
    })
    await this.props.changePage(0);
    value === "All Drugs"
      ? this.sync()
      : (value === '0' || value === '1') ? this.sync({
        isActive : parseInt(value)
      }) :  this.sync({
        isActive : '1',
        category: value
      })
    // if(value === '1'){
    //   this.props.getActiveCategory('drug').then(this.setState({categoryStatus: 'Active'}))
    // }else if(['All Drugs', '0'].includes(value)){
    //   this.setState({categoryStatus: ''}) 
    // }
  };

  // Return the bulk action value
  getMultiSelected = (e) => {
    this.setState({ isMultiSelected: e });
  };

  handleColumnSelectorModal = () => {
    this.setState({ columnModal: !this.state.columnModal });
  };

  getColumns = async (columns) => {
    localStorage.setItem("drugsColumns", JSON.stringify(columns));
    // await this.props.updateColumns(columns);
    this.setState({
      columnModal: false,
    });
  };

  setNewCategory = (categoryName) => {
    this.setState({ categoryName, isMatched: false });
  };

  // setDescription = (text) => {
  //   this.setState({ "description" : text, isDescription: false });
  // };

  getSelectedIds = (ids) => {
    this.setState({ selectedIds: ids });
  };

  clearFilter = () => {
    this.setState({
      selectedItem: ''
    })
  }

  clearMultiselect = () => {
    this.setState({
      selectedIds: [],
      isMultiSelected: false
    })
  }

  clearCategory = () => {
    this.setState({
      categoryList: "",
    })
  }

  onSelect = (selectedList, selectedItem) => {
    this.setState({
      categoryName: "",
      categoryList: selectedList,
      isMatched: false,
    });
  };

  onAddCategory = () => {
    let text = this.state.categoryName;
    let newCategory = [...this.state.categoryList];
    let isMatched = newCategory.find((i) => i.name === text);
    if (!isMatched) {
      newCategory.push({ name: text, id: "" });
      this.setState({
        categoryList: [...newCategory],
        categoryName: "",
      });
    } else {
      this.setState({
        isMatched: true,
      });
    }
  };

  onPageSizeChange = async (pageSize, pageIndex) => {
    await this.props.changePageSize(pageSize);
    this.sync();
  };

  onPageChange = async (pageIndex) => {
    await this.props.changePage(pageIndex);
    this.setState({ pageIndex }, () => this.sync());
  };

  render() {
    const { categories, currentPage, pageSize, activeCategories, pageIndex, total } = this.props;
    const {
      selectedIds,
      categoryList,
      categoryName,
      categoryStatus,
      columnModal,
      isMultiSelected,
      isMatched,
      selectedItem,
      bulkActionOpen,
      dropdownOpen,
      description,
      isDescription
    } = this.state;

    const options =
      categories.length > 0
        ? categories.map((i) => {
          return { name: i.name, id: i.id };
        })
        : [];
    let drugsColumns = JSON.parse(localStorage.getItem("drugsColumns"));
    return (
      <div>
        <Row className="table-actions">
          {this.state.show && 
          <ModalDialog
            show={this.state.show}
            title={"Add Category"}
            closeDialog={this.toggleModal}
            onSubmit={this.handleSubmit}
          >
            <Col sm="12">
              <Form.Group>
                <Form.Label column sm="2">
                  Categories
                </Form.Label>
                <Col sm="6">
                  <Multiselect
                    options={options}
                    selectedValues={categoryList.length > 0 ? categoryList : ""}
                    onSelect={this.onSelect}
                    onRemove={this.onSelect}
                    singleSelect={true}
                    placeholder={
                      categoryList.length > 0 ? "" : "Select Category"
                    }
                    displayValue="name"
                  />
                  {isMatched && (
                    <span column sm={`1`} className="danger-action">
                      {" "}
                      {"Category not selected."}
                    </span>
                  )}
                </Col>
              </Form.Group>
              <Form.Group>
                <Form.Label column sm={"2"}></Form.Label>
                <Col sm={"4"}>
                  <Form.Control
                    value={categoryName}
                    type={"input"}
                    isInvalid={isMatched}
                    placeholder={"Add New Category"}
                    onChange={(e) => {
                      this.setNewCategory(e.target.value); this.clearCategory();
                    }}
                  />
                  {isMatched && (
                    <span column sm={`1`} className="danger-action">
                      {" "}
                      {categoryName + " is already in categories."}
                    </span>
                  )}
                </Col>
                {categoryName !== "" && (
                  <Button variant="primary" onClick={this.onAddCategory}>
                    Add Category
                  </Button>
                )}
              </Form.Group>
              {/* <Form.Group>
                <Form.Label column sm="2">
                  Description
                </Form.Label>
                <Col sm="6">
                  <Form.Control
                    value={description}
                    type={"input"}
                    isInvalid={isDescription}
                    placeholder={"description"}
                    name="description"
                    onChange={(e) => {
                      this.setDescription(e.target.value);
                    }}
                  />
                  {isDescription && (
                    <span column sm={`1`} className="danger-action">
                      {" Description is required"}
                    </span>
                  )}
                </Col>
              </Form.Group> */}
            </Col>
          </ModalDialog>}
          <Col lg="4" md="3" sm="2">
            {selectedIds.length === 0 ? (
              <AllList
                handleSelect={this.handleSelect}
                selectedItem={selectedItem}
                categoryStatus={categoryStatus}
                list={activeCategories}
                name={"Drugs"}
                toggleFilter={this.toggleFilter}
                dropdownOpen={dropdownOpen}
              />
            ) : (
              <BulkAction
                handleSelectAction={this.handleSelectAction}
                toggleBulk={this.toggleBulk}
                bulkActionOpen={bulkActionOpen} />
            )}
          </Col>

          <Col lg="8" md="6" sm="4" className="table-inner-actions">
            <div>
              <Button variant="primary">
                <Link to="/addDrug"> New drug</Link>
              </Button>
            </div>
            <div className="sync">
              <a href="#" onClick={() => { this.sync(); this.clearFilter(); this.clearMultiselect(); }}>
                <i className="fas fa-sync"></i>
              </a>
            </div>
            <div className="sync">
              <a href="#" onClick={this.handleColumnSelectorModal}>
                <i className="fas fa-cog"></i>
              </a>
            </div>
            {columnModal && 
              <AssetsColumnSelector
                show={columnModal}
                title={'Add Columns'}
                closeDialog={this.handleColumnSelectorModal}
                getColumns={this.getColumns}
                columns={drugsColumns}
                onSubmit={this.handleColumnDrugs}
              />
            }
          </Col>
        </Row>
        <div className="drugs-main-table">
          <DrugsTableContainer
            getMultiSelected={this.getMultiSelected}
            // getChangedRowSelect={this.getChangedRowSelect}
            getSelectedIds={this.getSelectedIds}
            selectedIdProps={selectedIds}
            isMultiSelectedProps={isMultiSelected}
            columns={drugsColumns}
            pageSize={pageSize}
            pageIndex={pageIndex}
            total={total}
            pages={total / pageSize}
            currentPage={currentPage}
            onPageSizeChange={this.onPageSizeChange}
            onPageChange={this.onPageChange}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { categories, drugs, activeCategories, total, currentPage, 
    pageSize, pageIndex, rows, columns } = state.drugsReducer;
  return {
    categories,
    drugs,
    pageIndex,
    activeCategories,
    pageSize,
    total,
    currentPage,
    rows,
    columns
  }
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
    deleteBulkDrugs: (id) => dispatch(ProductServices.deleteBulkProducts(id)),
    getProductFilter: (ids, isActive) =>
      dispatch(ProductServices.updateProductStatus(ids, isActive)),
    getFilteredDrugList: (type) =>
      dispatch(drugsService.getFilteredDrugList(type)),
    getProductCategory: (obj, productType) =>
      dispatch(ProductServices.addProductCategory(obj, productType)),
    filterProductByCategory: (category, obj) =>
      dispatch(drugsService.filterProductByCategory(category, obj)),
    getAllCategory: () => dispatch(ProductServices.getAllCategory()),
    changePage : (pageNo) => dispatch(drugsService.changePage(pageNo)),
    changePageSize : (pageSize) => dispatch(drugsService.changePageSize(pageSize)),
    updateColumns : (columns) => dispatch(drugsService.updateColumns(columns)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Drugs);
