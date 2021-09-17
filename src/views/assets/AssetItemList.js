import React from "react";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import { Container, Button, Row, Col } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";
import EditAssetItemTag from "../../views/assets/EditAssetItemTag";
import { connect } from "react-redux";
import AssetsService from "../../service/AssetsService";
import AllItemFilter from "commonComponents/itemDateFilter";
import { ItemBulkAction } from "../../commonComponents/ItemDropDown";
import AddAssetItemTag from "./AddAssetItemTag";
import { getDateTime, getTime, getDateColor } from "commonMethod/common";
import Pagination from "commonComponents/Pagination";
import ProductServices from "../../service/CommonServices";

class AssetItemList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 10,
      pageIndex: 0,
      itemTagId: undefined,
      show: false,
      editShow: false,
      searchKeyword: "",
      dropdownOpen: false,
      bulkActionOpen: false,
      selectedItem: '',
      selectedKey: "",
      selectStartDate: "",
      selectEndDate: "",
      itemsArray: [],
      selectedIds: [],
      isMultiSelected: false,
    };
  }

  toggleFilter = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  };

  toggleBulk = () => {
    this.setState({ bulkActionOpen: !this.state.bulkActionOpen });
  };

  getAssetItems = async (params = {}) => {
    const { pageSize, pageIndex } = this.state;
    let obj = {
      rows: pageSize,
      page: pageIndex,
      field: "itemEPC",
      sortOrder: "ASC",
      id: this.props.asset_id,
      productType: "asset",
      ...params
    };

    await this.props.getAssetItemTagList(obj);
  };
  /**
   * Perform network request to get AssetItemList data
   */
  componentDidMount() {
    this.getAssetItems();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.asset_id !== prevProps.asset_id) {
      this.getAssetItems();
    }
  }

  createAndReturnCheckBox = () => {
    return this.props.assetItemTags?.length > 0
      ? this.props.assetItemTags.map((data) => {
        data["check"] = (
          <div style={{ textAlign: "center" }}>
            <input
              type="checkbox"
              name={data.GUID}
              checked={this.state.selectedIds.includes(data.GUID)}
              onChange={(event) => this.handleClickGroup(data.GUID)}
            />
          </div>
        );
        return data;
      })
      : [];
  };

  // Filter the data based on user search
  getPosts = () => {
    let { searchKeyword } = this.props;
    const list = this.createAndReturnCheckBox();
    const filteredList =
      searchKeyword && searchKeyword !== "" && list.length > 0
        ? list.filter((post) => {
          return post.itemEPC.toLowerCase().startsWith(searchKeyword.toLowerCase())
            || post.serialNumber.toLowerCase().startsWith(searchKeyword.toLowerCase())
        })
        : list;
    this.Assets = filteredList;
    return filteredList;
  };

  handleClickGroup = (id) => {
    let list = [...this.state.selectedIds];
    const isPresent = list.includes(id);
    let ids = [];
    if (isPresent) {
      const index = list.indexOf(id);
      list.splice(index, 1);
    } else {
      list.push(id);
    }

    if (list.length !== this.props.assetItemTags.length) {
      //   this.state.getMultiSelected(false);
      this.setState({ isMultiSelected: false })
    } else {
      //   this.state.getMultiSelected(true);
      this.setState({ isMultiSelected: true })
    }

    this.setState({ selectedIds: list })
  };

  handleMultiSelect = () => {
    const { pageIndex, pageSize, isMultiSelected, selectedIds } = this.state;
    let ids = [];
    if (isMultiSelected) {
      ids = [];
    } else {
      const list = this.Assets.slice(
        pageSize * pageIndex,
        pageSize * (pageIndex + 1)
      );
      ids = list.map((items) => {
        return items.GUID;
      });
    }
    this.setState({ isMultiSelected: !isMultiSelected, selectedIds: ids });
    // this.props.getMultiSelected(!this.props.isMultiSelectedProps);
    // this.props.getSelectedIds(ids);
  };

  toggleModal = () => {
    this.setState({ show: !this.state.show });
  };

  toggleEditModal = () => {
    this.setState({ editShow: !this.state.editShow });
  };

  /**
   *  Return the selected pageSize
   * @param {*} pageSize
   * @param {*} pageIndex
   */

  onPageSizeChange = (pageSize, pageIndex) => {
    this.setState({ pageSize, pageIndex });
  };

  /**
   *  When user click on column this will sorting the table data
   * @param {*} sorted
   */
  onSortedChange = (sorted) => {
    const { pageSize, pageIndex } = this.state;
    const { id, desc } = sorted[0];
    let obj = {
      rows: pageSize,
      page: pageIndex,
      field: id,
      sortOrder: desc ? 'DES' : 'ASC',
      id: this.props.asset_id,
      productType: "asset"
    };
    id !== 'bizLocation.name' && id !== 'lastSeen' && this.props.getAssetItemTagList(obj);
  };

  /**
   * Call back for the page changes
   * @param {*} pageIndex
   */

  onPageChange = (pageIndex) => {
    this.setState({ pageIndex });
  };

  handleSelect = async (key, value) => {
    await this.setState({
      pageIndex: 0,
      selectedItem: value,
      selectedKey: key
    });
    if (['AllItems', 'lotNumber'].includes(key)) {
      this.setState({ selectStartDate: "", selectEndDate: "" })
    }
    const { selectStartDate } = this.state;

    key === "AllItems" ? this.getAssetItems()
      : (key === "lotNumber" || key === "location")
        ? this.getAssetItems({ [key]: value })
        : key === "startDate"
          ? this.setState({ selectStartDate: value })
          : key === "endDate" && selectStartDate !== ""
            ? (
              this.setState({ selectEndDate: value }),
              this.getAssetItems(
                {
                  from: selectStartDate,
                  to: value
                }
              )
            ) : this.getAssetItems();
  };

  onEdit = (e, id) => {
    this.setState({ editShow: !this.state.editShow, itemTagId: id });
  };

  handleDelete = () => {
    const { deleteBulkItems } = this.props;
    const { selectedIds, pageSize, pageIndex } = this.state;

    if (selectedIds !== []) {
      deleteBulkItems(selectedIds).then(() => {
        this.getAssetItems();
      });
    }

    this.setState({ selectedIds: [], isMultiSelected: false });
  };

  handleActiveFilter = (val) => {
    const { getItemFilter } = this.props;
    const { selectedIds, isMultiSelected } = this.state;

    if (selectedIds !== []) {
      let filterActive = val === "0" ? false : true;

      getItemFilter(selectedIds, filterActive).then(() => {
        this.getAssetItems();
      });
    }

    this.setState({ selectedIds: [], isMultiSelected: false });
  };

  handleSelectAction = async (value) => {
    // await this.props.changePage(0);
    value === "Delete" ? this.handleDelete()
      : value === "0" ? this.handleActiveFilter(value)
        : value === "1" ? this.handleActiveFilter(value)
          : this.getDrugItems();
  };


  render() {
    const {
      asset_id,
      assetItemTags,
      lotNumber,
      updateAssetItemTag,
      addAssetItemTag,
      getAssetItemTagList,
      getAssetItemTag,
      itemTotal
    } = this.props;

    const {
      searchKeyword,
      selectedKey,
      show,
      pageSize,
      pageIndex,
      itemsArray,
      dropdownOpen,
      selectStartDate,
      selectedItem,
      selectEndDate,
      selectedIds,
      isMultiSelected,
      bulkActionOpen
    } = this.state;

    const columns = [
      {
        width: 40,
        accessor: "check",
        Header: (
          <input
            type="checkbox"
            name="multi-select-box"
            disabled={assetItemTags?.length === 0}
            checked={isMultiSelected || (assetItemTags?.length > 0 &&
              selectedIds.length === assetItemTags.length)}
            onChange={this.handleMultiSelect}
          />
        ),
        sortable: false,
        filterable: false,
      },
      {
        width: 220,
        Header: "Item EPC",
        accessor: "itemEPC",
      },
      {
        width: 100,
        Header: "Asset Id",
        accessor: "assetId",
      },
      {
        width: 120,
        Header: "Serial Number",
        accessor: "serialNumber",
      },
      {
        width: 120,
        Header: "Lot Number",
        accessor: "lotNumber",
      },
      {
        width: 160,
        Header: "Manufacture Date",
        accessor: "manufactureDate",
        Cell: ({ row }) => (
          <span>
            {row._original.manufactureDate
              ? getTime(row._original.manufactureDate)
              : ""}
          </span>
        ),
      },
      {
        width: 140,
        Header: "Expiration Date",
        accessor: "expirationDate",
        Cell: ({ row }) => (
          <span
            className={
              row._original.isActive &&
              row._original.expirationDate &&
              (getDateColor(row._original.expirationDate, 2)
              ? "expiryRed"
              : getDateColor(row._original.expirationDate, 5)
                  ? "expiryYellow"
                  : "expiryBlack")
            }
          >
            {row._original.expirationDate &&
              getTime(row._original.expirationDate)}
          </span>
        ),
      },
      {
        width: 130,
        Header: "Purchase Date",
        accessor: "purchaseDate",
        Cell: ({ row }) => (
          <span>
            {row._original.purchaseDate
              ? getTime(row._original.purchaseDate)
              : ""}
          </span>
        ),
      },
      {
        width: 80,
        Header: "Vendor",
        accessor: "vendor",
      },
      {
        width: 140,
        Header: "Vendor Number",
        accessor: "vendorNumber",
      },
      {
        width: 120,
        Header: "Department",
        accessor: "department",
      },
      // {
      //   width: 200,
      //   Header: "Status",
      //   accessor: "status",
      // },
      {
        width: 100,
        Header: "Location",
        accessor: "bizLocation.name",
      },
      {
        width: 200,
        Header: 'Last Seen',
        accessor: 'lastSeen',
        Cell: ({ row }) =>
        (<span>
          {row._original.lastSeen ? getDateTime(row._original.lastSeen) : ''}
        </span>)
      },
    ];

    return (
      <>
        <div className="drug-detail-tag-title">
          {selectedIds.length === 0 ? (
            <AllItemFilter
              dropdownOpen={dropdownOpen}
              toggleFilter={this.toggleFilter}
              handleItemSelect={this.handleSelect}
              id={asset_id}
              selectedKey={selectedKey}
              selectedItem={selectedItem}
              selectStartDate={selectStartDate}
              selectEndDate={selectEndDate} />
          ) : (
            <ItemBulkAction bulkActionOpen={bulkActionOpen}
              toggleBulk={this.toggleBulk}
              handleSelectAction={this.handleSelectAction} />
          )}

          <Button
            className="addItemBtn"
            variant="primary"
            onClick={(e) => this.setState({ show: true })}
          >
            Add Asset Item
          </Button>
        </div>
        {show && (
          <AddAssetItemTag
            asset_id={asset_id}
            show={this.state.show}
            toggleModal={this.toggleModal}
            uniqueLotNumber={lotNumber}
            getAssetItems={this.getAssetItems}
            addAssetItemTag={addAssetItemTag}
            getAssetItemTagList={getAssetItemTagList}
            pageSize={pageSize}
            pageIndex={pageIndex}
          />
        )}
        <Container fluid className="table">
          <Row>
            <Col md="">
              <ReactTable
                data={this.getPosts() || []}
                columns={columns}
                onSortedChange={this.onSortedChange}
                defaultPageSize={this.state.pageSize}
                loadingText="Loading the assets"
                noDataText="Couldn't find assets"
                onPageSizeChange={this.onPageSizeChange}
                onPageChange={this.onPageChange}
                getTdProps={(state, rowInfo, column, instance) => ({
                  onClick: () => {
                    if (rowInfo && column.id !== 'check' && column.id !== 'action') {
                      this.props.history.push({
                        pathname: `/asset/${this.props.match.params.assetId}/${rowInfo.original.GUID}`,
                        state: {
                          assetName: this.props.assetName
                        }
                      })
                    }
                  }
                })}
                getTrGroupProps={(state, rowInfo, column, instance) => {
                  if (rowInfo !== undefined) {
                    for (let i = 0; i < state.data.length; i++) {
                      if (
                        itemsArray.length === 0 &&
                        new Date(state.data[i].expirationDate) < new Date()
                      ) {
                        itemsArray.push(state.data[i].GUID);
                      } else if (
                        new Date(state.data[i].expirationDate) < new Date() &&
                        state.data[i].GUID === rowInfo.original.GUID
                      ) {
                        itemsArray.push(state.data[i].GUID);
                      }
                    }
                    return {
                      style: {
                        color: rowInfo.original.isActive
                          ? itemsArray.includes(rowInfo.original.GUID) && "red"
                          : "gray",
                        background: rowInfo.index % 2 ? '#fffff' : '#F5F5F5'
                      },
                      className: "table-row"
                    };
                  }
                }}
              />
              <Pagination total={itemTotal} currentPage={pageIndex+1} pageSize={pageSize} />
            </Col>
          </Row>
          {this.state.editShow &&
            <EditAssetItemTag
              asset_id={asset_id}
              itemTagId={this.state.itemTagId}
              editShow={this.state.editShow}
              toggleEditModal={this.toggleEditModal}
              updateAssetItemTag={updateAssetItemTag}
              getAssetItemTagList={getAssetItemTagList}
              getAssetItemTag={getAssetItemTag}
              pageSize={pageSize}
              pageIndex={pageIndex}
            />
          }
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  const { searchKeyword } = state.searchReducer;
  const { itemTotal } = state.assetItemTagListReducer;
  return {
    searchKeyword,
    itemTotal
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addAssetItemTag: (assetItemTagObj) =>
      dispatch(AssetsService.addAssetItemTag(assetItemTagObj)),
    getAssetItemTagList: (obj) =>
      dispatch(ProductServices.getProductItems(obj)),
    deleteBulkItems: (id) => dispatch(ProductServices.deleteBulkProductItems(id)),
    getItemFilter: (ids, isActive) =>
      dispatch(ProductServices.updateProductItemStatus(ids, isActive)),
  };
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AssetItemList)
);
