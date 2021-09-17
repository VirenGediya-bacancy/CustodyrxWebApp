import React from 'react';

const Pagination = ({total, currentPage, pageSize}) => {
    if(currentPage !== undefined){
    var start = 1 + ((currentPage-1) * pageSize);
    var end =  total > currentPage * pageSize ? currentPage * pageSize : total;
    }
    return ( 
        <div className="showPage">
        {total > 0 && (
        `Showing ${start}-${end} of ${total}`
        )}
        </div>
        
    );
}
 
export default Pagination;