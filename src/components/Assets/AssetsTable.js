import React, { Component } from 'react'
import { withRouter } from "react-router";
import { Col, Container } from 'react-bootstrap';
import ReactTable from 'react-table-6';
import CategoryChip from 'commonComponents/categoryChips';
import Pagination from 'commonComponents/Pagination';
import { getTime, getDateColor} from "commonMethod/common";

class AssetsContainerTable extends Component {
  Assets = [];
  constructor(props) {
    super(props);
  }

  createAndReturnCheckBox = () => {
    return (this.props.assetsList) ?
      this.props.assetsList.map((data) => {
        data['check'] = (
          <div style={{ 'textAlign': 'center' }}>
            <input type="checkbox" name={data.GUID}
              checked={this.props.selectedIdProps.includes(data.GUID)}
              onClick={(event) => this.handleClickGroup(data.GUID)} />
          </div>
        )
        return data;
      })
      : []
  }

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

    if (list.length !== this.props.assetsList.length) {
      this.props.getMultiSelected(false);
    } else {
      this.props.getMultiSelected(true);
    }

    this.props.getSelectedIds(list);
  }

  handleMultiSelect = () => {
    const { pageIndex, pageSize } = this.props;
    let ids = [];
    if (this.props.isMultiSelectedProps) {
      // const list = this.disposable.slice(pageSize * pageIndex, pageSize * (pageIndex + 1));
      ids = [];
    } else {
      const list = this.Assets.slice(pageSize * pageIndex, pageSize * (pageIndex + 1));
      ids = list.map((asset) => {
        return asset.GUID
      })
    }
    this.props.getMultiSelected(!this.props.isMultiSelectedProps)
    this.props.getSelectedIds(ids);
  }


  getPosts = () => {
    let { searchKeyword, columns } = this.props;
    let allTrueColumns = {};
    columns.map(item => {
      allTrueColumns[item.accessor] = item.checked
    });
    const list = this.createAndReturnCheckBox();

    const filteredList = (searchKeyword && searchKeyword !== '' && list.length > 0 ? list.filter((post) => {
      return post.name.toLowerCase().startsWith(searchKeyword.toLowerCase())
        || (allTrueColumns.manufacturer && post.manufacturer.toLowerCase().startsWith(searchKeyword.toLowerCase()))
        || (allTrueColumns.UNSPSCCode && post.UNSPSCCode.toLowerCase().startsWith(searchKeyword.toLowerCase()))
        || (allTrueColumns.productCode && post.productCode.toLowerCase().startsWith(searchKeyword.toLowerCase()))
        || (allTrueColumns.modelNumber && post.modelNumber.startsWith(searchKeyword.toLowerCase()))
        || (allTrueColumns.brand && post.brand.toLowerCase().startsWith(searchKeyword.toLowerCase()))
        || (allTrueColumns.description && post.description.toLowerCase().startsWith(searchKeyword.toLowerCase()))
        || (post.productCategory.find(item => item.name.toLowerCase().startsWith(searchKeyword.toLowerCase())))
      }) : list);
    this.Assets = filteredList;
    return filteredList;
  }

  /**
   *  When user click on column this will sorting the table data
   * @param {*} sorted
   */
  onSortedChange = (sorted) => {
    const { pageSize, pageIndex } = this.props;
    const { id, desc } = sorted[0];
    // if (id !== 'category') {
      const obj = {
        rows: pageSize,
        page: pageIndex,
        productType: 'asset',
        field: id,
        sortOrder: desc ? 'DESC' : 'ASC',
      };
      this.props.getAssetsList(obj);
    // }
  }

  render() {
    const { columns, total, pageSize, pageIndex, currentPage, pages} = this.props;

    let assetsColumn = [];
    let drugCheckbox = {
      width: 40,
      accessor: "check",
      Header: <input type="checkbox"
        name='multi-select-box'
        disabled={this.getPosts().length === 0}
        checked=
        {this.props.isMultiSelectedProps || (this.props.assetsList?.length > 0 &&
          this.props.selectedIdProps.length === this.props.assetsList.length)}
        onChange={this.handleMultiSelect} />,
      sortable: false,
      filterable: false,
    };
    assetsColumn.push(drugCheckbox);

    columns.forEach(item => {
      let tableColumn;
      if (item.checked) {
        if (item.header === 'Name') {
          tableColumn = {
            // width: 150,
            className: "column_width",
            Header: item.header,
            accessor: item.accessor,
            Cell: ({ row }) => (
              <div>{row._original.name}</div>
            ),
          }
        } else if (item.header === 'Status') {
          tableColumn = {
            width: 120,
            Header: item.header,
            accessor: item.accessor,
            Cell: ({ row }) => (<span>{row._original.isActive ? 'Active' : 'In-Active'}</span>)
          }
        }
        else if (item.header === 'Next Expiry') {
          tableColumn = {
            className: "column_width",
            Header: item.header,
            // sortable: false,
            accessor: item.accessor,
            Cell: ({ row }) =>
              <span
                className={
                  row._original.expiryDate &&
                  (getDateColor(row._original.expiryDate,2)
                  ? "expiryRed"
                  : getDateColor(row._original.expiryDate,5)
                    ? "expiryYellow"
                    : "expiryBlack")
                }>
                {row._original.expiryDate && 
                 getTime(row._original.expiryDate)}
              </span>
          }
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
          }
        } else if (item.header === "Image") {
          tableColumn = {
            width: 120,
            Header: item.header,
            accessor: item.accessor,
            Cell: ({ row }) => (
              <span className="table-image">
                {row._original.image ? <img src={row._original.image} /> :
                  <img src='https://fakeimg.pl/640x360'></img>
                }
              </span>
            ),
          };
        } 
        else {
          tableColumn = {
            // width: 120,
            className: "column_width",
            Header: item.header,
            accessor: item.accessor,
          }
        }
        assetsColumn.push(tableColumn);
      }
    });
  return (
    <Container fluid>
        <Col md="">
          <ReactTable
            manual
            data={this.getPosts()}
            columns={assetsColumn}
            onSortedChange={this.onSortedChange}
            page={this.props.pageIndex}
            pageSize={this.props.pageSize}
            pages={Math.ceil(pages)}
            loadingText="Loading the Assets"
            noDataText="Couldn't find Assets"
            onPageSizeChange={this.props.onPageSizeChange}
            onPageChange={this.props.onPageChange}
            getTdProps={(state, rowInfo, column, instance) => ({
              onClick: () => {
                if (rowInfo && column.id !== "check") {
                  this.props.history.push({
                    pathname: `/asset/${rowInfo.original.GUID}`,
                    state: {
                      assetName: rowInfo.original.name
                    }
                  })
                }
              }
            })}
            getTrGroupProps={(state, rowInfo, column, instance) => {
              if (rowInfo !== undefined) {
                return {
                  style: {
                    color: !rowInfo.original.isActive && "gray",
                    background: this.props.selectedIdProps.includes(rowInfo.original.GUID) && '#EBECF0',
                    background: rowInfo.index % 2 ? '#fffff' : '#F5F5F5'
                  },
                  className: "table-row"
                }
              }
            }
            }
          />
        <Pagination total={total} pageSize={pageSize} currentPage={currentPage} />
        </Col>
      </Container>
    )
  }
}

export default withRouter(AssetsContainerTable);