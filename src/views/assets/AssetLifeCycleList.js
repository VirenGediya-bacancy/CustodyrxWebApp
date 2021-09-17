import React from "react";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import { Container, Row, Col } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import AssetsService from "../../service/AssetsService";
import Pagination from "commonComponents/Pagination";
import {getDateTime} from "commonMethod/common";

class AssetLifeCycleList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 10,
      pageIndex: 0,
      initialData: [],
    };
  }

  getAllLifeCycleList = () => {
    const { asset_item_tag_id } = this.props;
    let obj = {
      itemTagId: asset_item_tag_id,
    };
    this.props.getAllLifeCycleList(obj);
  };
  /**
   * Perform network request to get AssetLifeCycleList data
   */
  componentDidMount() {
    this.getAllLifeCycleList();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.asset_item_tag_id !== prevProps.asset_item_tag_id) {
      this.getAllLifeCycleList();
    }
  }

  /**
   *  When user click on column this will sorting the table data
   * @param {*} sorted
   */

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
    AssetLifeCycleList.sort = sorted;
  };

  /**
   * Call back for the page changes
   * @param {*} pageIndex
   */

  onPageChange = (pageIndex) => {
    this.setState({ pageIndex });
  };

  render() {
    const columns = [
      {
        width: 230,
        Header: "Time Stamp",
        accessor: "eventTime",
        Cell: ({ row }) => (<span>{row._original.eventTime && 
          getDateTime(row._original.eventTime)
        }</span>)
      },
      {
        width: 200,
        Header: "Person",
        accessor: "person",
      },
      {
        width: 200,
        Header: "Old Status",
        accessor: "oldStatus",
      },
      {
        width: 120,
        Header: "New Status",
        accessor: "newStatus",
      },
    ];

    const { assetLifeCycleList } = this.props;
    const {pageSize, pageIndex} = this.state;

    let lifeCycleList = assetLifeCycleList.data ?
      assetLifeCycleList.data.map(list => {
        return list
      }) : ''

    return (
      <>
        <Container fluid className="table">
          <Row>
            <Col md="">
              <ReactTable
                data={lifeCycleList || []}
                columns={columns}
                onSortedChange={this.onSortedChange}
                defaultPageSize={pageSize}
                loadingText="Loading the assets"
                noDataText="Couldn't find asset life cycle data"
                onPageSizeChange={this.onPageSizeChange}
                onPageChange={this.onPageChange}
                onSortedChange={this.onSortedChange}
                getTrGroupProps={(state, rowInfo, column, instance) => {
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
              {lifeCycleList !== "" && (
               <Pagination pageSize={pageSize} currentPage={pageIndex+1} 
              total={lifeCycleList.length} />
              )}
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    assetLifeCycleList: state.assetLifeCycleListReducer.assetLifeCycleList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllLifeCycleList: (obj) =>
      dispatch(AssetsService.getAllLifeCycleList(obj)),
  };
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AssetLifeCycleList)
);
