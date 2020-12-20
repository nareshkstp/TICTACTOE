// Declaring  the required variable.
let origBoard;
let huPlayer ='O';
let aiPlayer = 'X';
// Storing the winning conditions in an array.
const winCombos =[
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [2, 4, 6],
  [2, 5, 8],
  [1, 4, 7],
  [0, 3, 6]
];

//Initializing the query selctors on elements with class "cell"
const cells = document.querySelectorAll('.cell');
startGame();

//Taking input from the user for symbol 
function selectSym(sym){
  huPlayer = sym;
  aiPlayer = sym ==='O' ? 'X' :'O';
  origBoard = Array.from(Array(9).keys());
  for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener('click', turnClick, false);  //adding on click event on every cell
  }
  if (aiPlayer === 'X') {
    turn(bestSpot(),aiPlayer);
  }
  document.querySelector('.selectSym').style.display = "none";
}

//Intializing thr game by calling symbol selector and removing the result section of the previous game
function startGame() {
  document.querySelector('.endgame').style.display = "none";
  document.querySelector('.endgame .text').innerText ="";
  document.querySelector('.selectSym').style.display = "block";
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = '';
    cells[i].style.removeProperty('background-color');
  }
}

//checking if the clicked squared has already been clicked 
//if no add user symbol in cell with square id
function turnClick(square) {
  if (typeof origBoard[square.target.id] ==='number') {
    turn(square.target.id, huPlayer);
    if (!checkWin(origBoard, huPlayer) && !checkTie()) //check for win condition/tie after move
      turn(bestSpot(), aiPlayer); // call for ai to play
  }
}

//adding symbol to cell depentding upon turnClick()
function turn(squareId, player) {
  origBoard[squareId] = player;
  document.getElementById(squareId).innerHTML = player;
  let gameWon = checkWin(origBoard, player);      //check win condition
  if (gameWon) gameOver(gameWon);
  checkTie();          //check tie condition
}

function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = {index: index, player: player};
      break;
    }
  }
  return gameWon;
}


//fuction to print winner on html page and change styling depending upon winner
function gameOver(gameWon){
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor = 
      gameWon.player === huPlayer ? "blue" : "red";
  }
  for (let i=0; i < cells.length; i++) {
    cells[i].removeEventListener('click', turnClick, false);
  }
  declareWinner(gameWon.player === huPlayer ? "You win!" : "You lose");
}

//printing result on the html page
function declareWinner(who) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = who;
}

//to check all the empty squares available to make a move
function emptySquares() {
  return origBoard.filter((elm, i) => i===elm);
}

//ai function call to minimax function to return th index of best move
function bestSpot(){
  return minimax(origBoard, aiPlayer).index;
}

//checking for tie by checking if array full
function checkTie() {
  if (emptySquares().length === 0){
    for (cell of cells) {
      cell.style.backgroundColor = "green";
      cell.removeEventListener('click',turnClick, false);
    }
    declareWinner("Tie game");
    return true;
  } 
  return false;
}

//minimax algorithm to calculate the best move and return index of the move
function minimax(newBoard, player) {
  let availSpots = emptySquares(newBoard);

// assigning points to moves depending upon terminal state (-10, 0, +10)
  if (checkWin(newBoard, huPlayer)) {
    return {score: -10};
  } else if (checkWin(newBoard, aiPlayer)) {  
    return {score: 10};
  } else if (availSpots.length === 0) {
    return {score: 0};
  }
  
  let moves = [];       //array to store points of all moves depending upon the index of origBoard

  //go through available spots on the board
  for (let i = 0; i < availSpots.length; i ++) {
    let move = {};
    move.index = newBoard[availSpots[i]];    //creating a newBoard to store calculations
    newBoard[availSpots[i]] = player;
    
    //call the minimax function on each available spot
    if (player === aiPlayer)
      move.score = minimax(newBoard, huPlayer).score;
    else
       move.score =  minimax(newBoard, aiPlayer).score;


    //evaluate returning values form function calls
    newBoard[availSpots[i]] = move.index;
    if ((player === aiPlayer && move.score === 10) || (player === huPlayer && move.score === -10))
      return move;
    else 
      moves.push(move);
  }
  
  let bestMove, bestScore;
  if (player === aiPlayer) {
    bestScore = -1000;
    for(let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
      bestScore = 1000;
      for(let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  
  //returning the best possible move. 
  return moves[bestMove];
}