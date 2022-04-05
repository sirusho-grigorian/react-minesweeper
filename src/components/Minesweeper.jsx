import React, { useEffect, useState } from 'react';
import { Scoreboard } from './Scoreboard';
import './Cell.component.css';
import './Minesweeper.component.css';
import { MinesweeperGrid } from './MinesweeperGrid';
import { getNewGrid } from './getNewGrid';
import { gameStatuses, levels } from '../constants';
import { useTimer } from '../hooks/useTimer';


function Minesweeper() {
    const [level, setLevel] = useState(levels[0]);

    const [minesLeft, setMinesLeft] = useState(level.minesCount);
    const [gameStatus, setGameStatus] = useState(gameStatuses.notStarted);
    const [grid, setGrid] = useState(getNewGrid(level.height, level.width, level.minesCount));
    const [refresh, setRefresh] = useState(false);
    const [isClicking, setIsClicking] = useState(false);

    const timer = useTimer(gameStatus === gameStatuses.running, gameStatus === gameStatuses.notStarted);

    useEffect(reset, [level] );

    function reset() {
        setGameStatus(gameStatuses.notStarted);
        setMinesLeft(level.minesCount);
        setGrid(getNewGrid(level.height, level.width, level.minesCount));
        setRefresh(refresh => !refresh);
    }
    
    
    const isGameOver = () => gameStatus === gameStatuses.won || gameStatus === gameStatuses.lost;

    function cellGotFlagged(flagged) {
        if(flagged) {
            setMinesLeft(minesLeft-1);
        }
        else {
            setMinesLeft(minesLeft+1);
        }
    }
    
    function cellGotClicked() {
        if(gameStatus === gameStatuses.notStarted) {
            setGameStatus(gameStatuses.running);
        }
    }

    function setGameEnd(status) {
        setGameStatus(status);
        if (status === gameStatuses.won) {
            setMinesLeft(0);
        }
    }

    function levelChangeHandler(newLevelId) {
        if(newLevelId !== level) {
            setLevel(levels[newLevelId]);
        }
    }

    return (
        <div className="minesweeper">
            <Scoreboard 
                minesLeft={minesLeft}
                timer={timer}
                gameStatus={gameStatus}
                level={level.id}
                levelChangeHandler={levelChangeHandler}
                isClicking={isClicking}
                resetHandler={reset} />
            <div className="grid" onMouseDown={() => setIsClicking(true)} onMouseUp={() => setIsClicking(false)} onMouseLeave={() => setIsClicking(false)}>
                <MinesweeperGrid
                    refresh={refresh}
                    grid={grid}
                    gameOver={isGameOver()}
                    cellGotFlagged={cellGotFlagged}
                    cellGotClicked={cellGotClicked}
                    setGameEnd={setGameEnd} />
            </div>
        </div>
    );
}

export default Minesweeper;

