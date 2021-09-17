import { combineReducers } from 'redux';
import drugsReducer from './DrugsReducer';
import drugItemReducer from './DrugItemReducer';
import assetItemReducer from './AssetItemReducer';
import searchReducer from './SearchReducer';
import drugItemTagListReducer from  './DrugItemTagListReducer';
import assetItemTagListReducer from  './AssetItemTagListReducer';
import drugItemTagReducer from  './DrugItemTagReducer'
import usersReducer from './UserReducer'
import assetItemTagReducer from  './AssetItemTagReducer'
import assetSeviceHistoryListReducer from  './AssetSeviceHistoryListReducer'
import assetLifeCycleListReducer from  './AssetLifeCycleListReducer'
import assetOneServiceHistoryReducer from  './AssetOneServiceHistoryReducer'
import assetsReducer from './AssetReducer';
import disposablesReducer from './Disposable/DisposablesReducer';
import disposableItemReducer from './Disposable/DisposableItemReducer';
import disposableItemTagListReducer from './Disposable/DisposableItemTagListReducer';
import disposableItemTagReducer from './Disposable/DisposableItemTagReducer';
import lotNumberReducer from "./lotNumberReducer";
import movementHistoryReducer from "./MovementHistoryReducer";

/**
 * To manage all reducer and combine all reducer
 */
export default combineReducers({
   drugsReducer, 
   searchReducer, 
   drugItemReducer, 
   drugItemTagListReducer, 
   drugItemTagReducer,
   usersReducer,
   assetItemTagListReducer,
   assetLifeCycleListReducer,
   assetsReducer,
   assetItemReducer,
   assetOneServiceHistoryReducer,
   assetSeviceHistoryListReducer,
   assetItemTagReducer,
   disposablesReducer,
   disposableItemReducer,
   disposableItemTagListReducer,
   disposableItemTagReducer,
   lotNumberReducer,
   movementHistoryReducer
});