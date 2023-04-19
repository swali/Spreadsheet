// deprecated
export default class CellModel {
  value;
  oldValue;
  displayValue;
  row;
  column;
  dependentCells;
  isHeaderCell;
  isLastRow;

  constructor({
    value,
    displayValue,
    row,
    column,
    dependentCells = new Set(),
    isHeaderCell,
    isLastRow
  }) {
    this.value = value;
    this.displayValue = displayValue;
    this.row = row;
    this.column = column;
    this.dependentCells = dependentCells;
    this.isHeaderCell = isHeaderCell;
    this.isLastRow = isLastRow;
  }
}
