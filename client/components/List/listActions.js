import * as constants from '../../constants';
import thunk from 'redux-thunk';
import { deleteTodo } from '../Todo/todosActions';
import action from '../../services/action';

export function onCreateList() {
  return (dispatch, getState) => {
    const { lastUsedId } = getState().lists;
    const newId = lastUsedId + 1;
    dispatch(updateListId(newId));
    dispatch(createList(newId));
    dispatch(createListTodos(newId));
    dispatch(addListToView(newId));
  }
}

export function onDeleteList(id) {
  return (dispatch, getState) => {
    const ids = getState().listTodos.lists[id];
    dispatch(removeListFromView(id));
    dispatch(removeListTodos(id));
    dispatch(deleteList(id));
    for (let i = 0; i < ids.length; i++) {
      dispatch(deleteTodo(ids[i]));
    }
  }
}

export function deleteList(id) {
  return action(constants.DELETE_LIST, { id });
}

export function removeListTodos(id) {
  return action(constants.REMOVE_LIST_TODOS, { id });
}

export function createList(id) {
  return action(constants.CREATE_LIST, { id });
}

export function createListTodos(listId) {
  return action(constants.CREATE_LIST_TODOS, { listId });
}

export function addListToView(id) {
  return action(constants.ADD_LIST_TO_VIEW, { id });
}

export function removeListFromView(id) {
  return action(constants.REMOVE_LIST_FROM_VIEW, { id });
}

export function updateListId(id) {
  return action(constants.UPDATE_LIST_ID, { id });
}

export function beginRenameList(listId) {
  return action(constants.BEGIN_RENAME_LIST, {
    listId,
  });
}

export function saveRenameList(listId, listName) {
  return action(constants.SAVE_RENAME_LIST, {
    listId,
    listName,
  });
}

export function endRenameList(listId) {
  return action(constants.END_RENAME_LIST, {
    listId,
  });
}

export function toggleListView(listId) {
  return action(constants.TOGGLE_LIST_VIEW, {
    listId,
  });
}

export function reorderLists(listIndex, hoverIndex) {
  return action(constants.REORDER_LISTS, {
    listIndex,
    hoverIndex,
  });
}
