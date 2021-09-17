import React, { Component } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { withRouter } from "react-router";
import ReactTable from "react-table-6";
import AssetsColumnSelector from "./AssetsColumnSelector";
import { AllList } from "./DropDown";
import { BulkAction } from "./ItemDropDown";
import { makeTableColumns } from "./MainTableColumn";
import Pagination from "commonComponents/Pagination";

export class MainListingHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      columnModal: false,
      selectedItem: "",
      categoryStatus: "",
    };
  }

  clearFilter = () => {
    this.setState({
      selectedItem: "",
      categoryStatus: "",
    });
  };

  getColumns = async (column) => {
    const { columnName } = this.props;
    localStorage.setItem(columnName, JSON.stringify(column));
    this.setState({
      columnModal: false,
    });
  };

  toggleFilter = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };

  handleColumnSelectorModal = () => {
    this.setState({ columnModal: !this.state.columnModal });
  };

  handleChecked = () => {
    return (
      this.props.isMultiSelectedProps ||
      (this.props.dataList?.length > 0 &&
        this.props.selectedIdProps.length === this.props.dataList.length) ||
      false
    );
  };

  handleMultiSelect = () => {
    const { pageIndex, getPosts, getMultiSelected, getSelectedIds, pageSize } =
      this.props;
    let ids = [];
    if (this.props.isMultiSelectedProps) {
      ids = [];
    } else {
      const list = getPosts().slice(
        pageSize * pageIndex,
        pageSize * (pageIndex + 1)
      );
      ids = list.map((product) => {
        return product.GUID;
      });
    }
    getMultiSelected(!this.props.isMultiSelectedProps);
    getSelectedIds(ids);
  };

  clearMultiselect = () => {
    const { getMultiSelected, getSelectedIds } = this.props;
    let ids = [];
    getMultiSelected(false);
    getSelectedIds(ids);
  }

  render() {
    const {
      addButtonText,
      addButtonURl,
      history,
      name,
      columnName,
      columnTitle,
      selectedIdProps,
      selectedItem,
      onRefreshPage,
      handleSelectAction,
      handleSelect,
      total,
      bulkActionOpen,
      toggleBulk,
      onSortedChange,
      onPageChange,
      onPageSizeChange,
      handleTdProps,
      handleTrProps,
      handleRedirect,
      tableData,
      module,
      pageIndex,
      pages,
      pageSize,
      getPosts,
    } = this.props;

    const { dropdownOpen, columnModal, categoryStatus } = this.state;
    let columns = JSON.parse(localStorage.getItem(columnName));
    let filterData = getPosts();
    let tableColumn = makeTableColumns(
      columns,
      filterData,
      this.handleMultiSelect,
      this.handleChecked
    );
    return (
      <div>
        <Row className="table-actions">
          <Col lg="4" md="3" sm="2">
            {selectedIdProps.length === 0 ? (
              <AllList
                name={name}
                selectedItem={selectedItem}
                handleSelect={handleSelect}
                categoryStatus={categoryStatus}
                // list={activeCategories}
                dropdownOpen={dropdownOpen}
                toggleFilter={this.toggleFilter}
              />
            ) : (
              <BulkAction
                userModule={true}
                handleSelectAction={handleSelectAction}
                bulkActionOpen={bulkActionOpen}
                toggleBulk={toggleBulk}
              />
            )}
          </Col>
          <Col lg="8" md="6" sm="4" className="table-inner-actions">
            <div>
              <Button
                onClick={() => handleRedirect(addButtonURl)}
                variant="primary"
              >
                {addButtonText}
              </Button>
            </div>
            <div className="sync">
              <a
                href="#"
                onClick={async () => {
                  await onRefreshPage();
                  this.clearFilter();
                  this.clearMultiselect()
                }}
              >
                <i className="fas fa-sync"></i>
              </a>
            </div>
            <div className="sync">
              <a href="#" onClick={this.handleColumnSelectorModal}>
                <i className="fas fa-cog"></i>
              </a>
            </div>
            {columnModal && (
              <AssetsColumnSelector
                show={columnModal}
                title={columnTitle}
                closeDialog={this.handleColumnSelectorModal}
                getColumns={this.getColumns}
                columns={columns}
              />
            )}
          </Col>
        </Row>
        <div className="drugs-main-table">
          <Container fluid>
            <Row>
              <Col md="">
                <ReactTable
                  manual
                  data={filterData}
                  columns={tableColumn}
                  onSortedChange={onSortedChange}
                  page={pageIndex}
                  pageSize={pageSize}
                  pages={Math.ceil(pages)}
                  loadingText={`Loading the ${name}`}
                  noDataText={`Couldn't find ${name}`}
                  onPageSizeChange={onPageSizeChange}
                  onPageChange={onPageChange}
                  getTdProps={(state, rowInfo, column, instance) => ({
                    onClick: () => {
                      if (rowInfo && column.id !== "check") {
                        handleTdProps(rowInfo)
                      }
                    },
                  })}
                  getTrGroupProps={(state, rowInfo, column, instance) => {
                    if (rowInfo !== undefined) {
                      return handleTrProps(rowInfo)
                    }
                  }}
                />
                <Pagination total={total} pageSize={pageSize} currentPage={pageIndex+1} />
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}

export default withRouter(MainListingHeader);
