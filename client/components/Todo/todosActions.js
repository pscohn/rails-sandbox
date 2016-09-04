import * as constants from '../../constants';
import thunk from 'redux-thunk';
import action from '../../services/action';

export function onCreateTodo(listId) {
  return (dispatch, getState) => {
    const { lastUsedId } = getState().todos;
    const newId = lastUsedId + 1;
    dispatch(updateTodoId(newId));
    dispatch(createTodo(newId));
    dispatch(moveTodoToList(listId, newId));
  }
}

export function onDeleteTodo(listId, todoId) {
  return (dispatch, getState) => {
    dispatch(removeTodoFromList(listId, todoId));
    dispatch(deleteTodo(todoId));
  }
}

export function createTodo(id) {
  return action(constants.CREATE_TODO, { id });
}

export function deleteTodo(id) {
  return action(constants.DELETE_TODO, { id });
}

export function updateTodoId(id) {
  return action(constants.UPDATE_TODO_ID, { id });
}

export function moveTodoToList(listId, todoId) {
  return action(constants.MOVE_TODO_TO_LIST, { listId, todoId });
}

export function removeTodoFromList(listId, todoId) {
  return action(constants.REMOVE_TODO_FROM_LIST, { listId, todoId });
}

export function beginEditTodo(todoId) {
  return action(constants.BEGIN_EDIT_TODO, {
    todoId,
  });
}

export function saveEditTodo(todoId, todoContent) {
  return action(constants.SAVE_EDIT_TODO, {
    todoId,
    todoContent,
  });
}

export function endEditTodo(todoId) {
  return action(constants.END_EDIT_TODO, {
    todoId,
  });
}

export function toggleTodo(todoId) {
  return action(constants.TOGGLE_TODO, {
    todoId,
  });
}

export function reorderTodos(listId, todoIndex, hoverIndex) {
  return action(constants.REORDER_TODOS, {
    listId,
    todoIndex,
    hoverIndex,
  });
}
