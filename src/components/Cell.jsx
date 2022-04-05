import React from 'react';
import useLongPress from "../hooks/useLongPress";

export function Cell(props) {
    const cell = props.data.isCovered ? 'cell' : 'uncovered-cell';
    const number = !props.data.isCovered && !props.isMine ? `cell-${props.data.neighboringMines}` : '';
    const mine = !props.data.isCovered && props.isMine ? 'cell-mine' : '';
    const content = props.data.isCovered ?
        (props.data.flagged ? '🚩' : '') : (props.data.isMine ? '💣' : props.data.neighboringMines > 0 ? props.data.neighboringMines : '');
    const clickedMine = props.data.clickedMine ? 'clicked-mine' : ''

    const callbacks = useLongPress(
        () => props.handleRightClick(props.data),
        () => props.handleLeftClick(props.data)
    )
    
    return (
        <button className={`${cell} ${number} ${mine} ${clickedMine}`}
            {...callbacks}>
            
            { content}

        </button>
    );
}

export default Cell;
