import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Tabs,
  Tab,
  Breadcrumb,
  DropdownButton,
  Dropdown,
  Row,
} from "react-bootstrap";
import { Row as RowDetail } from "../../commonComponents/Row";
import Title from "../../commonComponents/Title";
import "react-table-6/react-table.css";
import CloseButton from "commonComponents/closeButton";
import { withRouter } from "react-router";
import EditButton from "commonComponents/EditButton";
import EditDisposableItemTag from "./EditDisposableItemTag";
import { OverviewMovementHistory } from "commonComponents/OverviewMovementHistory";
import { connect } from "react-redux";
import { getDateTime, getDateColor, getTime } from "commonMethod/common";

class DisposableItemOverView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchKeyword: "",
      show: false,
      key: "overview",
      editShow: false,
      pageSize: 10,
      pageIndex: 1,
    };
  }

  componentDidMount() {
    this.props.getDisposableItemTag(
      this.props.disposable_item_tag_id,
      "disposable"
    );
  }

  handleGetMovementHistory = (newObj) => {
    const { getMovementHistory, disposableItemTag } = this.props;
    const { pageSize, pageIndex } = this.state;
    let obj = {
      rows: pageSize,
      page: pageIndex,
      field: "firstSeen",
      sortOrder: "DES",
      GUID: this.props.disposable_item_tag_id,
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
      GUID: this.props.disposable_item_tag_id,
      sortOrder: desc ? "DES" : "ASC",
    };
    this.handleGetMovementHistory(obj);
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.disposable_item_tag_id !== prevProps.disposable_item_tag_id
    ) {
      this.props.getDisposableItemTag(
        this.props.disposable_item_tag_id,
        "disposable"
      );
    }
  }

  onPageSizeChange = (pageSize, pageIndex) => {
    this.setState({ pageSize, pageIndex });
  };

  onPageChange = (pageIndex) => {
    this.setState({ pageIndex });
  };

  showBreadscrumName = (name) => {
    let { disposableName } = this.props.location.state;
    return (
      <Breadcrumb className={"item_overview_title"}>
        <Breadcrumb.Item active>{disposableName}</Breadcrumb.Item>
        <Breadcrumb.Item active>{name}</Breadcrumb.Item>
      </Breadcrumb>
    );
  };

  onEdit = (e, id) => {
    this.setState({ editShow: !this.state.editShow, itemTagId: id });
  };

  toggleEditModal = () => {
    this.setState({ editShow: !this.state.editShow });
  };

  onHandleMoreOperation = async (key) => {
    if (key === "markActive") {
      await this.props.editDisposableItemStatus(
        [this.props.disposable_item_tag_id],
        !this.props.disposableItemTag.isActive
      );
      await this.props.getDisposableItemTag(
        this.props.disposable_item_tag_id,
        "disposable"
      );
    } else if (key === "delete") {
      await this.props.deleteOneDisposableItem(
        this.props.disposable_item_tag_id
      );
      await this.props.getDisposable(this.props.disposable_id, "disposable");
      this.props.history.goBack();
    }
  };

  render() {
    const { pageSize, key, pageIndex } = this.state;
    const {
      disposableItemTag,
      disposable_item_tag_id,
      getDisposableItemTag,
      disposable_id,
      updateDisposableItemTag,
      getDisposableItemTagList,
      movementList,
      total,
      currentPage,
    } = this.props;
    return (
      <>
        <div className="drug-detail-action">
          <Title
            isActiveFlage={true}
            title={this.showBreadscrumName(disposableItemTag.itemEPC)}
            isActive={disposableItemTag.isActive}
          />
          <Row>
            <EditButton
              history={this.props.history}
              handleEdit={(e) =>
                this.onEdit(e, this.props.disposable_item_tag_id)
              }
            />
            <DropdownButton
              className={"drag_more_menu"}
              variant="info"
              title="More"
              onClick={(e) => this.onHandleMoreOperation(e.target.value)}
            >
              <Dropdown.Item as="button" value="markActive">
                Mark {disposableItemTag.isActive ? "Inactive" : "Active"}
              </Dropdown.Item>
              <Dropdown.Item as="button" value="delete">
                Delete
              </Dropdown.Item>
            </DropdownButton>
            <CloseButton
              history={this.props.history}
              path={`/disposable/${this.props.disposable_id}`}
              state={{
                disposableName: this.props.location.state.disposableName,
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
            <RowDetail
              name={"Item EPC"}
              value={disposableItemTag.itemEPC}
            ></RowDetail>
            <RowDetail
              name={"Lot/Batch Number"}
              value={disposableItemTag.lotNumber}
            ></RowDetail>
            <RowDetail
              name={"Expiration Date"}
              value={
                disposableItemTag.expirationDate
                  ? getTime(disposableItemTag.expirationDate)
                  : ""
              }
              className={
                disposableItemTag.isActive &&
                disposableItemTag.expirationDate &&
                (getDateColor(disposableItemTag.expirationDate, 2)
                  ? "expiryRed"
                  : getDateColor(disposableItemTag.expirationDate, 5)
                    ? "expiryYellow"
                    : "expiryBlack")
              }
            ></RowDetail>
            <RowDetail
              name={"Location"}
              value={disposableItemTag.bizLocation ? disposableItemTag.bizLocation.name: ''}
            ></RowDetail>
            <RowDetail
              name={"Last Seen"}
              value={disposableItemTag.lastSeen ? getDateTime(disposableItemTag.lastSeen) : ''}
            ></RowDetail>
          </Tab>
          <Tab
            eventKey="movement"
            title="Movement History"
            className="movement-history"
          >
            <OverviewMovementHistory
              onPageSizeChange={this.onPageSizeChange}
              onPageChange={this.onPageChange}
              movementList={movementList}
              handleGetMovementHistory={this.handleGetMovementHistory}
              onSortedChange={this.onMovementSortedChange}
              pageSize={pageSize}
              total={total}
              pageIndex={pageIndex}
              currentPage={currentPage}
            />
          </Tab>
        </Tabs>
        {this.state.editShow && (
          <EditDisposableItemTag
            disposable_id={disposable_id}
            itemTagId={disposable_item_tag_id}
            editShow={this.state.editShow}
            toggleEditModal={this.toggleEditModal}
            updateDisposableItemTag={updateDisposableItemTag}
            getDisposableItemTagList={getDisposableItemTagList}
            getDisposableItemTag={getDisposableItemTag}
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
    currentPage,
  };
};

export default withRouter(connect(mapStateToProps)(DisposableItemOverView));
