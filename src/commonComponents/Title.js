import React from "react";
import { Row } from "react-bootstrap";
import CategoryChip from "./categoryChips";

function Title({title, isActive, isActiveFlage}) {
    return(
        <Row className="drug_title">
            <h3 className="drug_name">{title}</h3>
            {isActiveFlage && <h4 className={`drug_status ${isActive ? "" : 'drug_inactive' }`}>{isActive ? "" : <CategoryChip variant="secondary" name="INACTIVE" />}</h4>}
        </Row>
    )
}

export default Title;