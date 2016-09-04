import React, { Component, PropTypes as T } from 'react';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-dnd';
import { List as ListUI, ListItem } from 'material-ui/List';
import {
  beginEditTodo,
  saveEditTodo,
  endEditTodo,
  toggleTodo,
  onDeleteTodo,
  onDropTodo,
  reorderTodos,
} from './todosActions';
import Todo from './Todo';

class TodosContainer extends Component {
  static propTypes = {
    onBeginEditTodo: T.func.isRequired,
    onSaveEditTodo: T.func.isRequired,
    onDoneEditTodo: T.func.isRequired,
    onToggleTodo: T.func.isRequired,
    onDeleteTodo: T.func.isRequired,
  }

  render() {
    const shouldShowComplete = this.props.list.isShowingComplete === true;
    const todos = this.props.listTodos.lists[this.props.list.id].filter((id) => {
      const { isComplete } = this.props.todos.items[id];
      return this.props.list.isShowingComplete ? isComplete === true : isComplete === false;
    }).map((id, index) => {
      return (
        <ListItem disableTouchRipple={true}>
          <Todo
            key={id}
            index={index}
            todo={this.props.todos.items[id]}
            list={this.props.list}
            onBeginEditTodo={this.props.onBeginEditTodo}
            onDoneEditTodo={this.props.onDoneEditTodo}
            onSaveEditTodo={this.props.onSaveEditTodo}
            onToggleTodo={this.props.onToggleTodo}
            onDeleteTodo={this.props.onDeleteTodo}
            onDropTodo={this.props.onDropTodo}
          />
      </ListItem>
      )
    });

    return (
      <ListUI>
        {todos}
      </ListUI>
    );
  }
}

function mapStateToProps(state) {
  const { lists, todos, listTodos } = state;
  return {
    lists,
    todos,
    listTodos,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    onBeginEditTodo: (todoId) => {
      dispatch(beginEditTodo(todoId));
    },
    onSaveEditTodo: (todoId, todoContent) => {
      dispatch(saveEditTodo(todoId, todoContent));
    },
    onDoneEditTodo: (todoId) => {
      dispatch(endEditTodo(todoId));
    },
    onToggleTodo: (todoId) => {
      dispatch(toggleTodo(todoId));
    },
    onDeleteTodo: (listId, todoId) => {
      dispatch(onDeleteTodo(listId, todoId));
    },
    onDropTodo: (listId, todoIndex, hoverIndex) => {
      dispatch(reorderTodos(listId, todoIndex, hoverIndex));
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TodosContainer);
