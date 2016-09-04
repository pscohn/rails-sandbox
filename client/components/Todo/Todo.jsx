import React, { Component, PropTypes as T } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import flow from 'lodash/flow';
import IconButton from 'material-ui/IconButton';

const todoType = { TODO: 'TODO' };

const todoSource = {
  beginDrag(props) {
    return {
      id: props.todo.id,
      index: props.index,
    };
  }
};

const todoTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    if (dragIndex === hoverIndex) {
      return;
    }

    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const clientOffset = monitor.getClientOffset();
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    props.onDropTodo(props.list.id, dragIndex, hoverIndex);
    monitor.getItem().index = hoverIndex;
  }
};

export class Todo extends Component {
  constructor(props) {
    super(props);
    this.onSaveEditTodo = this.onSaveEditTodo.bind(this);
    this.onBeginEditTodo = this.props.onBeginEditTodo.bind(this, this.props.todo.id);
    this.onDoneEditTodo = this.props.onDoneEditTodo.bind(this, this.props.todo.id);
    this.onToggleTodo = this.props.onToggleTodo.bind(this, this.props.todo.id);
    this.onDeleteTodo = this.props.onDeleteTodo.bind(this, this.props.list.id, this.props.todo.id);
  }

  static propTypes = {
    onBeginEditTodo: T.func.isRequired,
    onSaveEditTodo: T.func.isRequired,
    onDoneEditTodo: T.func.isRequired,
    onToggleTodo: T.func.isRequired,
    onDeleteTodo: T.func.isRequired,
    onDropTodo: T.func.isRequired,
  }

  onSaveEditTodo() {
    this.props.onSaveEditTodo(this.props.todo.id, this._todoContent.value);
  }

  render() {
    const { isDragging, connectDragSource, connectDropTarget } = this.props;
    const opacity = isDragging ? 0 : 1;

    if (this.props.todo.isEditing === true) {
      return connectDragSource(connectDropTarget(
        <div className="todo editing">
          <input type="text" ref={(cmp) => this._todoContent = cmp} onChange={this.onSaveEditTodo} value={this.props.todo.content} />
          <IconButton iconClassName="fa fa-check" onClick={this.onDoneEditTodo} label="Done" />
        </div>
      ));
    }

    return connectDragSource(connectDropTarget(
      <div className="todo" style={{ opacity }}>
        <span onClick={this.onBeginEditTodo}>{this.props.todo.content}</span>
        <IconButton iconClassName="fa fa-check" onClick={this.onToggleTodo} label={this.props.todo.isComplete ? 'Uncomplete' : 'Complete'} />
        <IconButton iconClassName="fa fa-trash" onClick={this.onDeleteTodo} label="Delete" />
      </div>
    ));
  }
}

export default flow(
  DropTarget(todoType.TODO, todoTarget, connect => ({
    connectDropTarget: connect.dropTarget()
  })),
  DragSource(todoType.TODO, todoSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }))
)(Todo)
