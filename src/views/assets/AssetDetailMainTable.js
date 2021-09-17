import React from 'react';
import ReactTable from 'react-table-6'
import 'react-table-6/react-table.css'
import { Container, Row, Col } from "react-bootstrap";
import Pagination from 'commonComponents/Pagination';

class AssetDetailMainTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageSize: 10,
            pageIndex: 0,
        }
    }

    getAssets = () => {
        const { pageSize, pageIndex } = this.props;
        let obj = {
            rows: pageSize,
            page: pageIndex,
            field: "name",
            sortOrder: "ASC",
            productType: "asset"
        };
        this.props.getAssetsList(obj);
    }

    /**
     * Perform network request to get DrugItemList data
     */
    componentDidMount() {
        this.props.assetList.length === 0 && this.getAssets();
    }

    /**
     *  When user click on column this will sorting the table data
     * @param {*} sorted 
     */
    onSortedChange = (sorted) => {
        AssetDetailMainTable.sort = sorted;
        const { pageSize, pageIndex } = this.props;
        const { id, desc } = sorted[0];
        let obj = {
            rows: pageSize,
            page: pageIndex,
            field: "name",
            productType: "asset",
            sortOrder: desc ? 'DESC' : 'ASC',
        };
        this.props.getAssetsList(obj);
    }
    /**
     *  Return the selected pageSize
     * @param {*} pageSize 
     * @param {*} pageIndex 
     */
    onPageSizeChange = async (pageSize) => {
        await this.props.changePageSize(pageSize);
        this.getAssets();
        // this.setState({pageSize, pageIndex});
    }

    onPageChange = async (pageIndex) => {
        await this.props.changePage(pageIndex);
        this.getAssets();
    }

    render() {
        const { total, pageSize, assetList, pageIndex } = this.props;
       
        return (
            <>
            <ReactTable
                manual
                data={assetList}
                columns={this.props.columns}
                onSortedChange={this.onSortedChange}
                pageSize={pageSize}
                loadingText="Loading the assets"
                noDataText="Couldn't find assets"
                onPageSizeChange={this.onPageSizeChange}
                onPageChange={this.onPageChange}
                onSortedChange={this.onSortedChange}
                pages={Math.ceil(total / pageSize)}
                page={pageIndex}
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
                getTrGroupProps={(state, rowInfo) => {
                    if (rowInfo !== undefined) {
                        return {
                            style: {
                                background: (rowInfo.original.GUID === this.props.asset_id && '#EBECF0'),
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

export default AssetDetailMainTable;