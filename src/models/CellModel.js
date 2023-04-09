export default class CellModel {
  value;
  displayValue;
  row;
  column;
  isEditing;
  isHeaderCell;
  isLastRow;

  constructor({
    value,
    displayValue,
    row,
    column,
    isEditing,
    isHeaderCell,
    isLastRow
  }) {
    this.value = value;
    this.displayValue = displayValue;
    this.row = row;
    this.column = column;
    this.isEditing = isEditing;
    this.isHeaderCell = isHeaderCell;
    this.isLastRow = isLastRow;
  }
}
