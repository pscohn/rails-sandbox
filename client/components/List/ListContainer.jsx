import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import RaisedButton from 'material-ui/RaisedButton';
import Chip from 'material-ui/Chip';
import { blue300 } from 'material-ui/styles/colors';

const styles = {
  chip: {
    margin: 4,
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
};

import {
  onCreateList,
  beginRenameList,
  saveRenameList,
  endRenameList,
  onDeleteList,
  toggleListView,
  onDropList,
  reorderLists,
  addListToView,
  removeListFromView,
} from './listActions';
import {
  onCreateTodo,
} from '../Todo/todosActions';
import List from './List';

class ListContainer extends Component {
  render() {
    const hiddenLists = Object.keys(this.props.lists.items).map((id) => {
      id = Number(id);
      if (this.props.lists.listOrder.indexOf(id) === -1) {
        return (
          <Chip
            key={id}
            style={styles.chip}
            backgroundColor={blue300}
            onClick={this.props.onShowList.bind(this, id)}
          >
            {this.props.lists.items[id].name}
          </Chip>
        );
      }
    });
    const lists = this.props.lists.listOrder.map((id, index) => {
      return <List
        key={id}
        index={index}
        list={this.props.lists.items[id]}
        onBeginRenameList={this.props.onBeginRenameList}
        onDoneRenameList={this.props.onDoneRenameList}
        onSaveRenameList={this.props.onSaveRenameList}
        onToggleListView={this.props.onToggleListView}
        onHideList={this.props.onHideList}
        onCreateTodo={this.props.onCreateTodo}
        onDropList={this.props.onDropList}
        onDeleteList={this.props.onDeleteList}
        todos={this.props.todos}
        listTodos={this.props.listTodos}
      />;
    });
    return (
      <div>
        <RaisedButton onClick={this.props.onCreateList} className="create-list-btn" label="Create list" />
        <div style={styles.wrapper}>
          {hiddenLists}
        </div>
        <div style={{ display: 'block' }}>
          {lists}
        </div>
      </div>
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
    onCreateList: () => {
      dispatch(onCreateList());
    },
    onDeleteList: (listId) => {
      dispatch(onDeleteList(listId));
    },
    onBeginRenameList: (listId) => {
      dispatch(beginRenameList(listId));
    },
    onSaveRenameList: (listId, name) => {
      dispatch(saveRenameList(listId, name));
    },
    onDoneRenameList: (listId) => {
      dispatch(endRenameList(listId));
    },
    onToggleListView: (listId) => {
      dispatch(toggleListView(listId));
    },
    onToggleListVisibility: (listId) => {
      dispatch(toggleListVisibility(listId));
    },
    onShowList: (listId) => {
      dispatch(addListToView(listId));
    },
    onHideList: (listId) => {
      dispatch(removeListFromView(listId));
    },
    onCreateTodo: (listId) => {
      dispatch(onCreateTodo(listId));
    },
    onDropList: (listIndex, hoverIndex) => {
      dispatch(reorderLists(listIndex, hoverIndex));
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DragDropContext(HTML5Backend)(ListContainer));
