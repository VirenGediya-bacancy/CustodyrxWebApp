import DrugItemListContainer from "../../container/DrugItemListContainer";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
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
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import CloseButton from "commonComponents/closeButton";
import { getTime, getDateColor } from "commonMethod/common";
import EditButton from "commonComponents/EditButton";

class DrugDetailOverView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      key: "overview",
    };
  }

  // Fetch data from server-end point
  componentDidMount() {
    const { state } = this.props && this.props.location;
    if (state && state.isBack) {
      this.setState({
        key: "drug-list",
      });
    } else {
      this.setState({
        key: "overview",
      });
    }
    this.props.getDrug(this.props.drug_id, "drug").then((res) => {
      if (res.length === 0) {
        this.props.history.push("/not-found");
      }
    });
  }

  // Fetch data from server-end point based on user click
  componentDidUpdate(prevProps, prevState) {
    if (this.props.drug_id !== prevProps.drug_id) {
      this.props.getDrug(this.props.drug_id, "drug");
      if (this.state.key !== 'overview') {
        this.setState({
        key: 'overview'
        })
      }
    }
  }

  onHandleMoreOperation = async (key) => {
    if (key === "markActive") {
      await this.props.editDrugStatus([this.props.drug_id], !this.props.drug.isActive);
      await this.props.getDrug(this.props.drug_id, "drug");
    } else if (key === "delete") {
      await this.props.deleteDrug(this.props.drug_id);
      this.props.history.push("/drugs");
    }
  };

  render() {
    const { drug_id, drug, drugName } = this.props;
    const { key } = this.state;
    return (
      <div>
        <div className="drug-detail-action">
          <Title isActiveFlage={true} title={drug.name} isActive={drug.isActive} />
          <Row>
            <EditButton history={this.props.history} path={`/editDrug/${drug_id}`} />
            <DropdownButton
              className={"drag_more_menu"}
              variant="info"
              title="More"
              onClick={(e) => this.onHandleMoreOperation(e.target.value)}
            >
              <Dropdown.Item as="button" value="markActive">
                Mark {drug.isActive ? "Inactive" : "Active"}
              </Dropdown.Item>
              <Dropdown.Item as="button" value="delete">
                Delete
              </Dropdown.Item>
            </DropdownButton>

            <CloseButton history={this.props.history} path="/drugs" />
          </Row>
        </div>
        <Tabs
          defaultActiveKey="overview"
          activeKey={key}
          onSelect={(k) => this.setState({ key: k })}
          id="drug-detail-tabs"
          className="mb-3"
        >
          <Tab eventKey="overview" title="Overview" className="overview">
            <div className="drug-detail-action">
              {drug.image ? (
                <img src={drug.image}></img>
              ) : (
                <img src="https://fakeimg.pl/640x360"></img>
              )}
            </div>

            <RowDetail name={"Name"} value={drug.name}></RowDetail>
            <RowDetail
              name={"Manufacturer"}
              value={drug.manufacturer}
            ></RowDetail>
            <RowDetail name={'EAN/UPC/GTIN'} value={drug.productCode}></RowDetail>
            <RowDetail name={'UNSPSC Code'} value={drug.UNSPSCCode}></RowDetail>
            <RowDetail name={"NDC"} value={drug.ndc}></RowDetail>
            <RowDetail name={"Dosage"} value={drug.dossage}></RowDetail>
            <RowDetail name={"Strength"} value={drug.strength}></RowDetail>
            <RowDetail name={"Net Content"} value={drug.netContent}></RowDetail>
            <RowDetail name={"Categories"} value={drug.productCategory}></RowDetail>
            <RowDetail
              name={"Inventory Quantity"}
              value={drug.inventoryQuantity}
            ></RowDetail>
            <RowDetail name={'Next Expiry'}
               value= {drug.expiryDate &&
                getTime(drug.expiryDate)}
              className={
                drug.isActive &&
                drug.expiryDate &&
                (getDateColor(drug.expiryDate, 2)
                  ? "expiryRed"
                  : getDateColor(drug.expiryDate, 5)
                    ? "expiryYellow"
                    : "expiryBlack")
              }></RowDetail>
            <RowDetail name={'Description'} value={drug.description} className='description'></RowDetail>
          </Tab>
          <Tab eventKey="drug-list" title="Item List" className="drug-item-tag">
            <div className="drug-item-list-container">
              <DrugItemListContainer drugName={drugName} drug_id={drug_id} />
            </div>
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default withRouter(DrugDetailOverView);
