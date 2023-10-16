import { useState } from 'react';

function Square({ value, onSquareClick , win}) {
  return (
    <button className={`square ${win? 'highlight' : '' }` } onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({  xIsNext, squares,  onPlay}) {
  
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
  
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    
    onPlay(nextSquares, i);

  }

  const winner = calculateWinner(squares);
  let winSquares= [];
  let status;
  if (winner !== null) {
    winSquares = winner;
    status = 'Winner is player: ' + squares[winner[0]];
    
  } else if(!squares.includes(null) ){
    status = 'Game over! It is a Draw!!!';
    
    
  }
  else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

    
  const renderSquare = (i,squares, winSquares) => (
    <Square key={i}   value={squares[i]} onSquareClick={() => handleClick(i)} win={winSquares && winSquares.includes(i)} />
  );
  
  return (
    <>
      <div className="status">{status}</div>

      {Array(3)
        .fill(null)
        .map((row, rowIndex) => (
          <div key= {rowIndex} className="board-row">
          {Array(3)
              .fill(null)
              .map((col, colIndex) => (
                <div key={colIndex}>
                {renderSquare(rowIndex * 3 + colIndex, squares, winSquares)}
                </div>
              ))}
          </div>
        ))}
        
      
      
      
    </>
  );
}


export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [curCell, setCurCell] = useState([]);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [isReverseMoves, setIsReverseMoves] = useState(false);
  const winSquares = calculateWinner(currentSquares);

  function handleReverse(){
    setIsReverseMoves(!isReverseMoves);
  }
  function handlePlay(nextSquares, iCurCell) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setCurCell((prevCurCell) => [...prevCurCell, iCurCell]);
   
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    
    let description;
    let location ;
    if (move === 0) {
      description = 'Go to game start';
      location= '';
    } else if(move > 0 && move === (history.length - 1)) {
      location = ` (${Math.floor(curCell[move-1]/3 + 1)},${Math.floor(curCell[move-1]%3 + 1)})`;
      description = 'You are at the move #' + move;
    } else{
      location = ` (${Math.floor(curCell[move-1]/3 + 1)},${Math.floor(curCell[move-1]%3 + 1)})`;
      description = 'Go to move #' + move;

    }
    if(move === (history.length - 1)){
      
      return (
        <li key={move}>
          <div onClick={() => jumpTo(move)}>{description} {location}</div>
        </li>
      );
    }else{
      return (
        <li key={move}>
          
          <button onClick={() => jumpTo(move)}>{description} {location}</button>
        </li>
      );
    }
  });

  if(isReverseMoves){
    moves.reverse();
  }
  
  return (  
    <div className="game">
      <div className="game-board">
        <Board   xIsNext={xIsNext} squares={currentSquares} winSquares={winSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
      
        <button onClick={handleReverse}> Reverse</button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a,b,c];
    }
  }
  return null;
}
