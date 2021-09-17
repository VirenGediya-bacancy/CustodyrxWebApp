import React from 'react';
import ReactTable from 'react-table-6';
import { withRouter } from "react-router";
import 'react-table-6/react-table.css';
import { Container, Row, Col } from "react-bootstrap";
import CategoryChip from "./categoryChips";
import { getTime, getDateColor } from 'commonMethod/common';
import Pagination from "./Pagination";

class DisaposableTable extends React.Component {
    disposable = [];
    constructor(props) {
        super(props);
    }

    createAndReturnCheckBox = () => {
        return (this.props.disposable?.length > 0) ?
            this.props.disposable.map((data) => {
                data['check'] = (
                    <div style={{ 'textAlign': 'center' }}>
                        <input type="checkbox" name={data.GUID}
                            checked={this.props.selectedIdProps.includes(data.GUID)}
                            onChange={(event) => this.handleClickGroup(data.GUID)} />
                    </div>
                )
                return data;
            })
            : []
    }


    // Filter the data based on user search
    getPosts = () => {
        let { searchKeyword, columns } = this.props;
        let allTrueColumns = {};
        columns.map(item => {
            allTrueColumns[item.accessor] = item.checked
        });
        const list = this.createAndReturnCheckBox();
        const filteredList = searchKeyword && searchKeyword !== '' && list.length > 0 ? list.filter((post) => {
            return post.name.toLowerCase().startsWith(searchKeyword.toLowerCase())
                || (allTrueColumns.manufacturer && post.manufacturer.toLowerCase().startsWith(searchKeyword.toLowerCase()))
                || (allTrueColumns.UNSPSCCode && post.UNSPSCCode.toLowerCase().startsWith(searchKeyword.toLowerCase()))
                || (allTrueColumns.productCode && post.productCode.toLowerCase().startsWith(searchKeyword.toLowerCase()))
                || (allTrueColumns.modelNumber && post.modelNumber.toString().toLowerCase().startsWith(searchKeyword.toLowerCase()))
                || (allTrueColumns.brand && post.brand.toLowerCase().startsWith(searchKeyword.toLowerCase()))
                || (allTrueColumns.description && post.description.toLowerCase().startsWith(searchKeyword.toLowerCase()))
                || (post.productCategory.find(item => item.name.toLowerCase().startsWith(searchKeyword.toLowerCase())))
        }) : list;
        this.disposables = filteredList;
        return filteredList;
    }

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

        if (list.length !== this.props.disposable.length) {
            this.props.getMultiSelected(false);
        } else {
            this.props.getMultiSelected(true);
        }

        this.props.getSelectedIds(list);
    }

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
            const list = this.disposables.slice(pageSize * pageIndex, pageSize * (pageIndex + 1));
            ids = list.map((disposable) => {
                return disposable.GUID
            })
        }
        this.props.getMultiSelected(!this.props.isMultiSelectedProps)
        this.props.getSelectedIds(ids);
    }

    /**
     *  Return the selected pageSize
     * @param {*} pageSize 
     * @param {*} pageIndex 
     */
    onPageSizeChange = (pageSize, pageIndex) => {
        this.props.onPageSizeChange(pageSize, pageIndex);
    }

    onPageChange = (pageIndex) => {
        this.props.onPageChange(pageIndex);
    }

    onSortedChange = (sorted) => {
        const { pageSize, pageIndex } = this.props;
        const { id, desc } = sorted[0];
        let obj = {
            rows: pageSize,
            page: pageIndex,
            productType: 'disposable',
            field: id,
            sortOrder: desc ? 'DESC' : 'ASC',
        };
        this.props.getDisposableList(obj);
        // }
    }

    render() {
        const { columns, pages, total, currentPage, pageSize, pageIndex } = this.props;

        let disposableColumns = [
            {
                width: 40,
                accessor: "check",
                Header:
                    <input type="checkbox"
                        name='multi-select-box'
                        disabled={this.getPosts().length === 0}
                        checked={this.props.isMultiSelectedProps || (this.props.disposable?.length > 0 &&
                            this.props.selectedIdProps.length === this.props.disposable.length)}
                        onChange={this.handleMultiSelect} />,
                sortable: false,
                filterable: false,
            },
        ];

        this.props.columns.map(item => {
            let tableColumn = {}
            if (item.checked) {
                if (item.header === 'Name') {
                    tableColumn = {
                        className: "column_width",
                        Header: item.header,
                        accessor: item.accessor,
                        Cell: ({ row }) => (
                            <div>{row._original.name}</div>
                        )
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
                    };
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
                } else if (item.header === 'Next Expiry') {
                    tableColumn = {
                        className: "column_width",
                        Header: item.header,
                        // sortable: false,
                        accessor: item.accessor,
                        Cell: ({ row }) =>
                        (<span
                            className={
                                row._original.expiryDate &&
                                (getDateColor(row._original.expiryDate, 2)
                                    ? "expiryRed"
                                    : getDateColor(row._original.expiryDate, 5)
                                        ? "expiryYellow"
                                        : "expiryBlack")
                            }
                        >
                            {row._original.expiryDate &&
                                getTime(row._original.expiryDate)}
                        </span>)
                    }
                }
                else {
                    tableColumn = {
                        className: "column_width",
                        Header: item.header,
                        accessor: item.accessor,
                    }
                }
            }
            disposableColumns.push(tableColumn);
        });
        let newDisposableColumn = [...disposableColumns.filter(item => Object.keys(item).length > 0)];
        return (

            <Container fluid>
                <Col md="">
                    <ReactTable
                        manual
                        columns={newDisposableColumn}
                        onSortedChange={this.onSortedChange}
                        pageSize={this.props.pageSize}
                        loadingText="Loading the disposable"
                        noDataText="Couldn't find disposable"
                        data={this.getPosts()}
                        pages={Math.ceil(pages)}
                        page={this.props.pageIndex}
                        onPageSizeChange={this.props.onPageSizeChange}
                        onPageChange={this.props.onPageChange}
                        getTdProps={(state, rowInfo, column, instance) => ({
                            onClick: () => {
                                if (rowInfo && column.id !== 'check') {
                                    this.props.history.push({
                                        pathname: `/disposable/${rowInfo.original.GUID}`,
                                        state: {
                                            disposableName: rowInfo.original.name
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

export default withRouter(DisaposableTable);