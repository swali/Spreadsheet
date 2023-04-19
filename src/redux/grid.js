import { createSlice } from '@reduxjs/toolkit'
import { NUM_ROWS, NUM_COLUMNS, LETTERS } from '../constants';

export const gridSlice = createSlice({
  name: 'grid',
  initialState: createEmptyGrid(),
  reducers: {
    updateCellInput: (grid, action) => _updateCellInput(grid, action.payload),
    updateValues: (grid, action) => _updateValues(grid, action.payload),
  }
})

function _updateCellInput(grid, { row, column, value }) {
  grid[row][column].value = value;
}

function createEmptyGrid() {
  const grid = [];
  for (let i = 0; i < NUM_ROWS; i++) {
    grid[i] = [];
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

      grid[i][j] = {
        value,
        displayValue: value,
        row: i,
        column: j,
        isHeaderCell,
        isEditing: false,
        isLastRow: i === NUM_ROWS - 1,
        dependentCells: new Set()
      };
    }
  }

  return grid;
}

function _updateValues(grid, { row, column }) {
  debugger
  const cellModel = grid[row][column];
  const oldValue = cellModel.savedValue;
  const value = cellModel.value;
  cellModel.savedValue = value;
  const oldOperandCellModels = findOperandCells(grid, oldValue, cellModel);
  const operandCellModels = findOperandCells(grid, value, cellModel);

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
        model.dependentCells.add(`${row},${column}`);
      });
      cellModel.displayValue = sum;
    }
  }

  cellModel.dependentCells.forEach((key) => {
    const [depRow, depColumn] = key.split(',');
    return _updateValues(grid, {row: depRow, column: depColumn});
  });
  removedOperandModels.forEach((model) => {
    model.dependentCells.delete(`${cellModel.row},${cellModel.column}`);
  });
}

function findOperandCells(grid, value, currentCell) {
  const trimmedValue = value && value.trim();
  let invalid = false;

  if (trimmedValue == undefined || !trimmedValue.startsWith('=')) {
    return null;
  }

  const expression = trimmedValue.substring(1);
  const operands = expression.split('+');

  const operandCells = operands.reduce((operandCellModels, op) => {
    const operandCell = getOperandCell(grid, op);
    if (!operandCell || operandCell == currentCell) {
      invalid = true;
    } else {
      operandCellModels.push(operandCell);
    }

    return operandCellModels;
  }, []);

  return invalid ? [] : operandCells;
}

function getOperandCell(grid, op) {
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

  return grid[row][col];
}

// Action creators are generated for each case reducer function
export const { updateCellInput, updateValues } = gridSlice.actions

export default gridSlice.reducer