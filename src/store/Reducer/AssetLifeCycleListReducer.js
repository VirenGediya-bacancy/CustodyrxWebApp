/**
 * Initial state for the drug item tag which is empty.
 */
const initAssetsLifeCycleState = {
  assetLifeCycleList: [],
};
/**
 * To store drug item tag information and alter the data  
 * @param {*} state
 * @param {*} action
 * @returns 
 */
export default function assetLifeCycleListReducer(state = initAssetsLifeCycleState, action) {
  switch (action.type) {
    case 'ADD_ASSET_LIFE_CYCLE_LIST':
      return { ...state, assetLifeCycleList: action.payload };

    default:
      return state;
  }
}