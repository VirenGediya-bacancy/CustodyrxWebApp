import MainListingHeader from "commonComponents/MainListingHeader";
import { UserColumns } from "Constant/UserColumns";
import React, { Component } from "react";
import { connect } from "react-redux";
import UserServices from "service/UserServices";

export class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIds: [],
      isMultiSelected: false,
      bulkActionOpen: false,
      show: false,
      selectedItem: "",
      categoryStatus: "",
    };

    if (localStorage.getItem("UserColumns")) {
      localStorage.getItem("UserColumns");
    } else {
      localStorage.setItem("UserColumns", JSON.stringify(UserColumns));
    }
  }

  onRefreshPage = () => {
    this.sync();
  };

  componentDidMount() {
    this.sync();
  }

  getSelectedIds = (ids) => {
    this.setState({ selectedIds: ids });
  };

  getMultiSelected = (e) => {
    this.setState({ isMultiSelected: e });
  };

  sync = (newObj) => {
    const { pageSize, pageIndex } = this.props;
    let obj = {
      rows: pageSize,
      page: pageIndex,
      field: "GUID",
      sortOrder: "ASC",
      ...newObj,
    };
    this.props.getUsersList(obj);
  };

  clearFilter = () => {
    this.setState({
      selectedItem: "",
      categoryStatus: "",
    });
  };

  createAndReturnCheckBox = () => {
    return this.props.usersList
      ? this.props.usersList.map((data) => {
          data["check"] = (
            <div style={{ "textAlign": "center" }}>
              <input
                type="checkbox"
                name={data.GUID}
                checked={this.state.selectedIds.includes(data.GUID)}
                onClick={(event) => this.handleClickGroup(data.GUID)}
              />
            </div>
          );
          return data;
        })
      : [];
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
    if (list.length !== this.props.usersList.length) {
      this.getMultiSelected(false);
    } else {
      this.getMultiSelected(true);
    }
    this.getSelectedIds(list);
  };

  handleDelete = () => {
    const { deleteBulkUsers } = this.props;
    const { selectedIds } = this.state;
    if (selectedIds !== []) {
      deleteBulkUsers(selectedIds).then(() => {
        this.sync();
      });
    }
    this.setState({ selectedIds: [], isMultiSelected: false });
  };

  handleActiveFilter = (val) => {
    const { getProductFilter } = this.props;
    const { selectedIds } = this.state;
    if (selectedIds !== []) {
      let filterActive = val === "0" ? false : true;
      getProductFilter(selectedIds, filterActive).then(() => {
        this.sync();
      });
    }
    this.setState({ selectedIds: [], isMultiSelected: false });
  };

  handleSelectAction = async (value) => {
    await this.props.changePage(0);
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

  getPosts = () => {
    let { searchKeyword, userColumns } = this.props;
   
    let allTrueColumns = {};
    userColumns && userColumns.length > 0
      ? userColumns.map((item) => {
          allTrueColumns[item.accessor] = item.checked;
        })
      : [];
    const list = this.createAndReturnCheckBox();

    const filteredList =
      searchKeyword && searchKeyword !== "" && list.length > 0
        ? list.filter((post) => {
            return (
              post.name.toLowerCase().startsWith(searchKeyword.toLowerCase()) ||
              (allTrueColumns.manufacturer &&
                post.manufacturer
                  .toLowerCase()
                  .startsWith(searchKeyword.toLowerCase())) ||
              (allTrueColumns.UNSPSCCode &&
                post.UNSPSCCode.toLowerCase().startsWith(
                  searchKeyword.toLowerCase()
                )) ||
              (allTrueColumns.productCode &&
                post.productCode
                  .toLowerCase()
                  .startsWith(searchKeyword.toLowerCase())) ||
              (allTrueColumns.modelNumber &&
                post.modelNumber.startsWith(searchKeyword.toLowerCase())) ||
              (allTrueColumns.brand &&
                post.brand
                  .toLowerCase()
                  .startsWith(searchKeyword.toLowerCase())) ||
              (allTrueColumns.description &&
                post.description
                  .toLowerCase()
                  .startsWith(searchKeyword.toLowerCase()))
            );
          })
        : list;
    this.Assets = filteredList;
    return filteredList;
  };

  toggleBulk = () => {
    this.setState({ bulkActionOpen: !this.state.bulkActionOpen });
  };

  handleSelect = async (value) => {
    this.setState({
      selectedItem: value,
    });
    await this.props.changePage(0);
    const {
      getFilteredAssetList,
      filterProductByCategory,
      pageIndex,
      pageSize,
    } = this.props;
    value === "All Users"
      ? this.sync()
      : value === "0" || value === "1"
      ? this.sync({
          isActive: parseInt(value),
        })
      : this.sync({
          isActive: "1",
          category: value,
        });
  };

  onSortedChange = (sorted) => {
    const { pageSize, pageIndex } = this.props;
    const { id, desc } = sorted[0];
    const obj = {
      rows: pageSize,
      page: pageIndex,
      productType: "asset",
      field: id,
      sortOrder: desc ? "DES" : "ASC",
    };
    id !== 'badgeEpc' && id !== 'location' && id !== 'lastSeen' && this.sync(obj);
  };

  onPageSizeChange = async (pageSize, pageIndex) => {
    await this.props.changePageSize(pageSize);
    this.sync();
  };

  onPageChange = async (pageIndex) => {
    await this.props.changePage(pageIndex);
    this.sync();
  };

  handleTdProps = (rowInfo) => {
    this.props.history.push({
      pathname: `/user/${rowInfo.original.GUID}`,
      state: {
        assetName: rowInfo.original.name,
      },
    });
  };

  handleTrProps = (rowInfo) => {
    return {
      style: {
        color: !rowInfo.original.isActive && "gray",
        background:
          this.state.selectedIds.includes(rowInfo.original.GUID) && "#EBECF0",
        background: rowInfo.index % 2 ? "#fffff" : "#F5F5F5",
      },
      className: "table-row",
    };
  };

  handleRedirect = (path) => {
    const { history } = this.props;
    history.push(path);
  };

  render() {
    const { selectedIds, selectedItem, bulkActionOpen, isMultiSelected } =
      this.state;
    const {
      categories,
      history,
      total,
      pageIndex,
      pageSize,
      usersList,
      currentPage,
      activeCategories,
    } = this.props;
    return (
      <div>
        <MainListingHeader
          addButtonText={"Add User"}
          addButtonURl={"/addUser"}
          module="user"
          name={"Users"}
          columnTitle={"Add User Columns"}
          selectedIdProps={selectedIds}
          handleSelect={this.handleSelect}
          handleTrProps={this.handleTrProps}
          handleTdProps={this.handleTdProps}
          total={total}
          pageSize={pageSize}
          pageIndex={pageIndex}
          pages={total / pageSize}
          selectedItem={selectedItem}
          hanldeSubmitColumns={this.hanldeSubmitColumns}
          isMultiSelectedProps={isMultiSelected}
          onPageSizeChange={this.onPageSizeChange}
          handleRedirect={this.handleRedirect}
          onPageChange={this.onPageChange}
          onSortedChange={this.onSortedChange}
          handleSelectAction={this.handleSelectAction}
          bulkActionOpen={bulkActionOpen}
          toggleBulk={this.toggleBulk}
          columnName="UserColumns"
          onRefreshPage={this.onRefreshPage}
          getSelectedIds={this.getSelectedIds}
          getMultiSelected={this.getMultiSelected}
          dataList={usersList}
          getPosts={this.getPosts}
          tableData={this.getPosts()}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    usersList,
    userColumns,
    pageIndex,
    pageSize,
    total,
    currentPage,
    rows,
  } = state.usersReducer;
  const {searchKeyword} = state.searchReducer;

  return {
    usersList,
    userColumns,
    pageSize,
    pageIndex,
    currentPage,
    rows,
    total,
    searchKeyword
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUsersList: (obj) => dispatch(UserServices.getAllUserList(obj)),
    getProductFilter: (ids, isActive) =>
      dispatch(UserServices.updateUserStatus(ids, isActive)),
    deleteBulkUsers: (id) => dispatch(UserServices.deleteBulkUsers(id)),
    changePage: (pageNo) => dispatch(UserServices.changeUsersPage(pageNo)),
    changePageSize: (pageSize) =>
      dispatch(UserServices.changeUsersPageSize(pageSize)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);
