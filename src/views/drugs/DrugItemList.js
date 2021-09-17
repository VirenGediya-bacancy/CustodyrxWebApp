import React from "react";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import { Container, Button, Row, Col } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";
import EditDrugItemTag from "../../views/drugs/EditDrugItemTag";
import { connect } from "react-redux";
import AddDrugItemTag from "./AddDrugItemTag";
import drugsService from "../../service/DrugsService";
import AllItemFilter from 'commonComponents/itemDateFilter';
import { ItemBulkAction } from "../../commonComponents/ItemDropDown";
import moment from 'moment';
import { getDateTime, getTime, getDateColor } from "commonMethod/common";
import Pagination from "commonComponents/Pagination";
import ProductServices from "../../service/CommonServices";

class DrugItemList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 10,
      pageIndex: 0,
      itemTagId: '',
      show: false,
      editShow: false,
      dropdownOpen: false,
      selectStartDate: "",
      selectEndDate: "",
      itemsArray: [],
      selectedIds: [],
      isMultiSelected: false,
      bulkActionOpen: false,
      selectedItem: "",
      selectedKey: "",
    }
  }

  toggleFilter = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen })
  }

  toggleEditModal = () => {
    this.setState({ editShow: !this.state.editShow });
  }

  toggleModal = () => {
    this.setState({ show: !this.state.show });
  };

  toggleBulk = () => {
    this.setState({ bulkActionOpen: !this.state.bulkActionOpen });
  };


  getDrugItems = async (params = {}) => {
    const { pageSize, pageIndex } = this.state;
    let obj = {
      rows: pageSize,
      page: pageIndex,
      field: "itemEPC",
      sortOrder: "ASC",
      id: this.props.drug_id,
      productType: "drug",
      ...params
    };

    await this.props.getDrugItemTagList(obj);
  }

  componentDidMount() {
    this.getDrugItems();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.drug_id !== prevProps.drug_id) {
      this.getDrugItems();
    }
  }

  createAndReturnCheckBox = () => {
    return this.props.drugItemTags?.length > 0
      ? this.props.drugItemTags.map((data) => {
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
    this.drugs = filteredList;
    // return filteredList;
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
    if (list.length !== this.props.drugItemTags.length) {
      //   this.state.getMultiSelected(false);
      this.setState({ isMultiSelected: false })
    } else {
      //   this.state.getMultiSelected(true);
      this.setState({ isMultiSelected: true })
    }
    this.setState({ selectedIds: list })
  };

  toggleFilter = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };

  toggleBulk = () => {
    this.setState({ bulkActionOpen: !this.state.bulkActionOpen });
  };

  handleMultiSelect = () => {
    const { pageIndex, pageSize, isMultiSelected } = this.state;
    let ids = [];
    if (isMultiSelected) {
      ids = [];
    } else {
      const list = this.drugs.slice(
        pageSize * pageIndex,
        pageSize * (pageIndex + 1)
      );
      ids = list && list.map((items) => {
        return items.GUID;
      });
    }
    this.setState({ isMultiSelected: !isMultiSelected, selectedIds: ids });
  };

  /**
   *  Return the selected pageSize
   * @param {*} pageSize 
   * @param {*} pageIndex 
   */

  onPageSizeChange = (pageSize, pageIndex) => {
    this.setState({ pageSize, pageIndex });
  }

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
      id: this.props.drug_id,
      productType: "drug"
    };
    id !== 'bizLocation.name' && id !== 'lastSeen' && this.props.getDrugItemTagList(obj);
  }

  /**
   * Call back for the page changes
   * @param {*} pageIndex
   */

  onPageChange = (pageIndex) => {
    this.setState({ pageIndex });
  };

  handleSelect = async (key, value) => {
    const { selectStartDate, selectEndDate } = this.state;
    let obj = {};
    await this.setState({
      pageIndex: 0,
      selectedItem: value,
      selectedKey: key
    });
    if (["AllItems", "lotNumber", "location"].includes(key)) {
      this.setState({ selectStartDate: "", selectEndDate: "" });
    }

    key === "AllItems"
      ? this.getDrugItems()
      : (key === "lotNumber" || key === "location")

        ? this.getDrugItems({ [key]: value })
        : key === "startDate"
          ? this.setState({ selectStartDate: value })
          : key === "endDate" && selectStartDate !== ""
            ? (
              this.setState({ selectEndDate: value }),
              this.getDrugItems(
                {
                  from: moment(selectStartDate).utc().format("YYYY-MM-DD"),
                  to: moment(value).utc().format("YYYY-MM-DD")
                }
              )
              // .then((res) => {
              // this.setState({ dropdownOpen: false, selectEndDate: "", selectStartDate: "" });
              // })
            )
            : this.getDrugItems();
  };

  onEdit = (e, id) => {
    this.setState({ editShow: !this.state.editShow, itemTagId: id });
  };

  handleDelete = () => {
    const { deleteBulkItems } = this.props;
    const { selectedIds } = this.state;

    if (selectedIds !== []) {
      deleteBulkItems(selectedIds).then(() => {
        this.getDrugItems();
      });
    }

    this.setState({ selectedIds: [], isMultiSelected: false });
  };

  handleActiveFilter = (val) => {
    const { getItemFilter } = this.props;
    const { selectedIds } = this.state;

    if (selectedIds !== []) {
      let filterActive = val === "0" ? false : true;

      getItemFilter(selectedIds, filterActive).then(() => {
        this.getDrugItems();
      });
    }

    this.setState({ selectedIds: [], isMultiSelected: false });
  };

  handleSelectAction = async (value) => {
    // await this.props.changePage(0);
    value === "Delete"
      ? this.handleDelete()
      : value === "0"
        ? this.handleActiveFilter(value)
        : value === "1"
          ? this.handleActiveFilter(value)
          : this.getDrugItems();
  };

  render() {
    const {
      drug_id,
      drugItemTags,
      updateDrugItemTag,
      addDrugItemTag,
      getDrugItemTagList,
      getDrugItemTag,
      drugItemTag,
      itemTotal,
    } = this.props;

    const {
      pageSize,
      pageIndex,
      show,
      dropdownOpen,
      itemsArray,
      bulkActionOpen,
      selectStartDate,
      selectEndDate,
      selectedItem,
      selectedKey,
      selectedIds,
      isMultiSelected,
    } = this.state;

    const columns = [
      {
        width: 40,
        accessor: "check",
        Header: (
          <input
            type="checkbox"
            name="multi-select-box"
            disabled={drugItemTag?.length === 0}
            checked={
              isMultiSelected ||
              (drugItemTags?.length > 0 &&
                selectedIds.length === drugItemTags.length)
            }
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
        width: 150,
        Header: "Expiration Date",
        accessor: "expirationDate",
        Cell: ({ row }) => (
          <span
            className={
              row._original.isActive &&
              row._original.expirationDate &&
              (getDateColor(row._original.expirationDate,2)
                ? "expiryRed"
                : getDateColor(row._original.expirationDate,5)
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
        width: 120,
        Header: "Location",
        accessor: "bizLocation.name",
      },
      {
        width: 200,
        Header: "Last Seen",
        accessor: "lastSeen",
        Cell: ({ row }) =>
        (<span>
          {row._original.lastSeen ? getDateTime(row._original.lastSeen) : ''}
        </span>)
      },
      // {
      //   width: 200,
      //   Header: "Status",
      //   accessor: "status",
      // },
    ];

    return (
      <>
        <div className="drug-detail-tag-title">
          {/* {drugItemTags.length > 0 &&(
            <> */}
          {selectedIds.length === 0 ? (
            <AllItemFilter
              dropdownOpen={dropdownOpen}
              toggleFilter={this.toggleFilter}
              handleItemSelect={this.handleSelect}
              selectedItem={selectedItem}
              selectedKey={selectedKey}
              selectStartDate={selectStartDate}
              selectEndDate={selectEndDate}
              id={drug_id}
            />
          ) : (
            <ItemBulkAction
              bulkActionOpen={bulkActionOpen}
              toggleBulk={this.toggleBulk}
              handleSelectAction={this.handleSelectAction}
            />
          )}
          {/* </>
          )} */}
          <Button
            className="addItemBtn"
            variant="primary"
            onClick={(e) => this.setState({ show: true })}
          >
            Add Drug Item
          </Button>
        </div>
        {show &&
          <AddDrugItemTag
            drug_id={drug_id}
            show={this.state.show}
            toggleModal={this.toggleModal}
            addDrugItemTag={addDrugItemTag}
            getDrugItems={this.getDrugItems}
            getDrugItemTagList={this.getDrugItems}
            pageSize={pageSize}
            pageIndex={pageIndex}
          />
        }
        <Container fluid className="table">
          <Row>
            <Col md="">
              <ReactTable
                data={this.getPosts()}
                columns={columns}
                onSortedChange={this.onSortedChange}
                defaultPageSize={this.state.pageSize}
                loadingText="Loading the drugs"
                noDataText="Couldn't find drugs"
                onPageSizeChange={this.onPageSizeChange}
                onPageChange={this.onPageChange}

                getTdProps={(state, rowInfo, column, instance) => ({
                  onClick: () => {
                    if (rowInfo && column.id !== 'check') {
                      this.props.history.push({
                        pathname: `/drug/${this.props.match.params.drug_id}/${rowInfo.original.GUID}`,
                        state: {
                          drugName: this.props.drugName
                        }
                      })
                    }
                  }
                })}
                getTrGroupProps={(state, rowInfo, column, instance) => {
                  if (rowInfo !== undefined) {
                    for (let i = 0; i < state.data.length; i++) {
                      if (itemsArray.length === 0 && new Date(state.data[i].expirationDate) < new Date()) {
                        itemsArray.push(state.data[i].GUID);
                      } else if (new Date(state.data[i].expirationDate) < new Date()
                        && state.data[i].GUID === rowInfo.original.GUID) {
                        itemsArray.push(state.data[i].GUID);
                      }
                    }
                    return {
                      style: {
                        color:
                          rowInfo.original.isActive ?
                            (itemsArray.includes(rowInfo.original.GUID) && 'red')
                            : 'gray',

                        background: rowInfo.index % 2 ? '#fffff' : '#F5F5F5'
                      },
                      className: "table-row"
                    }
                  }
                }}
              />
              <Pagination total={itemTotal} pageSize={pageSize} currentPage={pageIndex+1} />
            </Col>
          </Row>
          {this.state.editShow &&
            <EditDrugItemTag
              drug_id={drug_id}
              itemTagId={this.state.itemTagId}
              editShow={this.state.editShow}
              toggleEditModal={this.toggleEditModal}
              updateDrugItemTag={updateDrugItemTag}
              getDrugItemTag={getDrugItemTag}
              pageSize={pageSize}
              pageIndex={pageIndex}
              getDrugItemTagList={this.getDrugItems}
              drugItemTag={drugItemTag}
            />
          }
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  const { searchKeyword } = state.searchReducer;
  const { drugItemTag } = state.drugItemTagReducer;
  const { itemTotal } = state.drugItemTagListReducer;
  return {
    searchKeyword,
    drugItemTag,
    itemTotal
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addDrugItemTag: (drugItemTagObj) => dispatch(drugsService.addDrugItemTag(drugItemTagObj)),
    getDrugItemTagList: (obj) => dispatch(ProductServices.getProductItems(obj)),
    deleteBulkItems: (id) => dispatch(ProductServices.deleteBulkProductItems(id)),
    getItemFilter: (ids, isActive) =>
      dispatch(ProductServices.updateProductItemStatus(ids, isActive)),
    getFilteredItemList: (type) =>
      dispatch(drugsService.getFilteredItemList(type)),
    getDrug: (drug_id, productType) => dispatch(ProductServices.getProductByID(drug_id, productType)),
  };
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DrugItemList)
);
