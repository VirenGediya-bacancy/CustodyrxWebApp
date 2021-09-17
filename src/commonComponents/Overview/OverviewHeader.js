import EditButton from "commonComponents/EditButton";
import CloseButton from "commonComponents/closeButton";
import Title from "commonComponents/Title";
import React, { Component } from "react";
import { Dropdown, DropdownButton, Row } from "react-bootstrap";

export class OverviewHeader extends Component {
  render() {
    const {
      title,
      isActive,
      history,
      editPath,
      closeButtonPath,
      onHandleMoreOperation,
    } = this.props;
    return (
      <div className="drug-detail-action">
        <Title title={title} isActiveFlage={true} isActive={isActive} />
        <Row>
          <EditButton history={history} path={editPath} />
          <DropdownButton
            className={"drag_more_menu"}
            variant="info"
            title="More"
            onClick={(e) => onHandleMoreOperation(e.target.value)}
          >
            <Dropdown.Item as="button" value="markActive">
              Mark {isActive ? "Inactive" : "Active"}
            </Dropdown.Item>
            <Dropdown.Item as="button" value="delete">
              Delete
            </Dropdown.Item>
          </DropdownButton>
          <CloseButton history={history} path={closeButtonPath} />
        </Row>
      </div>
    );
  }
}

export default OverviewHeader;
