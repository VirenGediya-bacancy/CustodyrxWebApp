import React from "react";
import ReactTable from "react-table-6";
import { withRouter } from "react-router";
import "react-table-6/react-table.css";
import { Container, Row, Col } from "react-bootstrap";
import CategoryChip from "./categoryChips";
import Pagination from "./Pagination";
import { getTime, getDateColor } from "commonMethod/common";

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: -1,
      selectedRows: [],
    };
  }

  createAndReturnCheckBox = () => {
    return this.props.drugs?.length > 0
      ? this.props.drugs.map((data) => {
        data["check"] = (
          <div style={{ textAlign: "center" }}>
            <input
              type="checkbox"
              name={data.GUID}
              checked={this.props.selectedIdProps.includes(data.GUID)}
              onChange={(event) => this.handleClickGroup(data.GUID)}
            />
          </div>
        );
        return data;
      })
      : [];
  };

  // Filter the data based on user search
  getPosts = () => {
    let { searchKeyword, columns } = this.props;
    let allTrueColumns = {};

    columns.map((item) => {
      allTrueColumns[item.accessor] = item.checked;
    });
    const list = this.createAndReturnCheckBox();
    const filteredList =
      searchKeyword !== ""
        ? list.filter((post) => {
          // return  post.id.toString() === searchKeyword
          return (
            post.name.toLowerCase().startsWith(searchKeyword.toLowerCase()) ||
            (allTrueColumns.manufacturer &&
              post.manufacturer
                .toLowerCase()
                .startsWith(searchKeyword.toLowerCase())) ||
            (allTrueColumns.UNSPSCCode &&
              post.UNSPSCCode.toLowerCase().startsWith(
                searchKeyword.toLowerCase()
              )) ||
            (allTrueColumns.description &&
              post.description
                .toLowerCase()
                .startsWith(searchKeyword.toLowerCase())) ||
            (allTrueColumns.dossage &&
              post.dossage
                .toLowerCase()
                .startsWith(searchKeyword.toLowerCase())) ||
            (allTrueColumns.ndc &&
              post.ndc
                .toLowerCase()
                .startsWith(searchKeyword.toLowerCase())) ||
            (allTrueColumns.productCode &&
              post.productCode
                .toLowerCase()
                .startsWith(searchKeyword.toLowerCase())) ||
            (post.productCategory.find(item => item.name.toLowerCase().startsWith(searchKeyword.toLowerCase())))
          );
        })
        : list;
    this.drugs = filteredList;
    return filteredList;
  };

  /**
   * Handle check box onchange event
   * @param {*} id
   */
  handleClickGroup = (id) => {
    let list = [...this.props.selectedIdProps];
    const isPresent = list.includes(id);
    let ids = [];
    if (isPresent) {
      const index = list.indexOf(id);
      list.splice(index, 1);
    } else {
      list.push(id);
    }

    if (list.length !== this.props.drugs.length) {
      this.props.getMultiSelected(false);
    } else {
      this.props.getMultiSelected(true);
    }

    this.props.getSelectedIds(list);
  };

  /**
   * Handle check box onchange event
   * @param {*} id
   */
  handleMultiSelect = () => {
    const { pageIndex, pageSize } = this.props;
    let ids = [];
    if (this.props.isMultiSelectedProps) {
      ids = [];
    } else {
      const list = this.drugs.slice(
        pageSize * pageIndex,
        pageSize * (pageIndex + 1)
      );
      ids = list && list.map((drugs) => {
        return drugs.GUID;
      });
    }

    this.props.getMultiSelected(!this.props.isMultiSelectedProps);
    this.props.getSelectedIds(ids);
  };

  /**
   *  When user click on column this will sorting the table data
   * @param {*} sorted
   */
  onSortedChange = (sorted) => {
    const { pageSize, pageIndex } = this.props;
    const { id, desc } = sorted[0];

    // if (id !== 'category') {
    let obj = {
      rows: pageSize,
      page: pageIndex,
      productType: 'drug',
      field: id,
      sortOrder: desc ? "DESC" : "ASC",
    };
    this.props.getDrugList(obj);
    // }
  };

  render() {
    const { columns, pages, total, currentPage, pageSize, pageIndex } = this.props;
  
    let drugsColumns = [];
    let drugCheckbox = {
      width: 40,
      accessor: "check",
      Header: (
        <input
          type="checkbox"
          name="multi-select-box"
          disabled={this.getPosts().length === 0}
          checked={this.props.isMultiSelectedProps ||
            (this.props.drugs &&
              this.props.drugs.length > 0 &&
              this.props.selectedIdProps.length === this.props.drugs.length)}
          onChange={this.handleMultiSelect}
        />
      ),
      sortable: false,
      filterable: false,
    };
    drugsColumns.push(drugCheckbox);

    columns.forEach((item) => {
      if (item.checked) {
        let tableColumn;
        if (item.header === "Name") {
          tableColumn = {
            className: "column_width",
            Header: item.header,
            accessor: item.accessor,
            Cell: ({ row }) => (
              <div>{row._original.name}</div>
            ),
          };
          // } else if (item.header === "Status") {
          //   tableColumn = {
          //     width: 120,
          //     Header: item.header,
          //     accessor: item.accessor,
          //     Cell: ({ row }) => (
          //       <span>{row._original.isActive ? "Active" : "In-Active"}</span>
          //     ),
          //   };
        } else if (item.header === "Categories") {
          tableColumn = {
            className: "column_width",
            Header: item.header,
            accessor: item.accessor,
            Cell: ({ row }) => {
              return row._original.productCategory.map((item) => (
                <CategoryChip name={item.name} />
              ));
            },
            sortable: false,
          };
        } else if (item.header === "Image") {
          tableColumn = {
            width: 120,
            Header: item.header,
            accessor: item.accessor,
            Cell: ({ row }) => (
              <span className="table-image">
                {row._original.image ? (
                  <img src={row._original.image} />
                ) : (
                  <img src="https://fakeimg.pl/640x360"></img>
                )}
              </span>
            ),
          };
        } else if (item.header === "Next Expiry") {
          tableColumn = {
            className: "column_width",
            Header: item.header,
            accessor: item.accessor,
            Cell: ({ row }) => (
              <span
                className={
                  row._original.expiryDate &&
                  (getDateColor(row._original.expiryDate,2)
                  ? "expiryRed"
                  : getDateColor(row._original.expiryDate,5)
                    ? "expiryYellow"
                    : "expiryBlack")
                }
              >
                {row._original.expiryDate &&
                 getTime(row._original.expiryDate)}
              </span>
            ),
          };
        }
        else {
          tableColumn = {
            className: "column_width",
            Header: item.header,
            accessor: item.accessor,
          };
        }
        drugsColumns.push(tableColumn);
      }
    });

    return (
      <Container fluid>
        <Col md="">
          <ReactTable
            manual
            data={this.getPosts()}
            pages={Math.ceil(pages)}
            columns={drugsColumns}
            onSortedChange={this.onSortedChange}
            pageSize={this.props.pageSize}
            loadingText="Loading the drugs"
            noDataText="Couldn't find drugs"
            page={this.props.pageIndex}
            onPageSizeChange={this.props.onPageSizeChange}
            onPageChange={this.props.onPageChange}
            getTdProps={(state, rowInfo, column, instance) => ({
              onClick: () => {
                if (rowInfo && column.id !== "check") {
                  this.props.history.push({
                    pathname: `/drug/${rowInfo.original.GUID}`,
                    state: {
                      drugName: rowInfo.original.name,
                    },
                  });
                }
              },
            })}
            getTrGroupProps={(state, rowInfo, column, instance) => {
              if (rowInfo !== undefined) {
                return {
                  style: {
                    color: !rowInfo.original.isActive && "gray",
                    background:
                      this.props.selectedIdProps.includes(
                        rowInfo.original.GUID
                      ) && "#EBECF0",
                    background: rowInfo.index % 2 ? '#fffff' : '#F5F5F5'
                  },
                  className: "table-row"
                };
              }
            }}
          />
          <Pagination total={total} pageSize={pageSize} currentPage={currentPage} />
        </Col>
      </Container>
    );
  }
}

export default withRouter(Table);
