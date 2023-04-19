import React from "react";
import Cell from "./components/Cell";
import { NUM_ROWS, NUM_COLUMNS } from './constants';

export default function Spreadsheet() {
  const arr = new Array(NUM_ROWS).fill().map(el => new Array(NUM_COLUMNS).fill());

  return (
    <table>
      <tbody>
        {arr.map((row, rowIndex) => (
          <tr key={`row: ${rowIndex}`} className="row">
            {row.map((cell, columnIndex) => {
              return <Cell
                key={`cell: ${rowIndex},${columnIndex}`}
                row={rowIndex}
                column={columnIndex}
              />;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}


