import React, { Component } from 'react'
import { Button, Form, Col, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import Multiselect from "multiselect-react-dropdown";
import { Link } from 'react-router-dom';
import ModalDialog from "../../commonComponents/ModalDialog";
import { AllList } from '../../commonComponents/DropDown';
import { BulkAction } from '../../commonComponents/ItemDropDown';
import AssetsContainerTable from 'container/Assets/AssetsContainerTable';
import AssetsService from 'service/AssetsService';
import { AssetColumns } from 'Constant/Column';
import ProductServices from 'service/CommonServices';
import AssetsColumnSelector from 'commonComponents/AssetsColumnSelector';

class Assets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      isMultiSelected: false,
      selectedFilter: '',
      columnModal: false,
      categoryStatus: "Active",
      selectedIds: [],
      categoryName: '',
      selectedItem: '',
      categoryList: [],
      isMatched: false,
      dropdownOpen: false,
      bulkActionOpen: false,
      description : "",
      isDescription: false
    }
    if (localStorage.getItem("assetsColumns")) {
      localStorage.getItem("assetsColumns")
    } else {
      localStorage.setItem("assetsColumns", JSON.stringify(AssetColumns));
    }
  }

  toggleFilter = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };

  toggleBulk = () => {
    this.setState({ bulkActionOpen: !this.state.bulkActionOpen });
  };

  componentDidMount() {
    this.sync();
    this.props.getAllCategory();
  }

  getSelectedIds = (ids) => {
    this.setState({ selectedIds: ids });
  }

  sync = async (newObj) => {
    const { pageSize, pageIndex } = this.props;
    let obj = {
      rows: pageSize,
      page: pageIndex,
      field: "name",
      sortOrder: "ASC",
      productType: "asset",
      ...newObj
    };
    await this.props.getAssetsList(obj);
    await this.props.getActiveCategory('asset'); //.then(this.setState({categoryStatus: 'Active'}))
  }

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

  setNewCategory = (categoryName) => {
    this.setState({ categoryName, isMatched: false })
  }

  handleDelete = () => {
    const { deleteBulkAssets } = this.props;
    const { selectedIds } = this.state;
    if (selectedIds !== []) {
      deleteBulkAssets(selectedIds).then(() => {
        this.sync();
      });
    }
    this.setState({ selectedIds: [], isMultiSelected: false });
  }

  handleActiveFilter = (val) => {
    const { getProductFilter } = this.props;
    const { selectedIds } = this.state;
    if (selectedIds !== []) {
      let filterActive = val === "0" ? false : true;
      getProductFilter(selectedIds, filterActive).then(() => {
        this.sync();
      });
    }
    this.setState({ selectedIds: [], isMultiSelected: false, selectedItem : '' });
  }

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
    const { getFilteredAssetList, filterProductByCategory,
      pageIndex, pageSize } = this.props;
    value === "All Assets" 
    ?  this.sync()
    : (value === '0' || value === '1') ? this.sync({
        isActive : parseInt(value)
      }) :  this.sync({
        isActive : '1',
        category: value
      })
    // if(value === '1'){
    // }else if(['All Assets', '0'].includes(value)){
    //   this.setState({categoryStatus: ''}) 
    // }
  }

  handleColumnSelectorModal = () => {
    this.setState({ columnModal: !this.state.columnModal });
  }

  getMultiSelected = (e) => {
    this.setState({ isMultiSelected: e });
  }

  getColumns = async (column) => {
    localStorage.setItem("assetsColumns", JSON.stringify(column));
    // await this.props.updateAssetsColumns(column);
    this.setState({
      columnModal: false
    })
  }

  toggleModal = (e) => {
    this.setState({ show: !this.state.show });
  }

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
      this.setState({ show: !this.state.show, categoryList: [], selectedIds : []  });
    }else{
      this.setState({ isMatched})
    }
  };

  // setDescription = (text) => {
  //   this.setState({ "description" : text, isDescription: false });
  // };

  onSelect = (selectedList, selectedItem) => {
    this.setState({
      categoryName: "",
      categoryList: selectedList,
      isMatched: false
    })
  }

  onAddCategory = () => {
    let text = this.state.categoryName;
    let newCategory = [...this.state.categoryList];
    let isMatched = newCategory.find(i => i.name === text);
    if (!isMatched) {
      newCategory.push({ name: text, id: "" });
      this.setState({
        categoryList: [...newCategory],
        categoryName: ''
      })
    } else {
      this.setState({
        isMatched: true
      })
    }

  }

  onPageSizeChange = async (pageSize, pageIndex) => {
    await this.props.changePageSize(pageSize);
    this.sync();
  }

  onPageChange = async (pageIndex) => {
    await this.props.changePage(pageIndex);
    this.sync();
  }

  render() {

    const { categories, history, total, pageIndex, pageSize, currentPage, activeCategories } = this.props;
    const { isMatched, columnModal, categoryList, selectedItem,
      show, categoryStatus, selectedIds, bulkActionOpen, dropdownOpen, categoryName } = this.state;
    const options = categories && categories.length > 0 ? categories.map((i) => { return { name: i.name, id: i.id } }) : [];
    let assetColumns = JSON.parse(localStorage.getItem("assetsColumns"));
    return (
      <div>
        <Row className='table-actions'>
          {show && 
            <ModalDialog
              show={show}
              title={'Add Category'}
              closeDialog={this.toggleModal}
              onSubmit={this.handleSubmit}
            >
              <Col sm="12">

                <Form.Group >
                  <Form.Label column sm="2">Categories</Form.Label>
                  <Col sm="6">
                    <Multiselect
                      options={options}
                      selectedValues={categoryList.length > 0 ? categoryList : ''}
                      onSelect={this.onSelect}
                      onRemove={this.onSelect}
                      singleSelect={true}
                      placeholder={categoryList.length > 0 ? '' : 'Select Category'}
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
                    onChange={(e) => { this.setNewCategory(e.target.value); this.clearCategory() }}
                    />
                    {isMatched && <span column sm={`1`} className='danger-action'>
                      {categoryName + ' is already in categories.'}</span>}
                  </Col>
                  {categoryName !== '' &&
                    (<Button variant="primary" onClick={this.onAddCategory} >
                      Add Category
                    </Button>)}
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
            </ModalDialog>
          }
          <Col lg='4' md='3' sm='2'>
            {selectedIds.length === 0
              ? <AllList
                name="Assets"
                selectedItem={selectedItem}
                handleSelect={this.handleSelect}
                categoryStatus={categoryStatus}
                list={activeCategories}
                dropdownOpen={dropdownOpen}
                toggleFilter={this.toggleFilter}
              />
              : <BulkAction
                handleSelectAction={this.handleSelectAction}
                bulkActionOpen={bulkActionOpen}
                toggleBulk={this.toggleBulk}
              />
            }
          </Col>

          <Col lg='8' md='6' sm='4' className='table-inner-actions'>
            <div>
              <Button onClick={() => history.push('/addAsset')} variant="primary">New Asset</Button>
            </div>
            <div className='sync'>
              <a href='#' onClick={() => { this.sync(); this.clearFilter(); this.clearMultiselect(); }}>
                <i class="fas fa-sync"></i>
              </a>
            </div>
            <div className='sync'>
              <a href='#' onClick={this.handleColumnSelectorModal}>
                <i className="fas fa-cog"></i>
              </a>
            </div>
            {columnModal && 
              <AssetsColumnSelector
                show={columnModal}
                title={'Add Columns'}
                closeDialog={this.handleColumnSelectorModal}
                getColumns={this.getColumns}
                columns={assetColumns}
                onSubmit={this.handleColumnDrugs}
              />
            }
          </Col>
        </Row>
        <div className='drugs-main-table'>
          <AssetsContainerTable
            pageSize={pageSize}
            pageIndex={pageIndex}
            getSelectedIds={this.getSelectedIds}
            getMultiSelected={this.getMultiSelected}
            isMultiSelectedProps={this.state.isMultiSelected}
            selectedIdProps={this.state.selectedIds}
            columns={assetColumns}
            total={total}
            pages={total / pageSize}
            currentPage={currentPage}
            onPageSizeChange={this.onPageSizeChange}
            onPageChange={this.onPageChange}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { assetsList, categories, assetColumns, pageIndex, pageSize, total, activeCategories, currentPage, rows } = state.assetsReducer;
  return {
    assetsList,
    categories,
    assetColumns,
    activeCategories,
    pageSize,
    pageIndex,
    currentPage,
    rows,
    total
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getAssetsList : (obj) => dispatch(ProductServices.getAllProductList(obj)),
    getActiveCategory : (obj) => dispatch(ProductServices.getActiveCategory(obj)),
    deleteBulkAssets: (id) => dispatch(ProductServices.deleteBulkProducts(id)),//dispatch(AssetsService.deleteBulkAssets(id)),
    getProductFilter: (ids, isActive) => dispatch(ProductServices.updateProductStatus(ids, isActive)), //dispatch(AssetsService.getProductFilter(ids, isActive)),
    getFilteredAssetList : (value) => dispatch(AssetsService.getFilteredAssetsList(value)),
    getProductCategory: (obj, productType) => dispatch(ProductServices.addProductCategory(obj, productType)),
    filterProductByCategory: (category, obj) => dispatch(AssetsService.filterProductByCategory(category, obj)),
    getAllCategory: () => dispatch(ProductServices.getAllCategory()),
    updateAssetsColumns : (columns) => dispatch(AssetsService.updateAssetsColumns(columns)),
    changePage : (pageNo) => dispatch(AssetsService.changeAssetsPage(pageNo)),
    changePageSize : (pageSize) => dispatch(AssetsService.changeAssetsPageSize(pageSize)),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Assets);
