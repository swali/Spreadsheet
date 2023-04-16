import React, { useState } from "react";
import CellModel from "./models/CellModel";
import Cell from "./components/Cell";

const NUM_ROWS = 16;
const NUM_COLUMNS = 16;
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function Spreadsheet() {
  const initialRows = createEmptyGrid();
  const [rows, setRows] = useState(initialRows);

  function onCellChange(cellModel, value) {
    cellModel.value = value;
    setRows(rows.slice());
  }

  function onCellBlur(cellModel) {
    const newRows = rows.slice();
    updateValues(newRows, cellModel);
    setRows(newRows);
  }

  return (
    <table>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={`row: ${rowIndex}`} className="row">
            {row.map((cellModel, cellIndex) => (
              <Cell key={`cell: ${rowIndex},${cellIndex}`} model={cellModel} onCellChange={onCellChange} onCellBlur={onCellBlur} />
            ))}
          </tr>
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
        // header column
        value = i;
      } else if (i === 0 && j > 0) {
        // header row
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

function updateValues(rows, cellModel) {
  debugger
  const oldValue = cellModel.savedValue;
  const value = cellModel.value;
  cellModel.savedValue = value;
  const oldOperandCellModels = findOperandCells(rows, oldValue, cellModel);
  const operandCellModels = findOperandCells(rows, value, cellModel);

  let removedOperandModels = [];
  if (oldOperandCellModels) {
    removedOperandModels = oldOperandCellModels.filter(m => !(operandCellModels && operandCellModels.includes(m)));
  }

  if (value != undefined) {
    if (!operandCellModels) {
      cellModel.displayValue = value;
    } else if(!operandCellModels.length) {
      cellModel.displayValue = 'Error';
    } else {
      let sum = 0;
      operandCellModels.forEach((model) => {
        if (!model) return;

        const targetValue = Number(model.displayValue);
        if (!isNaN(targetValue)) {
          sum += targetValue;
        }
        model.dependentCells.add(cellModel);
      });
      cellModel.displayValue = sum;
    }
  }

  cellModel.dependentCells.forEach((depModel) => updateValues(rows, depModel));
  removedOperandModels.forEach((model) => {
    model.dependentCells.delete(cellModel);
  });
}

function findOperandCells(rows, value, currentCell) {
  const trimmedValue = value && value.trim();
  let invalid = false;

  if (trimmedValue == undefined || !trimmedValue.startsWith('=')) {
    return null;
  }

  const expression = trimmedValue.substring(1);
  const operands = expression.split('+');

  const operandCells = operands.reduce((operandCellModels, op) => {
    const operandCell = getOperandCell(rows, op);
    if (!operandCell || operandCell == currentCell) {
      invalid = true;
    } else {
      operandCellModels.push(operandCell);
    }

    return operandCellModels;
  }, []);

  return invalid ? [] : operandCells;
}

function getOperandCell(rows, op) {
  if (typeof op != 'string') {
    return;
  }

  const trimmed = op.trim();
  if (trimmed.length < 2) {
    return;
  }

  const letter = trimmed[0].toUpperCase();
  if (!LETTERS.includes(letter)) {
    return;
  }

  const col = LETTERS.indexOf(letter) + 1;

  const row = Number(trimmed.substring(1));
  if (isNaN(row)) {
    return;
  }

  return rows[row][col];
}
