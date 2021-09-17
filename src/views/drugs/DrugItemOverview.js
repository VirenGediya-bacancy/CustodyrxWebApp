import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { connect } from "react-redux";
import {
  Row,
  Col,
  Tabs,
  Tab,
  Breadcrumb,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import { Row as RowDetail } from "../../commonComponents/Row";
import Title from "../../commonComponents/Title";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import CloseButton from "commonComponents/closeButton";
import { withRouter } from "react-router";
import { getDateTime, getTime, getDateColor } from "commonMethod/common";
import EditButton from "commonComponents/EditButton";
import EditDrugItemTag from "./EditDrugItemTag";
import Pagination from "commonComponents/Pagination";
import { OverviewMovementHistory } from "commonComponents/OverviewMovementHistory";

class DrugItemOverView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      key: "overview",
      editShow: false,
      pageSize: 10,
      pageIndex: 1,
    };
  }

  getDrugItemDetails = async () => {
    await this.props.getDrugItemTag(this.props.drug_item_tag_id, "drug");
  };

  componentDidMount() {
    this.getDrugItemDetails();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.drug_item_tag_id !== prevProps.drug_item_tag_id) {
      // this.props.getDrugItemTag(this.props.drug_item_tag_id, "drug")
      this.getDrugItemDetails();
    }
  }

  handleGetMovementHistory = (newObj) => {
    const { getMovementHistory, drugItemTag } = this.props;
    const { pageSize, pageIndex } = this.state;
    let obj = {
      rows: pageSize,
      page: pageIndex,
      field: "firstSeen",
      sortOrder: "DES",
      GUID: this.props.drug_item_tag_id,
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
      GUID: this.props.drug_item_tag_id,
      sortOrder: desc ? "DES" : "ASC",
    };
    this.handleGetMovementHistory(obj);
  };

  onEdit = (e, id) => {
    this.setState({ editShow: !this.state.editShow, itemTagId: id });
  };

  toggleEditModal = () => {
    this.setState({ editShow: !this.state.editShow });
  };

  onPageSizeChange = (pageSize, pageIndex) => {
    this.setState({ pageSize, pageIndex });
  };

  onPageChange = (pageIndex) => {
    this.setState({ pageIndex });
  };

  showBreadscrumName = (name) => {
    let { drugName } = this.props.location.state;
    return (
      <Breadcrumb className={"item_overview_title"}>
        <Breadcrumb.Item active>{drugName}</Breadcrumb.Item>
        <Breadcrumb.Item active>{name}</Breadcrumb.Item>
      </Breadcrumb>
    );
  };

  onHandleMoreOperation = async (key) => {
    if (key === "markActive") {
      await this.props.editDrugItemStatus(
        [this.props.drug_item_tag_id],
        !this.props.drugItemTag.isActive
      );
      this.getDrugItemDetails();
    } else if (key === "delete") {
      await this.props.deleteDrugItem(this.props.drug_item_tag_id);
      await this.props.getDrug(this.props.drug_id);
      this.props.history.push(`/drug/${this.props.drug_id}`);
    }
  };

  render() {
    const { pageSize, key, pageIndex } = this.state;
    const {
      drugItemTag,
      drug_id,
      drug_item_tag_id,
      updateDrugItemTag,
      getDrugItemTagList,
      movementList,
      total,
      currentPage,
    } = this.props;

    return (
      <>
        <div className="drug-detail-action">
          <Title
            isActiveFlage={true}
            title={this.showBreadscrumName(drugItemTag.itemEPC)}
            isActive={drugItemTag.isActive}
          />
          <Row>
            <EditButton
              history={this.props.history}
              handleEdit={(e) => this.onEdit(e, this.props.drug_item_tag_id)}
            />
            <DropdownButton
              className={"drag_more_menu"}
              variant="info"
              title="More"
              onClick={(e) => this.onHandleMoreOperation(e.target.value)}
            >
              <Dropdown.Item as="button" value="markActive">
                Mark {drugItemTag.isActive ? "Inactive" : "Active"}
              </Dropdown.Item>
              <Dropdown.Item as="button" value="delete">
                Delete
              </Dropdown.Item>
            </DropdownButton>
            <CloseButton
              history={this.props.history}
              path={`/drug/${this.props.drug_id}`}
              state={{
                drugName: this.props.location.state.drugName,
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
              value={drugItemTag.itemEPC}
            ></RowDetail>
            <RowDetail
              name={"Serial Number"}
              value={drugItemTag.serialNumber}
            ></RowDetail>
            <RowDetail
              name={"Lot Number"}
              value={drugItemTag.lotNumber}
            ></RowDetail>
            <RowDetail
              name={"Expiration Date"}
              value={
                drugItemTag.expirationDate &&
                getTime(drugItemTag.expirationDate)
              }
              className={
                drugItemTag.isActive &&
                drugItemTag.expirationDate &&
                (getDateColor(drugItemTag.expirationDate, 2)
                  ? "expiryRed"
                  : getDateColor(drugItemTag.expirationDate, 5)
                    ? "expiryYellow"
                    : "expiryBlack")
              }
            ></RowDetail>
            <RowDetail
              name={"Location"}
              value={drugItemTag.bizLocation ? drugItemTag.bizLocation.name : ''}
            ></RowDetail>
            <RowDetail
              name={"Last Seen"}
              value={drugItemTag.lastSeen ? getDateTime(drugItemTag.lastSeen) : ''}
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
              total={total}
              pageSize={pageSize}
              pageIndex={pageIndex}
              currentPage={currentPage}
            />
          </Tab>
        </Tabs>
        {this.state.editShow && (
          <EditDrugItemTag
            drug_id={drug_id}
            itemTagId={drug_item_tag_id}
            editShow={this.state.editShow}
            toggleEditModal={this.toggleEditModal}
            updateDrugItemTag={updateDrugItemTag}
            getDrugItemTagList={getDrugItemTagList}
            getDrugItemTag={this.getDrugItemDetails}
            pageSize={pageSize}
            pageIndex={pageIndex}
            drugItemTag={drugItemTag}
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

export default withRouter(connect(mapStateToProps)(DrugItemOverView));
