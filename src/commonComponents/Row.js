import React from "react";
import CategoryChip from "./categoryChips";

export function Row({ name, value, className }) {
    return(
        <div className='attribute-pair'>
            <div className='attribute-name'>{name}</div> 
            <div className="attribute-colon">:</div> 
            {/* <div className={`attribute-value ${className}`}>{value}</div> */}
            <div className={`attribute-value ${className}`}>
                {value && name === 'Categories' ?
                    value.map((item) => (<CategoryChip name={item.name} />)) : value
                }
            </div>
        </div>
    )
}