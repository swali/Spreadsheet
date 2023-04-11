import React  from 'react';

export default function Cell({ model, onCellClick, onBlur, onCellChange }) {
  const { isEditing, isHeaderCell, value, displayValue, isLastRow } = model;

  function onChange(e) {
    onCellChange(model, e.target.value.trim());
  }

  function onKeyUp(e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
      onBlur(model);
    }
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
    <td className={className} onClick={() => onCellClick(model)} onBlur={() => onBlur(model)}>
      {content}
    </td>
  );
}
