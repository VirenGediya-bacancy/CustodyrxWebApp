import React from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import ModalDialog from "../../commonComponents/ModalDialog";
import { Link } from "react-router-dom";
import { BulkAction } from "../../commonComponents/ItemDropDown";
import { connect } from "react-redux";
import disposablesService from "../../service/DisposablesService";
import DisposableTableContainer from "container/Disposable/DisposableTableContainer";
import { DisposableColumns } from "Constant/Column";
import Multiselect from "multiselect-react-dropdown";
import ProductServices from "service/CommonServices";
import { AllDrugs, AllAssets } from "commonComponents/DropDown";
import AssetsColumnSelector from "commonComponents/AssetsColumnSelector";
import { AllList } from "commonComponents/DropDown";

class Disposable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      isMultiSelected: false,
      selectedFilter: "",
      columnModal: false,
      name: "",
      selectedIds: [],
      categoryList: [],
      selectedItem: "",
      categoryStatus: "Active",
      categoryName: "",
      isMatched: false,
      bulkActionOpen: false,
      dropdownOpen: false,
      description : "",
      isDescription: false
    };
    if (localStorage.getItem("disposableColumns")) {
      localStorage.getItem("disposableColumns");
    } else {
      localStorage.setItem(
        "disposableColumns",
        JSON.stringify(DisposableColumns)
      );
    }
  }

  toggleFilter = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };

  toggleBulk = () => {
    this.setState({ bulkActionOpen: !this.state.bulkActionOpen });
  };

  /**
   * Perform network request to get disposables list data
   */
  componentDidMount() {
    this.sync();
  }

  /**
   * handle sync action to get latest data from server
   */
  sync = async (newObj) => {
    const { pageSize, pageIndex } = this.props;
    let obj = {
      rows: pageSize,
      page: pageIndex,
      field: "name",
      sortOrder: "ASC",
      productType: "disposable",
      ...newObj,
    };
    await this.props.getDisposableList(obj);
    await this.props.getActiveCategory("disposable")
    // .then(this.setState({ categoryStatus: "Active" }));
  };

  componentDidMount() {
    this.sync();
    this.props.getAllCategory();
  }

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
      }
      await getProductCategory(obj, "disposable").then(() => {
        this.sync();
      });
      this.setState({ show: !this.state.show, categoryList: [], selectedIds : []  });
    }else{
      this.setState({isMatched})
    }
  };

  // setDescription = (text) => {
  //   this.setState({ "description" : text, isDescription: false });
  // };

  handleDelete = () => {
    const { deleteBulkDisposable } = this.props;
    const { selectedIds } = this.state;
    if (selectedIds !== []) {
      deleteBulkDisposable(selectedIds).then(() => {
        this.sync();
      });
    }
    this.setState({ selectedIds: [], isMultiSelected: false });
  };

  handleActiveFilter = (val) => {
    const { getProductFilter } = this.props;
    const { selectedIds, isMultiSelected } = this.state;

    if (selectedIds !== []) {
      let filterActive = val === "0" ? false : true;

      getProductFilter(selectedIds, filterActive).then(() => {
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

  // Display bulk action or page filter base on multi selection
  handleSelect = async (value) => {
    this.setState({
      selectedItem: value,
    });

    await this.props.changePage(0);

    value === "All Disposables"
      ? this.sync()
      : value === "0" || value === "1"
      ? this.sync({
          isActive: parseInt(value),
        })
      : this.sync({
          isActive: "1",
          category: value,
        });
    // if (value === "1") {
     
    // } else if (["All Disposables", "0"].includes(value)) {
    //   this.setState({ categoryStatus: "" });
    // }
  };

  // Return the bulk action value
  getMultiSelected = (e) => {
    this.setState({ isMultiSelected: e });
  };

  /**
   * Toggle Column Selector modal
   */
  handleColumnSelectorModal = () => {
    this.setState({ columnModal: !this.state.columnModal });
  };

  getColumns = (column) => {
    localStorage.setItem("disposableColumns", JSON.stringify(column));
    //this.props.updateDisposableColumns(column);
    this.setState({
      columnModal: false,
    });
  };

  setNewCategory = (categoryName) => {
    this.setState({ categoryName, isMatched: false });
  };

  clearCategory = () => {
    this.setState({
      categoryList: "",
    })
  }

  getSelectedIds = (ids) => {
    this.setState({ selectedIds: ids });
  };

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

  onPageSizeChange = async (pageSize, pageIndex) => {
    await this.props.changePageSize(pageSize);
    this.sync();
  };

  onPageChange = async (pageIndex) => {
    await this.props.changePage(pageIndex);
    this.sync();
  };

  render() {
    const {
      categories,
      currentPage,
      activeCategories,
      pageSize,
      pageIndex,
      total,
    } = this.props;
    const options =
      categories.length > 0
        ? categories.map((i) => {
            return { name: i.name, id: i.id };
          })
        : [];
    const {
      selectedIds,
      categoryName,
      isMatched,
      categoryList,
      show,
      selectedItem,
      categoryStatus,
      bulkActionOpen,
      dropdownOpen,
      isMultiSelected,
      columnModal,
      description,
      isDescription
    } = this.state;
    let disposableColumns = JSON.parse(
      localStorage.getItem("disposableColumns")
    );
    return (
      <div>
        <Row className="table-actions">
          {show &&
          <ModalDialog
            show={show}
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
                name={"Disposables"}
                dropdownOpen={dropdownOpen}
                toggleFilter={this.toggleFilter}
              />
            ) : (
              <BulkAction
                handleSelectAction={this.handleSelectAction}
                bulkActionOpen={bulkActionOpen}
                toggleBulk={this.toggleBulk}
              />
            )}
          </Col>

          <Col lg="8" md="6" sm="4" className="table-inner-actions">
            <div>
              <Button variant="primary">
                <Link to="/AddDisposable"> New disposable</Link>
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
                title={"Add Columns"}
                closeDialog={this.handleColumnSelectorModal}
                getColumns={this.getColumns}
                columns={disposableColumns}
                onSubmit={this.handleColumnDrugs}
              />
            }
          </Col>
        </Row>
        <div className="drugs-main-table">
          <DisposableTableContainer
            getMultiSelected={this.getMultiSelected}
            getSelectedIds={this.getSelectedIds}
            selectedIdProps={selectedIds}
            isMultiSelectedProps={isMultiSelected}
            pageSize={pageSize}
            pageIndex={pageIndex}
            total={total}
            columns={disposableColumns}
            onPageSizeChange={this.onPageSizeChange}
            onPageChange={this.onPageChange}
            pages={total / pageSize}
            currentPage={currentPage}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    disposables,
    categories,
    activeCategories,
    disposableColumns,
    pageIndex,
    pageSize,
    total,
    currentPage,
    rows,
  } = state.disposablesReducer;
  return {
    disposables: disposables,
    categories: categories,
    disposableColumns,
    activeCategories,
    pageIndex,
    pageSize,
    total,
    currentPage,
    rows,
  };
};

/**
 * To perform add,get,delete and update action on disposable
 * @param {*} dispatch
 * @returns
 */
const mapDispatchToProps = (dispatch) => {
  return {
    getDisposableList: (obj) =>
      dispatch(ProductServices.getAllProductList(obj)),
    getActiveCategory: (obj) =>
      dispatch(ProductServices.getActiveCategory(obj)),
    getFilteredDisposableList: (type) =>
      dispatch(disposablesService.getFilteredDisposableList(type)),
    deleteBulkDisposable: (id) =>
      dispatch(ProductServices.deleteBulkProducts(id)), //(disposablesService.deleteBulkDisposable(id)
    getProductFilter: (ids, isActive) =>
      dispatch(ProductServices.updateProductStatus(ids, isActive)), //dispatch(disposablesService.getProductFilter(ids, isActive)),
    getProductCategory: (obj, productType) =>
      dispatch(ProductServices.addProductCategory(obj, productType)),
    filterProductByCategory: (category, obj) =>
      dispatch(disposablesService.filterProductByCategory(category, obj)),
    getAllCategory: () => dispatch(ProductServices.getAllCategory()),
    updateDisposableColumns: (columns) =>
      dispatch(disposablesService.updateDisposableColumns(columns)),
    changePage: (pageNo) =>
      dispatch(disposablesService.changeDisposablePage(pageNo)),
    changePageSize: (pageSize) =>
      dispatch(disposablesService.changeDisposablePageSize(pageSize)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Disposable);
