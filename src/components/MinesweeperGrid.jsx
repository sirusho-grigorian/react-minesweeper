import React, { useState } from 'react';
import { Cell } from './Cell';
import { gameStatuses } from '../constants';


export function MinesweeperGrid(props) {
    const [grid, setGrid] = useState(props.grid);
    const [refresh, setRefresh] = useState(props.refresh);

    if(refresh !== props.refresh) {
        setRefresh(props.refresh);
        setGrid(props.grid);
    }

    function handleRightClick(cell) {
        props.cellGotClicked();

        const [x, y] = [cell.x, cell.y];

        if (!grid[x][y].isCovered || props.gameOver)
            return;

        const newGrid = grid.map(r => r.map(c => ({...c})));

        newGrid[x][y].flagged = !newGrid[x][y].flagged;
        
        if(hasWon(newGrid)) {
            props.setGameEnd(gameStatuses.won);
        }

        setGrid(newGrid);
        props.cellGotFlagged(newGrid[x][y].flagged);
    }

    const hasWon = (grid) => grid.reduce((a, r) => a && r.reduce((a, c) => a && (c.isMine || !c.isCovered), true), true);

    function handleLeftClick(cell) {
        const [x, y] = [cell.x, cell.y];
        props.cellGotClicked();

        if (!grid[x][y].isCovered || grid[x][y].flagged || props.gameOver)
            return;

        if (grid[x][y].isMine) {
            const newGrid = grid.map(r => r.map(c => ({
                ...c,
                isCovered: c.isMine ? false : c.isCovered
            })));
            newGrid[x][y].clickedMine = true;

            setGrid(newGrid);
            props.setGameEnd(gameStatuses.lost);
        }
        else  {
            const newGrid = grid.map(r => r.map(c => ({
                ...c
            })));
            newGrid[x][y].isCovered = false;
            
            if (grid[x][y].neighboringMines === 0) {
                uncoverEmptyGrid(newGrid, cell);
            }
            else {
                setGrid(newGrid);
            }

            if(hasWon(newGrid)) {
                const flagsSetGrid = newGrid.map(r => r.map(c => ({
                    ...c,
                    flagged: c.isMine
                })));
                
                setGrid(flagsSetGrid);
                props.setGameEnd(gameStatuses.won);
            }
        }
    }

    // BFS
    function uncoverEmptyGrid(grid, cell) {
        const queue = [[cell.x, cell.y]];
        let k = 0;
        const length = grid.length;
        const width = grid[0].length;

        while (queue.length > 0) {
            const n = queue.length;
            for (let l = 0; l < n; l++) {
                const [x, y] = queue.shift();

                for (let i = Math.max(0, x - 1); i < Math.min(length, x + 2); ++i) {
                    for (let j = Math.max(0, y - 1); j < Math.min(width, y + 2); ++j) {
                        if (!grid[i][j].isMine && grid[i][j].isCovered && !grid[i][j].flagged) {
                            grid[i][j].isCovered = false;
                            if(grid[i][j].neighboringMines === 0) {
                                queue.push([i, j]);
                            }
                        }
                    }
                }
            }

            // update after each breadth search cycle for animation
            setTimeout((newGrid) => {
                setGrid(newGrid);
            }, k++ * 50, grid);
        }
    }

    return (
        grid.map((r, i) => <div key={i} className="row">
            {r.map((c, j) => <Cell
                key={j}
                data={c}
                handleLeftClick={handleLeftClick}
                handleRightClick={handleRightClick} />)}
        </div>
        )
    );
}
