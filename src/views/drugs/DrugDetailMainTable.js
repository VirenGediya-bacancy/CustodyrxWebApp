import React from "react";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import { Container, Row, Col } from "react-bootstrap";
import { withRouter } from "react-router";
import Pagination from "commonComponents/Pagination";

class DrugDetailMainTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 10,
      pageIndex: 0,
    };
  }

  getDrugs = () => {
    const { pageSize, pageIndex } = this.props;
    let obj = {
      rows: pageSize,
      page: pageIndex,
      field: "name",
      sortOrder: "ASC",
      productType: "drug"
    };
    this.props.getDrugList(obj);
  }

  /**
   * Perform network request to get DrugItemList data
   */
  componentDidMount() {
    this.props.drugList.length === 0 && this.getDrugs();
  }


  /**
   *  When user click on column this will sorting the table data
   * @param {*} sorted
   */
  onSortedChange = (sorted) => {
    DrugDetailMainTable.sort = sorted;
    const { pageSize, pageIndex } = this.props;
    const { id, desc } = sorted[0];
    let obj = {
      rows: pageSize,
      page: pageIndex,
      field: "name",
      productType: "drug",
      sortOrder: desc ? 'DESC' : 'ASC',
    };
    this.props.getDrugList(obj);
  };
  /**
   *  Return the selected pageSize
   * @param {*} pageSize
   * @param {*} pageIndex
   */
  onPageSizeChange = async (pageSize) => {
    await this.props.changePageSize(pageSize);
    this.getDrugs();
    // this.setState({pageSize, pageIndex});
  };

  onPageChange = async (pageIndex) => {
    await this.props.changePage(pageIndex);
    this.getDrugs();
  };

  render() {
    const { pageSize, total, pageIndex, drugList } = this.props;
    return (
      <>
        <ReactTable
          manual
          data={drugList}
          pages={Math.ceil(total / pageSize)}
          columns={this.props.columns}
          onSortedChange={this.onSortedChange}
          pageSize={pageSize}
          loadingText="Loading the drugs"
          noDataText="Couldn't find drugs"
          page={pageIndex}
          onPageSizeChange={this.onPageSizeChange}
          onPageChange={this.onPageChange}
          onSortedChange={this.onSortedChange}
          getTdProps={(state, rowInfo, column, instance) => ({
            onClick: () => {
              if (rowInfo && column.id !== 'check') {
                this.props.history.push({
                  pathname: `/drug/${rowInfo.original.GUID}`,
                  state: {
                    drugName: rowInfo.original.name
                  }
                })
              }
            }
          })}
          getTrGroupProps={(state, rowInfo) => {
            if (rowInfo !== undefined) {
              return {
                style: {
                  background: (rowInfo.original.GUID === this.props.drug_id && '#EBECF0'),
                },
                className: "table-row"
              }
            }
          }
          }
        />
        <Pagination total={total} pageSize={pageSize} currentPage={pageIndex+1} />
      </>
    );
  }
}

export default withRouter(DrugDetailMainTable);
