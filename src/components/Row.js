import React  from 'react';
import Cell from "./Cell";

export default function Row({ data, onCellClick, onBlur, onCellChange }) {
  const cells = data.map((cellModel, index) => (
    <Cell key={index} model={cellModel} onCellClick={onCellClick} onBlur={onBlur} onCellChange={onCellChange} />
  ));

  return <tr className="row">{cells}</tr>;
}
