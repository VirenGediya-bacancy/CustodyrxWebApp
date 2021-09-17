import React, { Component } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import ReactTable from "react-table-6";
import { AllList } from "./DropDown";
import OverviewHeader from "./Overview/OverviewHeader";
import OverviewProductTabs from "./OverviewProductTabs";
import Pagination from "./Pagination";

export class ProductTableOverview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      selectedItem: "",
    };
  }

  toggleFilter = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };

  getUserDetails = (Id) => {
    this.props.handleGetUserDetails(Id);
  };

  render() {
    let {
      name,
      history,
      tableData,
      addButtonURl,
      selectedItem,
      pageIndex,
      pageSize,
      total,
      onPageSizeChange,
      onPageChange,
      onSortedChange,
      handleSelect,
      handleTrProps,
      handleTdProps,
      tableCol,
    } = this.props;

    const { dropdownOpen, handleSelectDropDown } = this.state;
    let columns = [
      {
        width: "auto",
        Header: `${name} Name`,
        Cell: ({ row }) => <div>{row._original.name}</div>,
        accessor: "name",
      },
    ];
    return (
      <Col lg={`${tableCol} quick-navigation`}>
        <Col lg="12" className="drug-detail-table-inner-actions overview_table">
          <Col lg="8" md="6" sm="4">
            <AllList
              name={name}
              selectedItem={selectedItem}
              handleSelect={handleSelect}
              // categoryStatus={categoryStatus}
              // list={activeCategories}
              dropdownOpen={dropdownOpen}
              toggleFilter={this.toggleFilter}
            />
          </Col>
          <Col lg="4" md="3" sm="2" className="table-inner-actions">
            <div>
              <Button
                onClick={() => history.push(addButtonURl)}
                variant="primary"
              >
                New
              </Button>
            </div>
            <div className="sync">
              <a href="#" onClick={this.sync}>
                <i className="fas fa-sync"></i>
              </a>
            </div>
          </Col>
        </Col>
        <Container fluid className="table">
          <Row>
            <Col md="">
              <ReactTable
                manual
                data={tableData}
                columns={columns}
                onSortedChange={onSortedChange}
                pageSize={pageSize}
                loadingText={`Loading the ${name}`}
                noDataText={`Couldn't find ${name}`}
                onPageSizeChange={onPageSizeChange}
                onPageChange={onPageChange}
                pages={Math.ceil(total / pageSize)}
                page={pageIndex}
                getTdProps={(state, rowInfo, column, instance) => ({
                  onClick: () => {
                    if (rowInfo && column.id !== "check") {
                      handleTdProps(rowInfo);
                    }
                  },
                })}
                getTrGroupProps={(state, rowInfo) => {
                  if (rowInfo !== undefined) {
                    return handleTrProps(rowInfo);
                  }
                }}
              />
              <Pagination total={total} currentPage={pageIndex+1} pageSize={pageSize} />
            </Col>
          </Row>
        </Container>
      </Col>
    );
  }
}

export default withRouter(ProductTableOverview);
