import React, { useCallback, useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import { connect } from 'react-redux';

function Search(props) {
  const [search,setSearch] = useState("");
  const [name,setName] = useState("");
  const [count, setCount] = useState("");
  const location = useLocation();

  const debounce = useCallback(
    (e) => {
    setSearch(e.target.value);
    var timer = null;
    var {saveSearch} = props;
      clearTimeout(timer);
      timer = setTimeout(function(){
         saveSearch(e.target.value);
      }, 2000);
    },
    [],
  );

  useEffect(() => {
    var {clearSearch} = props;
    var array = location.pathname.split("/");
    let module = "in " + location.pathname.substring(1,location.pathname.length);
    setSearch("");
    setName(module);
    setCount(array.length);
    clearSearch();
  },[location]) 

 const handleClearSearch = () => {
    var {saveSearch} = props;
    setSearch("");
    saveSearch("");
  }

    return (
      <>
      {count <= 2 && (
      <div>
          <span className="searchIcon"><i className="fas fa-search"></i></span>
          <input className="search" type="text" value={search} 
              onChange={debounce} placeholder={`Search ${name}`} />
          {search && <span className="searchTimes"
              value={search} onClick={() => handleClearSearch()}>
              <i className="fas fa-times-circle"></i></span>}
      </div>
      )}
      </>
    )
  }

const mapDispatchToProps = (dispatch) => {
  return {
     saveSearch: (value) => {dispatch({type: 'SAVE_SEARCH', payload: value})},
     clearSearch: () => dispatch({ type: 'CLEAR_SEARCH' })
  }
}

export default connect(null, mapDispatchToProps)(Search)