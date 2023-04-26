# Welcome
Hi and thanks for stopping by! This repo is a basic implementation of a Spreadsheet application like Excel. It uses React for the UI layer and React-Redux for state management. It is optimized to make sure only the cells that change will re-render. Below you will find some details and architecture decisions I made and others I didn't get a chance to explore yet.

# Instructions to run:
1. npm install
2. npm run start
3. Go to http://localhost:3000

# Architecture Choices
I chose to use React with Redux for this project, despite not having worked with React before. I went through a few iterations and refactors as I implemented the basics and then optimized it as I learned more about React. Below are some key points about the final solution.
- I use Redux with Redux Toolkit for state management. The state is mainly one 2d array, with each element containing an JS object with properties necessary to render a cell in the spreadsheet.
- All the state management logic is in redux/grid.js. `grid` is the name of the slice and reducer I use to store the 2d array.
- There is a presentational component, `Cell`, which handles rendering the input for edit mode and the display value for non-edit mode. It also handles click, blur and enter keypress actions.
- We update the state for the cell being edited on every keypress, but only update other cells on blur, when the user is done entering the value.
- It is important to store the value of each cell at the top level and not at the cell level. This makes cascading updates easy, as well as more advanced features, such as filling a row of cells.
- I don't read the grid state in App.js to avoid re-rendering the whole grid on every change. Redux allows me to just have each cell depend on it's own state to know when to re-render.
- I initially used a CellModel ES6 class for the elements in the grid 2d array, but redux toolkit doesn't work with classes and discourage their use in React in general. I therefore switched to POJOs.
- The list of dependent cells is stored in each cell. When a cell's value is changed, all the dependent cells are recursively updated as well.
- There is logic to determine the list of cells removed from a formula when a cell's value changes. It's important to remove the current cell from the dependent lists of those cells for performance reasons.

# Potential Future Improvements
- Use a global pub-sub system to avoid storing the list of dependent cells in each cell.
- Support more operators.
- Support fill.