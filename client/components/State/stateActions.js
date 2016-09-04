import thunk from 'redux-thunk';
import action from '../../services/action';
import { HYDRATE_STATE } from '../../constants';

export function onSaveState() {
  return (dispatch, getState) => {
    const state = JSON.stringify(getState());
    const url = 'data:text/json;charset=utf8,' + encodeURIComponent(state);
    window.open(url, '_blank');
    window.focus();
  }
}

export function onLoadState(state) {
  return action(HYDRATE_STATE, { state });
}
