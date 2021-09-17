import React, { useState, useEffect } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { connect } from 'react-redux';
import Input  from '../commonComponents/Input';
import ProductServices from "../service/CommonServices";

const AllItemFilter = (props) => {
  const { handleItemSelect, toggleFilter, dropdownOpen, selectedItem, selectedKey,
    selectStartDate, selectEndDate, id, lotNumber, locationList } = props;

    useEffect(async() => {
      await props.getAllLotNumber(id);
      await props.getAllLocation(id);
    },[id]);

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggleFilter} className="drop-down">
      <span style={{fontSize:20, paddingTop: 6}}>Filter :</span>
      <DropdownToggle caret>
        {selectedKey === "endDate" || selectedKey === "startDate" 
        ? `Date: ${selectStartDate}→${selectEndDate}`
        : selectedKey === "lotNumber" ? 'Lot: ' + selectedItem
        : "All Items"
        }
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem value={"All Items"} className={`${selectedItem === 'All Items' && 'active'}`} onClick={(e) => handleItemSelect("AllItems", e.target.value)}>All Items</DropdownItem>
        <DropdownItem header>By Lots</DropdownItem>
          {lotNumber.length > 0 && lotNumber.map(lotNum =>
            <DropdownItem className={`lot_nom_item ${selectedItem === lotNum && 'active'}`} value={lotNum} 
            onClick={(e) => handleItemSelect("lotNumber", e.target.value)}>
              {lotNum}
            </DropdownItem>
          )}

        <DropdownItem header>By Dates</DropdownItem>
          <Input className="date_item" dateClassName={"date_class_name"} label='From' 
          type='date' placeholder='From' value={selectStartDate}
          onChange={e => handleItemSelect("startDate", e.target.value)} />
          
          <Input className="date_item" dateClassName={"date_class_name"} label='To' 
          type='date' placeholder='To' value={selectEndDate}
          onChange={e => handleItemSelect("endDate", e.target.value)}
          />
        <DropdownItem header>By Location/Vehicle</DropdownItem>
          {locationList.length > 0 && locationList.map(lotNum =>
            <DropdownItem className={`lot_nom_item ${selectedItem === lotNum && 'active'}`} value={lotNum} 
            onClick={(e) => handleItemSelect("location", e.target.value)}>
              {lotNum}
            </DropdownItem>
          )}
      </DropdownMenu>
    </Dropdown>


  );
}

const mapStateToProps = (state) => {
  const { lotNumber, locationList } = state.lotNumberReducer;
  return {
      lotNumber,
      locationList
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllLotNumber: (id) => dispatch(ProductServices.getAllLotNumber(id)),
    getAllLocation: (id) => dispatch(ProductServices.getAllLocations(id))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(AllItemFilter)

// export default AllItemFilter;