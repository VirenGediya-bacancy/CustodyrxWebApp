import React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export const AllList = (props) => {
    const { handleSelect, categoryStatus, list, name, toggleFilter, dropdownOpen, selectedItem } = props;

    const category = (data) => {
        // let catArray = [];
        // data?.map(item => {
        //     const innerResult = item.productCategory.filter(cat => !catArray.includes(cat.name))
        //     catArray = catArray.concat([...innerResult]);
        // });

        return (
            data.map(cat => (
                <DropdownItem className={`${selectedItem === cat.name && 'active'}`} value={cat.name}
                    onClick={(e) => handleSelect(e.target.value)}>{cat.name}</DropdownItem>
            ))
        )
    }

    return (
        <Dropdown isOpen={dropdownOpen} toggle={toggleFilter} className="drop-down">
            <DropdownToggle caret>
                {selectedItem ? selectedItem === '1' ? `Active ${name}` : selectedItem === '0' ? `Inactive ${name}` : selectedItem === `All ${name}` ? `All ${name}` : selectedItem : `All ${name}`}
            </DropdownToggle>
            <DropdownMenu>
                <DropdownItem value={`All ${name}`} className={`${selectedItem === `All ${name}` && 'active'}`} onClick={(e) => handleSelect(e.target.value)}>{`All ${name}`}</DropdownItem>
                <DropdownItem value={"1"} className={`${selectedItem === `1` && 'active'}`} onClick={(e) => handleSelect(e.target.value)}>{`Active ${name}`}</DropdownItem>
                <DropdownItem value={"0"} className={`${selectedItem === `0` && 'active'}`} onClick={(e) => handleSelect(e.target.value)}>{`Inactive ${name}`}</DropdownItem>
                {categoryStatus === "Active" &&
                    <>
                        <Dropdown className="ml-2 dropdown_header" header>{`Active ${name} Category`}</Dropdown>
                        {category(list)}
                    </>
                }
            </DropdownMenu>
        </Dropdown>
    );
}

export function CommonDropdown(props) {
    const { handleSelect, list } = props;
    return (
        <div>
            <select name="table-filter" id="filter" onChange={(e) => handleSelect(e, 'FILTER')}>
                {
                    list.map((item) => {
                        const { name, label, subList, isSubList } = item;
                        if (isSubList) {
                            return (<optgroup label={label}>
                                {
                                    subList.map(i => (
                                        <option key={i.name} value={i.name}>{i.label}</option>
                                    ))
                                }
                            </optgroup>)
                        } else {
                            return (<option value={name}>{label}</option>)
                        }
                    })
                }
            </select>
        </div>
    )
}
