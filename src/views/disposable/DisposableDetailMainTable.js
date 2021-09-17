import React from 'react';
import ReactTable from 'react-table-6'
import 'react-table-6/react-table.css'
import { Container, Row, Col } from "react-bootstrap";
import Pagination from 'commonComponents/Pagination';

class DisposableDetailMainTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageSize: 10,
            pageIndex: 0,
        }
    }

    getDisposable = () => {
        const { pageSize, pageIndex } = this.props;
        let obj = {
            rows: pageSize,
            page: pageIndex,
            field: "name",
            sortOrder: "ASC",
            productType: "disposable"
        };
        this.props.getDisposableList(obj);
    }

    /**
     * Perform network request to get DisposableItemList data
     */
    componentDidMount() {
        this.props.disposables.length === 0 && this.getDisposable();
    }

    /**
     *  When user click on column this will sorting the table data
     * @param {*} sorted 
     */
    onSortedChange = (sorted) => {
        DisposableDetailMainTable.sort = sorted;
        const { pageSize, pageIndex } = this.props;
        const { id, desc } = sorted[0];
        let obj = {
            rows: pageSize,
            page: pageIndex,
            field: 'name',
            productType: "disposable",
            sortOrder: desc ? 'DESC' : 'ASC',
        };
        this.props.getDisposableList(obj);
    }
    /**
     *  Return the selected pageSize
     * @param {*} pageSize 
     * @param {*} pageIndex 
     */
    onPageSizeChange = async (pageSize) => {
        await this.props.changePageSize(pageSize);
        this.getDisposable();
    }

    onPageChange = async (pageIndex) => {
        await this.props.changePage(pageIndex);
        this.getDisposable();
    }

    render() {
        const { pageSize, total, pageIndex } = this.props;
        return (
            <>
            <ReactTable
                manual
                data={this.props.disposables}
                columns={this.props.columns}
                pageSize={pageSize}
                loadingText="Loading the disposable"
                noDataText="Couldn't find disposable"
                onPageSizeChange={this.onPageSizeChange}
                onPageChange={this.onPageChange}
                onSortedChange={this.onSortedChange}
                pages={Math.ceil(total / pageSize)}
                page={pageIndex}
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

                getTrGroupProps={(state, rowInfo) => {
                    if (rowInfo !== undefined) {
                        return {
                            style: {
                                background: (rowInfo.original.GUID === this.props.disposable_id && '#EBECF0'),
                            },
                            className: "table-row"
                        }
                    }
                }
                }
            />
            <Pagination total={total} pageSize={pageSize} currentPage={pageIndex+1} />
            </>
        )
    }
}

export default DisposableDetailMainTable;