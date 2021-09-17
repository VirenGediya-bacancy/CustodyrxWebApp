import {connect} from 'react-redux';
import disposablesService from 'service/DisposablesService';
import DisposableItemList from 'views/disposable/DisposableItemList';

// To separate the business logic and UI logic

/**
 * Here we mapped disposable item tag information as props to DisposablesItemTag component
 * @param {*} dispatch 
 * @returns 
 */
 const mapStateToProps = (state) => {
    return {
      disposableItemTags: state.disposableItemTagListReducer.disposableItemTags,
    };
};

/**
 * To perform add,get,delete and update action on disposables
 * @param {*} dispatch 
 * @returns 
 */
const mapDispatchToProps = (dispatch) => {
    return {
      getDisposableItemTagList: (obj) => dispatch(disposablesService.getDisposableItemTagList(obj)),
      updateDisposableItemTag: (disposableItemTagObj, id) => dispatch(disposablesService.updateDisposableItemTag(disposableItemTagObj, id)),
      getDisposableItemTag: (id) => dispatch(disposablesService.getDisposableItemTag(id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DisposableItemList);