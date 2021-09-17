import DisposableItemListContainer from "container/Disposable/DisposableItemListContainer";
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
import CloseButton from "commonComponents/closeButton";
import { getTime, getDateColor } from "commonMethod/common";
import EditButton from "commonComponents/EditButton";

class DisposableDetailOverView extends React.Component {
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
        key: "disposable-list",
      });
    } else {
      this.setState({
        key: "overview",
      });
    }
    this.props.getDisposable(this.props.disposable_id, "disposable").then((res) => {
      if (res.length === 0) {
        this.props.history.push("/not-found");
      }
    });
  }

  // Fetch data from server-end point based on user click
  componentDidUpdate(prevProps, prevState) {
    if (this.props.disposable_id !== prevProps.disposable_id) {
      this.props.getDisposable(this.props.disposable_id, "disposable");
      if (this.state.key !== 'overview') {
        this.setState({
          key: 'overview'
        })
      }
    }
  }

  onHandleMoreOperation = async (key) => {
    if (key === "markActive") {
      await this.props.editDisposableStatus(
        [this.props.disposable_id],
        !this.props.disposable.isActive
      );
      await this.props.getDisposable(this.props.disposable_id, "disposable");
    } else if (key === "delete") {
      await this.props.deleteDisposable(this.props.disposable_id);
      this.props.history.push("/disposables");
    }
  };

  render() {
    const { disposable_id, disposable, disposableName } = this.props;
    const { searchKeyword, key } = this.state;
    return (
      <div>
        <div className="drug-detail-action">
          <Title isActiveFlage={true} title={disposable.name} isActive={disposable.isActive} />
          <Row>
            <EditButton history={this.props.history} path={`/editDisposable/${disposable_id}`} />
            <DropdownButton
              className={"drag_more_menu"}
              variant="info"
              title="More"
              onClick={(e) => this.onHandleMoreOperation(e.target.value)}
            >
              <Dropdown.Item as="button" value="markActive">
                Mark {disposable.isActive ? "Inactive" : "Active"}
              </Dropdown.Item>
              <Dropdown.Item as="button" value="delete">
                Delete
              </Dropdown.Item>
            </DropdownButton>
            <CloseButton history={this.props.history} path="/disposables" />
          </Row>
        </div>
        <Tabs
          activeKey={key}
          onSelect={(k) => this.setState({ key: k })}
          defaultActiveKey="overview"
          id="drug-detail-tabs"
          className="mb-3"
        >
          <Tab eventKey="overview" title="Overview" className="overview">
            <div className="drug-detail-action">
              {disposable.image ? (
                <img src={disposable.image}></img>
              ) : (
                <img src="https://fakeimg.pl/640x360"></img>
              )}
            </div>

            <RowDetail name={"Name"} value={disposable.name}></RowDetail>
            <RowDetail
              name={"Manufacturer"}
              value={disposable.manufacturer}
            ></RowDetail>
            <RowDetail
              name={"EAN/UPC/GTIN"}
              value={disposable.productCode}
            ></RowDetail>
            <RowDetail
              name={"UNSPSC Code"}
              value={disposable.UNSPSCCode}
            ></RowDetail>
            <RowDetail
              name={"Model/Part Number"}
              value={disposable.modelNumber}
            ></RowDetail>
            <RowDetail name={"Brand"} value={disposable.brand}></RowDetail>
            <RowDetail
              name={"Net Content"}
              value={disposable.netContent}
            ></RowDetail>
            <RowDetail
              name={"Categories"}
              value={disposable.productCategory}
            ></RowDetail>
            <RowDetail
              name={"Inventory Quantity"}
              value={disposable.inventoryQuantity}
            ></RowDetail>
            <RowDetail
              name={"Next Expiry"}
              value={disposable.expiryDate &&
                getTime(disposable.expiryDate)}
              className={
                disposable.isActive &&
                disposable.expiryDate &&
                (getDateColor(disposable.expiryDate, 2)
                  ? "expiryRed"
                  : getDateColor(disposable.expiryDate, 5)
                    ? "expiryYellow"
                    : "expiryBlack")
              }
            ></RowDetail>
            <RowDetail name={'Description'} value={disposable.description} className='description'></RowDetail>
          </Tab>
          <Tab eventKey="disposable-list" title="Item List" className="drug-item-tag">
            <div className="drug-item-list-container">
              <DisposableItemListContainer
                disposable_id={disposable_id}
                searchKeyword={this.state.searchKeyword}
                disposableName={disposableName}
              />
            </div>
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default withRouter(DisposableDetailOverView);
