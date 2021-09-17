import React, { Component } from "react";
import { Tabs, Tab, Dropdown } from "react-bootstrap";
import ReactTable from "react-table-6";
import { OverviewMovementHistory } from "./OverviewMovementHistory";
import { Row as RowDetail } from "./Row";

export class OverviewProductTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      key: "overview",
    };
  }
  render() {
    const { tabKey, handleTabs, TabsDetails } = this.props;
    const { searchKeyword, key } = this.state;
    return (
      <Tabs
        defaultActiveKey={tabKey}
        activeKey={tabKey}
        mountOnEnter={true}
        unmountOnExit={true}
        onSelect={(k) => handleTabs(k)}
        id="drug-detail-tabs"
        className="mb-3"
      >
        {TabsDetails.map((tab) => (
          <Tab eventKey={tab.EventKey} title={tab.name} className="overview">
            {tab.Component}
          </Tab>
        ))}
      </Tabs>
    );
  }
}

export default OverviewProductTabs;
