import { combineReducers } from 'redux';
import * as constants from '../../constants';

let id;

function getDefaultTodo(newId) {
  return {
    id: newId,
    content: 'Untitled Todo',
    isEditing: false,
    isComplete: false,
  }
};

function lastUsedId(state = 0, action) {
  switch (action.type) {
    case constants.UPDATE_TODO_ID:
      return action.payload.id;
    default:
      return state;
  }
}

function items(state = {}, action) {
  switch (action.type) {
    case constants.CREATE_TODO:
      const newId = action.payload.id;
      return {
        ...state,
        [newId]: getDefaultTodo(newId),
      }
    case constants.DELETE_TODO:
      let { [String(action.payload.id)]: deletedItem, ...rest } = state;
      return rest;
    case constants.BEGIN_EDIT_TODO:
      id = action.payload.todoId;
      return {
        ...state,
        [id]: {
          ...state[id],
          isEditing: true,
        }
      };
    case constants.SAVE_EDIT_TODO:
      id = action.payload.todoId;
      return {
        ...state,
        [id]: {
          ...state[id],
          content: action.payload.todoContent,
        },
      };
    case constants.END_EDIT_TODO:
      id = action.payload.todoId;
      return {
        ...state,
        [id]: {
          ...state[id],
          isEditing: false,
        },
      };
    case constants.TOGGLE_TODO:
      id = action.payload.todoId;
      return {
        ...state,
        [id]: {
          ...state[id],
          isComplete: !state[id].isComplete,
        },
      };
    default:
      return state;
  }
}

const listReducer = combineReducers({
  lastUsedId,
//  listOrder,
  items,
});

export default listReducer;
