import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { updateCellInput, updateValues } from './../redux/grid';

export default function Cell({ row, column }) {
  const cellModel = useSelector((state) => {
    return state.grid[row][column];
  });
  const { displayValue, isHeaderCell, isLastRow, value } = cellModel;
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);

  function onChange(e) {
    dispatch(updateCellInput({ row, column, value: e.target.value }));
  }

  function onKeyUp(e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
      onBlur();
    }
  }

  function onClick() {
    if (!isHeaderCell) {
      setIsEditing(true);
    }
  }

  function onBlur() {
    setIsEditing(false);
    dispatch(updateValues({ row, column }));
  }

  let content;
  let className = "cell";

  if (isLastRow) {
    className += " cell--last-row";
  }
  if (isHeaderCell) {
    className += " cell--header";
  }

  if (isEditing) {
    content = <input autoFocus className="cell__edit-cell" type="text" value={value} onChange={onChange} onKeyUp={onKeyUp} />;
  } else {
    content = <span className="cell__static-cell">{displayValue}</span>;
  }

  return (
    <td className={className} onClick={onClick} onBlur={onBlur}>
      {content}
    </td>
  );
}
