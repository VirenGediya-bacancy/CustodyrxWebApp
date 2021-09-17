import React from "react";
import ReactTable from "react-table-6";
import { Container, Button, Row, Col } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { saveAs } from "file-saver";
import AddAssetServiceHistory from "./AddAssetServiceHistory";
import EditAssetServiceHistory from "./EditAssetServiceHistory";
import { getDateTime } from "commonMethod/common";
import AssetItemServices from "service/AssetItemServices";
import Pagination from "commonComponents/Pagination"
import "react-table-6/react-table.css";
import moment from "moment";

class AssetServiceHistoryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 10,
      pageIndex: 0,
      itemTagId: "",
      show: false,
      editShow: false,
      searchKeyword: "",
      initialData: [],
      dropdownOpen: false,
      selectStartDate: "",
      selectEndDate: "",
      openAttachmentPopUp : false
    };
  }

  handleAttachmentsPopup = (e, id) => {
    this.setState({ editShow: !this.state.editShow, itemTagId: id });
    this.setState({
      editShow: !this.state.editShow,
      itemTagId: id,
      openAttachmentPopUp : true
    })
  }

  toggleFilter = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };

  getAllServiceEventList = () => {
    const { asset_item_tag_id } = this.props;
    let obj = {
      itemId: asset_item_tag_id,
    };
    this.props.getAllServiceEventList(obj);
  };
  /**
   * Perform network request to get AssetServiceHistoryList data
   */
  componentDidMount() {
    this.getAllServiceEventList();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.asset_id !== prevProps.asset_id) {
      this.getAllServiceEventList();
    }
  }

  toggleModal = () => {
    this.setState({ show: !this.state.show });
  };

  toggleEditModal = () => {
    this.setState({ editShow: !this.state.editShow, openAttachmentPopUp: false });
  };
  /**
   *  When user click on column this will sorting the table data
   * @param {*} sorted
   */
  onSortedChange = (sorted) => {
    Table.sort = sorted;
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
    AssetServiceHistoryList.sort = sorted;
  };

  /**
   * Call back for the page changes
   * @param {*} pageIndex
   */

  onPageChange = (pageIndex) => {
    this.setState({ pageIndex });
  };

  onEdit = (e, id) => {
    let {assetServiceHistoryList} = this.props;
    let editAttach = assetServiceHistoryList.filter(file => file.GUID === id);
    this.setState({ editShow: !this.state.editShow, itemTagId: id, openAttachmentPopUp: false });
  };

  onDelete = (e, id) => {
    this.props.deleteAssetSeviceEvent(id).then((res) => {
      this.getAllServiceEventList();
    });
  };

  handleDownload = async (url, name) => {
   const blobImage = await fetch(url)
      .then(r => r.blob())
      .catch((error) => console.log(error));
      
      if(blobImage)
      saveAs(blobImage, name);
  }

  render() {
    const columns = [
      {
        width: 230,
        Header: "Event Time",
        accessor: "eventTime",
        // Cell: ({ row }) => (<span>{row._original.eventTime && getDateTime(row._original.eventTime)}</span>)
        Cell: ({ row }) => {
          return (<span>{row._original.eventTime && getDateTime(row._original.eventTime)}</span>) }
      },
      {
        width: 200,
        Header: "Service Technician",
        accessor: "serviceTechnician",
      },
      {
        width: 200,
        Header: "Comments",
        accessor: "comments",
      },
      {
        width: 120,
        Header: "Cost",
        accessor: "cost",
      },
      {
        width: 200,
        Header: "Attachment",
        accessor: "attachments",
        Cell: ({ row }) => {
          return <span>{row.attachments.length}</span>

          // return row.attachments.map((img) => (
          //   <span 
          //     className="ml-3 text-primary" 
          //     onClick={() => this.handleDownload(img.item, img.name)}>
          //     {img.name}
          //   </span>
          // ));
        },
      },
      {
        width: 120,
        Header: "Action",
        accessor: "id",
        Cell: ({ row }) => (
          <div className="drug-item-table-action">
            <i
              className="fas fa-edit text-info ml-3"
              onClick={(e) => this.onEdit(e, row._original.GUID)}
            ></i>{" "}
            <i
              className="fas fa-trash text-danger ml-3"
              onClick={(e) => this.onDelete(e, row._original.GUID)}
            ></i>{" "}  
          </div>
        ),
      },
    ];

    const {
      asset_id,
      assetServiceHistoryList,
      updateAssetServiceEvent,
      updateAttachments,
      asset_item_tag_id,
      addAssetServiceEvent,
      getAllServiceEventList,
      getOneAssetServiceEvent,
    } = this.props;

    const {
      pageSize,
      pageIndex,
      show,
      itemTagId,
      editShow,
      openAttachmentPopUp
    } = this.state;
    
    return (
      <>
        <div className="drug-detail-tag-title">
          <Button
            className="addItemBtn"
            variant="primary"
            onClick={(e) => this.setState({ show: true })}
          >
            Add Service Event
          </Button>
        </div>
        {show &&
          <AddAssetServiceHistory
            asset_id={asset_item_tag_id}
            show={show}
            toggleModal={this.toggleModal}
            addAssetServiceEvent={addAssetServiceEvent}
            getAllServiceEventList={getAllServiceEventList}
            assetServiceHistoryList={assetServiceHistoryList}
            pageSize={pageSize}
            pageIndex={pageIndex}
          />}

        <Container fluid className="table">
          <Row>
            <Col md="">
              <ReactTable
                data={assetServiceHistoryList}
                columns={columns}
                onSortedChange={this.onSortedChange}
                defaultPageSize={pageSize}
                loadingText="Loading the drugs"
                noDataText="Couldn't find service event history data"
                onPageSizeChange={this.onPageSizeChange}
                onPageChange={this.onPageChange}
                onSortedChange={this.onSortedChange}
                getTrGroupProps={(state, rowInfo,) => {
                  if (rowInfo !== undefined) {
                    return {
                      style: {
                        background: rowInfo.index % 2 ? '#fffff' : '#F5F5F5'
                      },
                      className: "table-row"
                    }
                  }
                }}
              />
              {assetServiceHistoryList.length > 0 && (
              <Pagination pageSize={pageSize} currentPage={pageIndex+1} 
              total={assetServiceHistoryList.length} />
              )}
            </Col>
          </Row>
          {this.state.editShow &&
            <EditAssetServiceHistory
              openAttachmentPopUp ={openAttachmentPopUp}
              asset_id={asset_item_tag_id}
              itemTagId={itemTagId}
              editShow={editShow}
              toggleEditModal={this.toggleEditModal}
              updateAttachments={updateAttachments}
              updateAssetServiceEvent={updateAssetServiceEvent}
              getAllServiceEventList={getAllServiceEventList}
              getOneAssetServiceEvent={getOneAssetServiceEvent}
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
  return {
    assetServiceHistoryList:
      state.assetSeviceHistoryListReducer.assetServiceHistoryList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllServiceEventList: (obj) =>
      dispatch(AssetItemServices.getAllServiceEventList(obj)),
    deleteAssetSeviceEvent: (id) =>
      dispatch(AssetItemServices.deleteAssetSeviceEvent(id)),
    addAssetServiceEvent: (formData) =>
      dispatch(AssetItemServices.addAssetServiceEvent(formData)),
    getOneAssetServiceEvent: (id) =>
      dispatch(AssetItemServices.getAssetServiceEventDetails(id)),
    updateAssetServiceEvent: (id, formData) =>
      dispatch(AssetItemServices.updateAssetServiceEvent(id, formData)),
    updateAttachments : (formData) =>
      dispatch(AssetItemServices.updateAttachments(formData))
  };
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AssetServiceHistoryList)
);
