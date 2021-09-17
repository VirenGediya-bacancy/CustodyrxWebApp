import { UserMovementHistoryColumns } from "columns/MovementHistory";
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import ReactTable from "react-table-6";
import Pagination from "commonComponents/Pagination";

export class OverviewMovementHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      selectedItem: "",
    };
  }

  componentDidMount() {
    const { handleGetMovementHistory } = this.props;
    handleGetMovementHistory();
  }

  render() {
    let {
      name,
      movementList,
      onPageSizeChange,
      onPageChange,
      onSortedChange,
      pageIndex,
      pageSize,
      total,
      currentPage
    } = this.props;

    return (
      <>
        <ReactTable
          manual
          data={movementList}
          columns={UserMovementHistoryColumns}
          onSortedChange={onSortedChange}
          // pageSize={pageSize}
          loadingText={`Loading the ${name}`}
          noDataText={`Couldn't find ${name}`}
          onPageSizeChange={onPageSizeChange}
          onPageChange={onPageChange}
        />
        <Pagination total={total} pageSize={pageSize} currentPage={currentPage} />
      </>
    );
  }
}

export default withRouter(OverviewMovementHistory);
