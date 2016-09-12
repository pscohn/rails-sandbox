import React, { Component, PropTypes } from 'react';

function NickList({ nicks }) {
  return (
    <div className="nick-list">
      <h2>People in room:</h2>
      { nicks.length === 0 ?
        <em>The room is empty</em> :
        <ul>
          {nicks.map((nick) => {
            return <li>{nick}</li>;
          })}
        </ul>
      }
    </div>
  );
}

export default NickList;
