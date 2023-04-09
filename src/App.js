import React, { useState } from "react";
import Row from "./components/Row";
import CellModel from "./models/CellModel";

const NUM_ROWS = 16;
const NUM_COLUMNS = 16;
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function Spreadsheet() {
  const initialRows = createEmptyGrid();
  const [rows, setRows] = useState(initialRows);
  const [activeRow, setActiveRow] = useState(null);
  const [activeColumn, setActiveColumn] = useState(null);

  function onCellClick(cellModel) {
    debugger;
    const { row, column, isEditing } = cellModel;

    if (isEditing) {
      return;
    }

    const newRows = rows.slice();

    // unset active cell if there is one
    if (activeRow !== null && activeColumn !== null) {
      newRows[activeRow][activeColumn].isEditing = false;
    }

    if (row !== 0 && column !== 0) {
      setActiveRow(row);
      setActiveColumn(column);
      newRows[row][column].isEditing = true;
    }

    setRows(newRows);
  }

  function onBlur(cellModel) {
    debugger
    // unset active cell if there is one
    const newRows = rows.slice();
    if (activeRow !== null && activeColumn !== null) {
      newRows[activeRow][activeColumn].isEditing = false;
      setRows(newRows);
    }
  }

  function onCellChange(cellModel, value) {
    const newRows = rows.slice();
    newRows[cellModel.row][cellModel.column].value = value;
    newRows[cellModel.row][cellModel.column].displayValue = value;
    setRows(newRows);
  }

  return (
    <table>
      <tbody>
        {rows.map((row, index) => (
          <Row key={index} data={row} onCellClick={onCellClick} onBlur={onBlur} onCellChange={onCellChange} />
        ))}
      </tbody>
    </table>
  );
}

function createEmptyGrid() {
  const rows = [];
  for (let i = 0; i < NUM_ROWS; i++) {
    rows[i] = [];
    for (let j = 0; j < NUM_COLUMNS; j++) {
      let value = "";
      const isHeaderCell = i === 0 || j === 0;

      if (j === 0 && i > 0) {
        value = i;
      } else if (i === 0 && j > 0) {
        // header row - special case
        value = LETTERS[j - 1];
      }

      rows[i][j] = new CellModel({
        value,
        displayValue: value,
        row: i,
        column: j,
        isHeaderCell,
        isEditing: false,
        isLastRow: i === NUM_ROWS - 1
      });
    }
  }

  return rows;
}