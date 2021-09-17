import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Row,
  Col,
  Button,
  Tabs,
  Tab,
  Breadcrumb,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import { connect } from "react-redux";
import { Row as RowDetail } from "../../commonComponents/Row";
import Title from "../../commonComponents/Title";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import CloseButton from "commonComponents/closeButton";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import EditAssetItemTag from "./EditAssetItemTag";
import AssetServiceHistoryList from "./AssetServiceHistoryList";
import AssetLifeCycleList from "./AssetLifeCycleList";
import { getDateTime, getTime, getDateColor } from "commonMethod/common";
import EditButton from "commonComponents/EditButton";
import { OverviewMovementHistory } from "commonComponents/OverviewMovementHistory";

class AssetItemOverView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchKeyword: "",
      show: false,
      pageSize: 10,
      pageIndex: 1,
      itemTagId: undefined,
      show: false,
      editShow: false,
      searchKeyword: "",
      key: "overview",
      initialData: [],
      dropdownOpen: false,
      selectStartDate: "",
      selectEndDate: "",
      isUpdated: false,
    };
  }

  componentDidMount() {
    this.props.getAssetItemTag(this.props.asset_item_tag_id, "asset");
  }

  handleGetMovementHistory = (newObj) => {
    const { getMovementHistory, assetItemTag } = this.props;
    const { pageSize, pageIndex } = this.state;
    let obj = {
      rows: pageSize,
      page: pageIndex,
      field: "firstSeen",
      sortOrder: "DES",
      GUID: this.props.asset_item_tag_id,
      ...newObj,
    };
    getMovementHistory(obj);
  };

  onMovementSortedChange = (sorted) => {
    const { pageSize, pageIndex } = this.state;
    const { id, desc } = sorted[0];
    const obj = {
      rows: pageSize,
      page: pageIndex,
      field: id,
      GUID: this.props.asset_item_tag_id,
      sortOrder: desc ? "DES" : "ASC",
    };
    this.handleGetMovementHistory(obj);
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.asset_item_tag_id !== prevProps.asset_item_tag_id) {
      this.props.getAssetItemTag(this.props.asset_item_tag_id, "asset");
    }
  }

  onEdit = (e, id) => {
    this.setState({ editShow: !this.state.editShow, itemTagId: id });
  };

  onPageSizeChange = (pageSize, pageIndex) => {
    this.setState({ pageSize, pageIndex });
  };

  onPageChange = (pageIndex) => {
    this.setState({ pageIndex });
  };

  toggleEditModal = () => {
    this.setState({ editShow: !this.state.editShow });
  };

  showBreadscrumName = (name) => {
    let { assetName } = this.props.location.state;
    return (
      <Breadcrumb className={"item_overview_title"}>
        <Breadcrumb.Item active>{assetName}</Breadcrumb.Item>
        <Breadcrumb.Item active>{name}</Breadcrumb.Item>
      </Breadcrumb>
    );
  };

  onHandleMoreOperation = async (key) => {
    if (key === "markActive") {
      await this.props.editAssetItemStatus(
        [this.props.asset_item_tag_id],
        !this.props.assetItemTag.isActive
      );
      await this.props.getAssetItemTag(this.props.asset_item_tag_id, "asset");
    } else if (key === "delete") {
      await this.props.deleteOneAssetItem(this.props.asset_item_tag_id);
      await this.props.getAsset(this.props.asset_id);
      this.props.history.goBack();
    }
  };

  render() {
    const {
      asset_item_tag_id,
      getAssetItemTag,
      asset_id,
      updateAssetItemTag,
      getAssetItemTagList,
      movementList,
      total, 
      currentPage,
      assetItemTag
    } = this.props;
    const { pageSize, pageIndex, key } = this.state;
    const data = [
      {
        event_time: "2021-07-07 15:12:34",
        first_seen: "2021-07-07 15:12:34",
        last_seen: "2021-09-07 15:12:34",
        location: "Miami, US",
      },
    ];
    const columns = [
      {
        width: 200,
        Header: "Event Time ",
        accessor: "event_time",
        Cell: ({ row }) => (
          <span>{getTime(row._original.event_time)}</span>
        ),
      },
      {
        width: 200,
        Header: "First Seen ",
        accessor: "first_seen",
        Cell: ({ row }) => (
          <span>{getTime(row._original.first_seen)}</span>
        ),
      },
      {
        width: 200,
        Header: "Last seen ",
        accessor: "last_seen",
        Cell: ({ row }) => (
          <span>{getTime(row._original.last_seen)}</span>
        ),
      },
      {
        width: 200,
        Header: "location ",
        accessor: "location",
      },
    ];

    return (
      <>
        <div className="drug-detail-action">
          <Title
            isActiveFlage={true}
            title={this.showBreadscrumName(assetItemTag.itemEPC)}
            isActive={assetItemTag.isActive}
          />
          <Row>
            <EditButton
              history={this.props.history}
              handleEdit={(e) => this.onEdit(e, this.props.asset_item_tag_id)}
            />
            <DropdownButton
              className={"drag_more_menu"}
              variant="info"
              title="More"
              onClick={(e) => this.onHandleMoreOperation(e.target.value)}
            >
              <Dropdown.Item as="button" value="markActive">
                Mark {assetItemTag.isActive ? "Inactive" : "Active"}
              </Dropdown.Item>
              <Dropdown.Item as="button" value="delete">
                Delete
              </Dropdown.Item>
            </DropdownButton>
            <CloseButton
              history={this.props.history}
              path={`/asset/${this.props.asset_id}`}
              state={{
                assetName: this.props.location.state.assetName,
                isBack: true,
              }}
            />
          </Row>
        </div>
        <Tabs
          defaultActiveKey="overview"
          mountOnEnter={true}
          unmountOnExit={true}
          activeKey={key}
          onSelect={(k) => this.setState({ key: k })}
          id="drug-item-detail-tabs"
          className="mb-3"
        >
          <Tab eventKey="overview" title="Overview" className="overview">
            <>
              {/* <div className='drug-detail-action float-right'>
                <Button variant="primary" onClick={(e) => this.onEdit(e, this.props.asset_item_tag_id)}>Edit </Button>
            </div> */}
              <RowDetail
                name={"Item EPC"}
                value={assetItemTag.itemEPC}
              ></RowDetail>
              <RowDetail
                name={"Asset ID"}
                value={assetItemTag.assetId}
              ></RowDetail>
              <RowDetail
                name={"Serial Number"}
                value={assetItemTag.serialNumber}
              ></RowDetail>
              <RowDetail
                name={"Lot Number"}
                value={assetItemTag.lotNumber}
              ></RowDetail>
              <RowDetail
                name={"Manufacture Date"}
                value={
                  assetItemTag.manufactureDate
                    ? getTime(assetItemTag.manufactureDate)
                    : ""
                }
              ></RowDetail>
              <RowDetail
                name={"Expiration Date"}
                value={
                  assetItemTag.expirationDate
                    ? getTime(assetItemTag.expirationDate)
                    : ""
                }
                className={
                  assetItemTag.isActive &&
                  assetItemTag.expirationDate &&
                  (getDateColor(assetItemTag.expirationDate, 2)
                  ? "expiryRed"
                  : getDateColor(assetItemTag.expirationDate, 5)
                    ? "expiryYellow"
                    : "expiryBlack")
                }
              ></RowDetail>
              <RowDetail
                name={"Purchase Date"}
                value={
                  assetItemTag.purchaseDate
                    ? getTime(assetItemTag.purchaseDate)
                    : ""
                }
              ></RowDetail>
              <RowDetail
                name={"Vendor"}
                value={assetItemTag.vendor}
              ></RowDetail>
              <RowDetail
                name={"Vendor Number"}
                value={assetItemTag.vendorNumber}
              ></RowDetail>
              <RowDetail
                name={"Department"}
                value={assetItemTag.department}
              ></RowDetail>
              <RowDetail
                name={"Status"}
                value={assetItemTag.status}
              ></RowDetail>
              <RowDetail
                name={"Location"}
                value={assetItemTag.bizLocation ? assetItemTag.bizLocation.name : ''}
              ></RowDetail>
              <RowDetail
                name={"Last Seen"}
                value={assetItemTag.lastSeen ? getDateTime(assetItemTag.lastSeen) : ''}
              ></RowDetail>
            </>
          </Tab>
          <Tab
            eventKey="movement"
            title="Movement History"
            className="movement-history"
          >
            <OverviewMovementHistory
              onPageSizeChange={this.onPageSizeChange}
              onPageChange={this.onPageChange}
              handleGetMovementHistory={this.handleGetMovementHistory}
              movementList={movementList}
              onSortedChange={this.onMovementSortedChange}
              total={total}
              pageIndex={pageIndex}
              currentPage={currentPage}
              pageSize={pageSize}
            />
          </Tab>
          <Tab
            eventKey="lifecycle"
            title="LifeCycle Record"
            className="lifeCycle-record"
          >
            <AssetLifeCycleList
              searchKeyword={""}
              asset_item_tag_id={asset_item_tag_id}
            />
          </Tab>
          <Tab
            eventKey="service"
            title="Service History"
            className="lifeCycle-record"
          >
            <AssetServiceHistoryList
              searchKeyword={""}
              asset_item_tag_id={asset_item_tag_id}
            />
          </Tab>
        </Tabs>
        {this.state.editShow && (
          <EditAssetItemTag
            asset_id={asset_id}
            itemTagId={asset_item_tag_id}
            editShow={this.state.editShow}
            toggleEditModal={this.toggleEditModal}
            updateAssetItemTag={updateAssetItemTag}
            getAssetItemTagList={getAssetItemTagList}
            getAssetItemTag={getAssetItemTag}
            pageSize={pageSize}
            pageIndex={pageIndex}
          />
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  const { total, currentPage } = state.movementHistoryReducer;
  return {
      total,
      currentPage
  };
};

export default withRouter(connect(mapStateToProps)(AssetItemOverView));
