import React, { useState } from 'react';

export default function Cell({ model, onCellChange, onCellBlur }) {
  const { value, displayValue, isHeaderCell, isLastRow } = model;

  const [isEditing, setIsEditing] = useState(false);

  function onChange(e) {
    onCellChange(model, e.target.value);
  }

  function onKeyUp(e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
      onBlur(model);
    }
  }

  function onClick() {
    if (!isHeaderCell) {
      setIsEditing(true);
    }
  }

  function onBlur(e) {
    setIsEditing(false);
    onCellBlur(model);
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
