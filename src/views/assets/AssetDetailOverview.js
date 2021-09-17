import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AssetItemListContainer from "../../container/Assets/AssetItemListContainer";
import {
  Button,
  Row,
  Col,
  Tabs,
  Tab,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import { Row as RowDetail } from "../../commonComponents/Row";
import Title from "../../commonComponents/Title";
import { Link, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import CloseButton from "commonComponents/closeButton";
import EditButton from "commonComponents/EditButton";
import { getTime, getDateColor } from "commonMethod/common";

class AssetDetailOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      key: 'overview'
    };
  }

  // Fetch data from server-end point
  componentDidMount() {
    const { state } = this.props && this.props.location
    if(state && state.isBack){
      this.setState({
        key: 'asset-list'
      })
    }else{
      this.setState({
        key: 'overview'
      })
    }
    this.props.getAsset(this.props.asset_id, "asset").then((res) => {
      if (res.length === 0) {
        this.props.history.push("/not-found");
      }
    });
  }

  // Fetch data from server-end point based on user click
  componentDidUpdate(prevProps, prevState) {
    if (this.props.asset_id !== prevProps.asset_id) {
      this.props.getAsset(this.props.asset_id, "asset");
      if(this.state.key !== 'overview'){
        this.setState({
          key: 'overview'
        })
      }
    }
  }

  onHandleMoreOperation = async (key) => {
    if (key === "markActive") {
      await this.props.editAssetStatus(
       [this.props.asset_id],
        !this.props.asset.isActive
      );
      await this.props.getAsset(this.props.asset_id, "asset");
    } else if (key === "delete") {
      await this.props.deleteAsset(this.props.asset_id);
      this.props.history.push("/assets");
    }
  };

  render() {
    const { asset_id, asset, assetName } = this.props;
    const { searchKeyword, key } = this.state;
    return (
      <div>
        <div className="drug-detail-action">
          <Title title={asset.name} isActiveFlage={true} isActive={asset.isActive} />
          <Row>
           <EditButton history={this.props.history} path={`/editAsset/${asset_id}`} />
            <DropdownButton
              className={"drag_more_menu"}
              variant="info"
              title="More"
              onClick={(e) => this.onHandleMoreOperation(e.target.value)}
            >
              <Dropdown.Item as="button" value="markActive">
                Mark {asset.isActive ? "Inactive" : "Active"}
              </Dropdown.Item>
              <Dropdown.Item as="button" value="delete">
                Delete
              </Dropdown.Item>
            </DropdownButton>

            <CloseButton history={this.props.history} path="/assets" />
          </Row>
        </div>
        <Tabs
          defaultActiveKey="overview"
          activeKey={key}
          onSelect={(k) => this.setState({key: k})}
          id="drug-detail-tabs"
          className="mb-3"
        >
          <Tab eventKey="overview" title="Overview" className="overview">
            <div className="drug-detail-action">
              {asset.image ? (
                <img src={asset.image}></img>
              ) : (
                <img src="https://fakeimg.pl/640x360"></img>
              )}
            </div>

            <RowDetail name={"Name"} value={asset.name}></RowDetail>
            <RowDetail
              name={"Manufacturer"}
              value={asset.manufacturer}
            ></RowDetail>
            <RowDetail
              name={"EAN/UPC/GTIN"}
              value={asset.productCode}
            ></RowDetail>
            <RowDetail
              name={"UNSPSC Code"}
              value={asset.UNSPSCCode}
            ></RowDetail>
            <RowDetail
              name={"Model/Part Number"}
              value={asset.modelNumber}
            ></RowDetail>
            <RowDetail name={"Brand"} value={asset.brand}></RowDetail>
            {/* <RowDetail name={'Net Content'} value={asset.netContent}></RowDetail> */}
            <RowDetail name={"Categories"} value={asset.productCategory}></RowDetail>
            <RowDetail
              name={"Inventory Quantity"}
              value={asset.inventoryQuantity}
            ></RowDetail>
            <RowDetail
              name={"Next Expiry"}
              value= {asset.expiryDate &&
                 getTime(asset.expiryDate)}
              className={
                asset.isActive &&
                asset.expiryDate &&
                (getDateColor(asset.expiryDate, 2)
                ? "expiryRed"
                : getDateColor(asset.expiryDate, 5)
                    ? "expiryYellow"
                    : "expiryBlack")
              }
            ></RowDetail>
            <RowDetail name={'Description'} value={asset.description} className='description'></RowDetail>
            {/* <Row className="description">
              <Col lg="2" md="2" sm="12">
                <span>Description : </span>
              </Col>
              <Col lg="10" md="10" sm="12">
                <p>{asset.description}</p>
              </Col>
            </Row> */}
          </Tab>
          <Tab eventKey="asset-list" title="Item List" className="drug-item-tag">
            <div className="drug-item-list-container">
              <AssetItemListContainer
                searchKeyword={searchKeyword}
                asset_id={asset_id}
                assetName={assetName}
              />
            </div>
          </Tab>
        </Tabs>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

export default withRouter(connect(mapStateToProps)(AssetDetailOverview));
