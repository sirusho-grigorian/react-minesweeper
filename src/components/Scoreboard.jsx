import React from "react";
import { gameStatuses } from "../constants";
import { DigitalCounter } from "./DigitalCounter";

export function Scoreboard(props) {
  return (
    <div className="scoreboard">
      <DigitalCounter value={props.minesLeft} />
      <GameStatus
        status={props.gameStatus}
        onClickHandler={props.resetHandler}
        isClicking={props.isClicking}
      />
      <DigitalCounter value={props.timer} />
    </div>
  );
}

export default Scoreboard;

export function GameStatus(props) {
  function getStatusEmoji(status) {
    if (status === gameStatuses.lost) {
      return "😞";
    } else if (status === gameStatuses.won) {
      return "😎";
    } else {
      return "😊";
    }
  }

  return (
    <button className="reset" onClick={props.onClickHandler}>
      {props.isClicking ? "😲" : getStatusEmoji(props.status)}
    </button>
  );
}
