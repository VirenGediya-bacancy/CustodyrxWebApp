import React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export const ItemBulkAction = (props) => {
    const {toggleBulk, bulkActionOpen, handleSelectAction} = props;
  return (
    <Dropdown isOpen={bulkActionOpen} toggle={toggleBulk} className="drop-down">
      <DropdownToggle caret>
        Bulk Action
      </DropdownToggle>
      <DropdownMenu>
      <DropdownItem value={"1"} onClick={(e) => handleSelectAction(e.target.value)}>Mark Active</DropdownItem>
      <DropdownItem value={"0"} onClick={(e) => handleSelectAction(e.target.value)}>Mark Inactive</DropdownItem>
      <DropdownItem value={"Delete"} onClick={(e) => handleSelectAction(e.target.value)}>Delete</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export const BulkAction = (props) => {
  const {toggleBulk, bulkActionOpen, handleSelectAction, userModule} = props;
  return (
      <Dropdown isOpen={bulkActionOpen} toggle={toggleBulk} className="drop-down">
      <DropdownToggle caret>
        Bulk Action
      </DropdownToggle>
      <DropdownMenu>
      <DropdownItem value={"1"} onClick={(e) => handleSelectAction(e.target.value)}>Mark Active</DropdownItem>
      <DropdownItem value={"0"} onClick={(e) => handleSelectAction(e.target.value)}>Mark Inactive</DropdownItem>
      <DropdownItem value={"Delete"} onClick={(e) => handleSelectAction(e.target.value)}>Delete</DropdownItem>
      {!userModule && <DropdownItem value={"Category"} onClick={(e) => handleSelectAction(e.target.value)}>Add to category</DropdownItem>}
      </DropdownMenu>
    </Dropdown>
  )
}