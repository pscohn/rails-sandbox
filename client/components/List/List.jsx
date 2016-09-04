import React, { Component, PropTypes as T } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import TodosContainer from '../Todo/TodosContainer';
import flow from 'lodash/flow';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import { Card, CardTitle } from 'material-ui/Card';

const listType = { LIST: 'LIST' };

const listSource = {
  beginDrag(props) {
    return {
      id: props.list.id,
      index: props.index,
    };
  }
};

const listTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get horizontal middle
    const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the left
    const hoverClientX = clientOffset.x - hoverBoundingRect.left;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
      return;
    }

    // Time to actually perform the action
    props.onDropList(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  }
};

class List extends Component {
  constructor(props) {
    super(props);
    this.onBeginRenameList = this.props.onBeginRenameList.bind(this, this.props.list.id);
    this.onDoneRenameList = this.props.onDoneRenameList.bind(this, this.props.list.id);
    this.onToggleListView = this.props.onToggleListView.bind(this, this.props.list.id);
    this.onHideList = this.props.onHideList.bind(this, this.props.list.id);
    this.onSaveRenameList = this.onSaveRenameList.bind(this);
    this.onCreateTodo = this.props.onCreateTodo.bind(this, this.props.list.id);
    this.onDeleteList = this.props.onDeleteList.bind(this, this.props.list.id);
  }

  static propTypes = {
    list: T.object.isRequired,
    onBeginRenameList: T.func.isRequired,
    onSaveRenameList: T.func.isRequired,
    onDoneRenameList: T.func.isRequired,
    onDeleteList: T.func.isRequired,
    onCreateTodo: T.func.isRequired,
    onToggleListView: T.func.isRequired,
    onHideList: T.func.isRequired,
    connectDragSource: T.func.isRequired,
    connectDropTarget: T.func.isRequired,
    onDropList: T.func.isRequired,
    isDragging: T.bool.isRequired,
  }

  onSaveRenameList() {
    this.props.onSaveRenameList(this.props.list.id, this._name.value);
  }

  renderListName() {
    if (this.props.list.isRenaming === true) {
      return (
        <span>
          <input type="text" ref={(cmp) => this._name = cmp} onChange={this.onSaveRenameList} value={this.props.list.name} />
          <button onClick={this.onDoneRenameList}>Done</button>
        </span>
      );
    }
    return (
      <span onClick={this.onBeginRenameList}>
        {this.props.list.name}
      </span>
    );
  }

  render() {
    const { isDragging, connectDragSource, connectDropTarget } = this.props;
    const opacity = isDragging ? 0 : 1;

    return connectDragSource(connectDropTarget(
      <div style={{ opacity }}>
        <Card className="list">
          <CardTitle title={this.renderListName()} style={{ display: 'inline-block' }}/>
          { this.props.list.isShowingComplete
            ? <IconButton iconClassName="fa fa-square-o" tooltip="show todo" onClick={this.onToggleListView} />
            : <IconButton iconClassName="fa fa-check-square" tooltip="show complete" onClick={this.onToggleListView} /> }
          <IconButton iconClassName="fa fa-minus" tooltip="hide list" onClick={this.onHideList} />
          <IconButton iconClassName="fa fa-trash" tooltip="delete list" onClick={this.onDeleteList} />
          <TodosContainer
            list={this.props.list}
          />
          {this.props.list.isShowingComplete ? undefined : <FlatButton style={{display: 'block'}} onClick={this.onCreateTodo} label="Add Item" />}
        </Card>
      </div>
    ));
  }
}

export default flow(
  DropTarget(listType.LIST, listTarget, connect => ({
    connectDropTarget: connect.dropTarget()
  })),
  DragSource(listType.LIST, listSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }))
)(List)
