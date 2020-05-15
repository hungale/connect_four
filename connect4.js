/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

/* calculates the offsets needed to put the pieces in the middle of the tiles
in our ex: 
each tile is 54x54 pixels, with a 2px offset from table's border-spacing
const TILE_OFFSET = 56; 
there's a 8px offset from the top of page to table 
and an additional 2px offset to top of cell from table's border-spacing
and 2px to middle of cell b/c of border+padding, MAGIC NUMBERS 
const TOP_OFFSET = 12;  */
function calculateOffset(){
  const tableCell = document.getElementById('0');
 
  const htmlBoard = document.getElementById('board');
  // a table's border spacing will be a string w/ pixel value or 2px by default 
  const borderSpacing = parseFloat(htmlBoard.style.borderSpacing) || 2;
  const topOffset = htmlBoard.offsetTop + borderSpacing + tableCell.offsetTop;

  // an offset is the combined size of border+padding+margin
  // for a table's cells/tiles, it's that + the table's border-spacing
  const tileOffset = tableCell.offsetHeight + borderSpacing;
  

  return {topOffset, tileOffset};
}


let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // set "board" to empty HEIGHT x WIDTH matrix array
  board = Array.from({length:HEIGHT}, () => Array(WIDTH).fill(null));
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.getElementById('board');

  createTopRow(htmlBoard);

  createMatrix(htmlBoard);
}


/** createTopRow: create the top row and 
 *                make it interactable with listeners. */
function createTopRow(htmlBoard) {
  // create the top row and add a listener for the top row of game
  const topRow = document.createElement("tr");
  topRow.setAttribute("id", "column-top");
  topRow.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    topRow.append(headCell);
  }
  htmlBoard.append(topRow);
}

/** createMatrix: create a width x height matrix. */
function createMatrix(htmlBoard) {
  // creates the 7x6 table in HTML, cell by cell
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (var x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // write the real version of this, rather than always returning 0
  
  for (let y = HEIGHT - 1; y >= 0; y--) {
    // accessing DOM is expensive, using in-memory board is preferable
    if(!board[y][x]) return y;
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // make a div and insert into correct table cell
  const piece = document.createElement("div");
  piece.classList.add("piece", `p${currPlayer}`);
  
  // set up animation for piece, maybe put into own
  const {topOffset, tileOffset} = calculateOffset();
  const calcuatedOffset = topOffset + ((tileOffset) * (y + 1));
  piece.style.top = `${calcuatedOffset}px`;
  const animationSpeed = 3 * ((y+1) / HEIGHT);
  piece.style.animation = `${animationSpeed}s droppiece`;

  const currentCell = document.getElementById(`${y}-${x}`);
  currentCell.appendChild(piece);
}

// can add function stylePiece(piece)

/** endGame: announce game end */

function endGame(msg) {
  // pop up alert message
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);
  board[y][x] = currPlayer; //update in-memory board

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  checkForTie();

  // switch players
  switchPlayers();
}

function checkForTie() {
  // check if all cells in board are filled; if so call, call endGame
  if(board.every(column => column.every(cell => cell))) {
    endGame('Tie!');
  }
}

function switchPlayers() {
  // switch currPlayer 1 <-> 2
  currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) { // starting with _ -> convention for private functions
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // read and understand this code. Add comments to help you.
  // use a sliding (horizontal, vertical, diagonalx2) window of 4 tiles
  // and private function _win to check to see 
  // if all pieces in the tiles are owned by one player
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

// put inside a listen for DOMContentLoaded, or on a button
document.addEventListener('DOMContentLoaded', () => {
  makeBoard();
  makeHtmlBoard();
});

