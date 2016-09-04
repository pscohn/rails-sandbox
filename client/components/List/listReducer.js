import { combineReducers } from 'redux';
import * as constants from '../../constants';

let id;

function getDefaultList(newId) {
  return {
    id: newId,
    name: 'Untitled List',
    isRenaming: false,
    isShowingComplete: false,
  }
};

function lastUsedId(state = 0, action) {
  switch (action.type) {
    case constants.UPDATE_LIST_ID:
      return action.payload.id;
    default:
      return state;
  }
}

function listOrder(state = [], action) {
  switch (action.type) {
    case constants.ADD_LIST_TO_VIEW:
      return [...state, action.payload.id];
    case constants.REMOVE_LIST_FROM_VIEW:
      const index = state.indexOf(action.payload.id);
      return [...state.slice(0, index), ...state.slice(index + 1)];
    case constants.REORDER_LISTS:
      const lists = state.slice();
      const spliceList = lists.splice(action.payload.listIndex, 1);
      lists.splice(
        action.payload.hoverIndex,
        0,
        spliceList[0]
      );
      return lists;
    default:
      return state;
  }
}

function items(state = {}, action) {
  switch (action.type) {
    case constants.CREATE_LIST:
      const newId = action.payload.id;
      return {
        ...state,
        [newId]: getDefaultList(newId),
      }
    case constants.DELETE_LIST:
      const { [String(action.payload.id)]: deletedList, ...rest } = state;
      return rest;
    case constants.BEGIN_RENAME_LIST:
      id = action.payload.listId;
      return {
        ...state,
        [id]: {
          ...state[id],
          isRenaming: true,
        }
      };
    case constants.SAVE_RENAME_LIST:
      id = action.payload.listId;
      return {
        ...state,
        [id]: {
          ...state[id],
          name: action.payload.listName,
        },
      };
    case constants.END_RENAME_LIST:
      id = action.payload.listId;
      return {
        ...state,
        [id]: {
          ...state[id],
          isRenaming: false,
        },
      };
    case constants.TOGGLE_LIST_VIEW:
      id = action.payload.listId;
      return {
        ...state,
        [id]: {
          ...state[id],
          isShowingComplete: !state[id].isShowingComplete,
        },
      };
    default:
      return state;
  }
}

const listReducer = combineReducers({
  lastUsedId,
  listOrder,
  items,
});

export default listReducer;
