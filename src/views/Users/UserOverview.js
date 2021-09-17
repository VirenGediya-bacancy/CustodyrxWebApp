import OverviewProductTable from "commonComponents/OverviewProductTable";
import React, { Component } from "react";
import { connect } from "react-redux";
import UserServices from "service/UserServices";
import ProductServices from "service/CommonServices";
import { Col, Row } from "react-bootstrap";
import OverviewHeader from "commonComponents/Overview/OverviewHeader";
import OverviewProductTabs from "commonComponents/OverviewProductTabs";
import { OverviewMovementHistory } from "commonComponents/OverviewMovementHistory";
import OverViewTab from "commonComponents/OverViewTab";
import { getDateTime } from "commonMethod/common";

export class UserOverview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      columnModal: false,
      selectedItem: "",
      selectedUser: "",
      categoryStatus: "",
      key: "overview",
      pageSize: 10,
      pageIndex: 1,
    };
  }

  componentDidMount() {
    this.sync();
  }

  sync = async (newObj = {}) => {
    const { pageSize, pageIndex, match } = this.props;
    const { userId } = match.params;
    let obj = {
      rows: pageSize,
      page: pageIndex,
      field: "GUID",
      sortOrder: "ASC",
      ...newObj,
    };
    await this.props.getUsersList(obj);
    await this.handleGetUserDetails(userId);
  };

  onSortedChange = (sorted) => {
    const { pageSize, pageIndex } = this.props;
    const { id, desc } = sorted[0];
    const obj = {
      rows: pageSize,
      page: pageIndex,
      field: id,
      sortOrder: desc ? "DES" : "ASC",
    };
    this.sync(obj);
  };

  onMovementSortedChange = (sorted) => {
    const { usersDetails } = this.props;
    const { pageSize, pageIndex } = this.state;
    const { id, desc } = sorted[0];
    const obj = {
      rows: pageSize,
      page: pageIndex,
      field: id,
      GUID: usersDetails && usersDetails.badgeEPC && usersDetails.badgeEPC.GUID,
      sortOrder: desc ? "DES" : "ASC",
    };
    this.handleGetMovementHistory(obj);
  };

  onPageSizeChange = async (pageSize, pageIndex) => {
    await this.props.changePageSize(pageSize);
    this.sync();
  };

  onPageChange = async (pageIndex) => {
    await this.props.changePage(pageIndex);
    this.sync();
  };

  handleSelectDropDown = async (val) => {
    // await this.props.changePage(0);
    val === "All Users"
      ? this.sync()
      : this.sync({
          isActive: parseInt(val),
        });
  };

  handleSelect = async (val) => {
    // await this.props.changePage(0);
    val === "All Users"
      ? this.sync()
      : this.sync({
          isActive: parseInt(val),
        });
  };

  handleGetUserDetails = (id) => {
    const { getUserDetails } = this.props;
    this.setState({ key: "overview" });
    getUserDetails(id);
  };

  handleGetMovementHistory = (newObj) => {
    const { getMovementHistory, usersDetails } = this.props;
    const { pageSize, pageIndex } = this.state;
    let obj = {
      rows: pageSize,
      page: pageIndex,
      field: "firstSeen",
      sortOrder: "DES",
      GUID: usersDetails && usersDetails.badgeEPC && usersDetails.badgeEPC.GUID,
      ...newObj,
    };
    getMovementHistory(obj);
  };

  handleTabs = (k) => {
    this.setState({ key: k });
  };

  onHandleMoreOperation = async (key) => {
    const { usersDetails } = this.props;
    if (key === "markActive") {
      await this.props.updateUserStatus(
        [usersDetails.GUID],
        !usersDetails.isActive
      );
      await this.handleGetUserDetails(usersDetails.GUID);
    } else if (key === "delete") {
      await this.props.deleteBulkUsers([usersDetails.GUID]);
      this.props.history.push("/users");
    }
  };

  handleTdProps = (rowInfo) => {
    this.handleGetUserDetails(rowInfo.original.GUID);
    this.props.history.push({
      pathname: `/user/${rowInfo.original.GUID}`,
      state: {
        assetName: rowInfo.original.name,
      },
    });
  };

  onPageSizeChange = (pageSize, pageIndex) => {
    this.setState({ pageSize, pageIndex });
  };

  onPageChange = (pageIndex) => {
    this.setState({ pageIndex });
  };

  handleTrProps = (rowInfo) => {
    const { userId } = this.props.match.params;
    return {
      style: {
        background: rowInfo.original.GUID === userId && "#EBECF0",
      },
      className: "table-row",
    };
  };

  render() {
    const {
      usersList,
      usersDetails,
      pageIndex,
      total,
      match,
      pageSize,
      movementList,
    } = this.props;
    const { key } = this.state;
    const { userId } = match.params;
    const OverViewTabsData = [
      {
        type: "image",
        value: usersDetails.avatar,
      },
      {
        name: "Name",
        value: usersDetails.name,
      },
      {
        name: "Email",
        value: usersDetails.email,
      },
      {
        name: "System Role",
        value: usersDetails.systemRole,
      },
      {
        name: "Phone",
        value: usersDetails.phone,
      },
      {
        name: "Provider Role",
        value: usersDetails.providerRole,
      },
      {
        name: "License/Serial Number",
        value: usersDetails.providerNumber,
      },
      {
        name: "Badge EPC",
        value: usersDetails.badgeEPC && usersDetails.badgeEPC.itemEPC,
      },
      {
        name: "Location",
        value: usersDetails?.itemData?.bizLocation ? usersDetails?.itemData?.bizLocation?.name : '',
      },
      {
        name: "Last Seen",
        value: usersDetails?.itemData?.lastSeen ? getDateTime(usersDetails?.itemData?.lastSeen) : '',
      },
    ];
    const TabsDetails = [
      {
        name: "Overview",
        EventKey: "overview",
        Component: <OverViewTab OverViewTabsData={OverViewTabsData} />,
      },
      {
        name: "Movement History",
        EventKey: "movement",
        Component: (
          <OverviewMovementHistory
            onPageSizeChange={this.onPageSizeChange}
            onPageChange={this.onPageChange}
            movementList={movementList}
            handleGetMovementHistory={this.handleGetMovementHistory}
            onSortedChange={this.onMovementSortedChange}
          />
        ),
      },
    ];
    return (
      <Row className="drug-detail-table-actions">
        <Col lg="3 quick-navigation">
          <OverviewProductTable
            tableCol={12}
            handleTrProps={this.handleTrProps}
            handleTdProps={this.handleTdProps}
            name={"Users"}
            history={this.props.history}
            addButtonURl={"/addUser"}
            tableData={usersList}
            pageSize={pageSize}
            total={total}
            pageIndex={pageIndex}
            onPageChange={this.onPageChange}
            onPageSizeChange={this.onPageSizeChange}
            handleSelect={this.handleSelect}
            onSortedChange={this.onSortedChange}
            userId={userId}
            onHandleMoreOperation={this.onHandleMoreOperation}
            selectedProduct={usersDetails}
            handleTabs={this.handleTabs}
            tabKey={key}
            pages={total / pageSize}
            module="user"
          />
        </Col>
        <Col lg="9" className="drug-item-detail-overview">
          <OverviewHeader
            editPath={`/editUser/${userId}`}
            history={this.props.history}
            title={usersDetails && usersDetails.name}
            isActive={usersDetails.isActive}
            onHandleMoreOperation={this.onHandleMoreOperation}
            closeButtonPath={`/${"Users".toLowerCase()}`}
          />
          <OverviewProductTabs
            TabsDetails={TabsDetails}
            handleTabs={this.handleTabs}
            tabKey={key}
          />
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    usersList,
    userColumns,
    pageIndex,
    usersMovementHistory,
    pageSize,
    total,
    currentPage,
    usersDetails,
    rows,
  } = state.usersReducer;
  const { movementList } = state.movementHistoryReducer;
  return {
    usersList,
    userColumns,
    pageSize,
    pageIndex,
    currentPage,
    usersMovementHistory,
    usersDetails,
    rows,
    total,
    movementList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUsersList: (obj) => dispatch(UserServices.getAllUserList(obj)),
    getMovementHistory: (obj) =>
      dispatch(ProductServices.getMovementHistory(obj)),
    getUserDetails: (userId) => dispatch(UserServices.getUserDetails(userId)),
    updateUserStatus: (ids, isActive) =>
      dispatch(UserServices.updateUserStatus(ids, isActive)),
    changePage: (pageNo) => dispatch(UserServices.changeUsersPage(pageNo)),
    changePageSize: (pageSize) =>
      dispatch(UserServices.changeUsersPageSize(pageSize)),
    deleteBulkUsers: (id) => dispatch(UserServices.deleteBulkUsers(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserOverview);
