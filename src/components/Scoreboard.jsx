import React from 'react';
import { gameStatuses, levels } from '../constants';
import { DigitalCounter } from './DigitalCounter';



export function Scoreboard(props) {
    return (
        <div className="scoreboard">
            <DigitalCounter value={props.minesLeft} />
            <div>
                <div className="select-wrap">
                    <select onChange={(e) => props.levelChangeHandler(e.target.value)} value={props.level}>
                        { levels.map(l => (<option key={l.id} value={l.id}> {l.text} </option>)) }
                    </select>
                </div>
                <GameStatus status={props.gameStatus} onClickHandler={props.resetHandler} isClicking={props.isClicking} />       
            </div>
            <DigitalCounter value={props.timer} />
        </div>
    );
}

export default Scoreboard;

export function GameStatus(props) {
    function getStatusEmoji(status) {
        if (status === gameStatuses.lost) {
            return '😞';
        } else if (status === gameStatuses.won) {
            return '😎';
        } else {
            return '😊'
        }
    }

    return (
        <button className="reset" onClick={props.onClickHandler}>
            { props.isClicking ? '😲' : getStatusEmoji(props.status) }
        </button>
    );
}
