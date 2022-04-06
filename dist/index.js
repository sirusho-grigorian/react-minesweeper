function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);

const gameStatuses = {
  notStarted: "notStarted",
  running: "running",
  won: "won",
  lost: "lost"
};
const levels = [{
  id: 0,
  text: "Beginner",
  height: 10,
  width: 10,
  minesCount: 10
}, {
  id: 1,
  text: "Intermediate",
  height: 15,
  width: 15,
  minesCount: 40
}, {
  id: 2,
  text: "Expert",
  height: 20,
  width: 20,
  minesCount: 60
}];

function DigitalCounter(props) {
  const str = "" + props.value;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "digital-counter"
  }, str.padStart(3, '0'));
}

function Scoreboard(props) {
  return /*#__PURE__*/React__default.createElement("div", {
    className: "scoreboard"
  }, /*#__PURE__*/React__default.createElement(DigitalCounter, {
    value: props.minesLeft
  }), /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("div", {
    className: "select-wrap"
  }, /*#__PURE__*/React__default.createElement("select", {
    onChange: e => props.levelChangeHandler(e.target.value),
    value: props.level
  }, levels.map(l => /*#__PURE__*/React__default.createElement("option", {
    key: l.id,
    value: l.id
  }, " ", l.text, " ")))), /*#__PURE__*/React__default.createElement(GameStatus, {
    status: props.gameStatus,
    onClickHandler: props.resetHandler,
    isClicking: props.isClicking
  })), /*#__PURE__*/React__default.createElement(DigitalCounter, {
    value: props.timer
  }));
}
function GameStatus(props) {
  function getStatusEmoji(status) {
    if (status === gameStatuses.lost) {
      return '😞';
    } else if (status === gameStatuses.won) {
      return '😎';
    } else {
      return '😊';
    }
  }

  return /*#__PURE__*/React__default.createElement("button", {
    className: "reset",
    onClick: props.onClickHandler
  }, props.isClicking ? '😲' : getStatusEmoji(props.status));
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function useLongPress(onLongPress, onClick, _temp) {
  let {
    shouldPreventDefault = true,
    delay = 300
  } = _temp === void 0 ? {} : _temp;
  const [longPressTriggered, setLongPressTriggered] = React.useState(false);
  const timeout = React.useRef();
  const target = React.useRef();
  const start = React.useCallback(event => {
    if (shouldPreventDefault && event.target) {
      event.target.addEventListener("touchend", preventDefault, {
        passive: false
      });
      target.current = event.target;
    }

    timeout.current = setTimeout(() => {
      onLongPress(event);
      setLongPressTriggered(true);
    }, delay);
  }, [onLongPress, delay, shouldPreventDefault]);
  const clear = React.useCallback(function (event, shouldTriggerClick) {
    if (shouldTriggerClick === void 0) {
      shouldTriggerClick = true;
    }

    timeout.current && clearTimeout(timeout.current);
    shouldTriggerClick && !longPressTriggered && onClick();
    setLongPressTriggered(false);

    if (shouldPreventDefault && target.current) {
      target.current.removeEventListener("touchend", preventDefault);
    }
  }, [shouldPreventDefault, onClick, longPressTriggered]);
  return {
    onClick: e => clear(e),
    onContextMenu: e => {
      e.preventDefault();
      onLongPress();
    },
    onTouchStart: e => start(e),
    onTouchEnd: e => clear(e)
  };
}

const isTouchEvent = event => {
  return "touches" in event;
};

const preventDefault = event => {
  if (!isTouchEvent(event)) return;

  if (event.touches.length < 2 && event.preventDefault) {
    event.preventDefault();
  }
};

function Cell(props) {
  const cell = props.data.isCovered ? 'cell' : 'uncovered-cell';
  const number = !props.data.isCovered && !props.isMine ? `cell-${props.data.neighboringMines}` : '';
  const mine = !props.data.isCovered && props.isMine ? 'cell-mine' : '';
  const content = props.data.isCovered ? props.data.flagged ? '🚩' : '' : props.data.isMine ? '💣' : props.data.neighboringMines > 0 ? props.data.neighboringMines : '';
  const clickedMine = props.data.clickedMine ? 'clicked-mine' : '';
  const callbacks = useLongPress(() => props.handleRightClick(props.data), () => props.handleLeftClick(props.data));
  return /*#__PURE__*/React__default.createElement("button", _extends({
    className: `${cell} ${number} ${mine} ${clickedMine}`
  }, callbacks), content);
}

function MinesweeperGrid(props) {
  const [grid, setGrid] = React.useState(props.grid);
  const [refresh, setRefresh] = React.useState(props.refresh);

  if (refresh !== props.refresh) {
    setRefresh(props.refresh);
    setGrid(props.grid);
  }

  function handleRightClick(cell) {
    props.cellGotClicked();
    const [x, y] = [cell.x, cell.y];
    if (!grid[x][y].isCovered || props.gameOver) return;
    const newGrid = grid.map(r => r.map(c => ({ ...c
    })));
    newGrid[x][y].flagged = !newGrid[x][y].flagged;

    if (hasWon(newGrid)) {
      props.setGameEnd(gameStatuses.won);
    }

    setGrid(newGrid);
    props.cellGotFlagged(newGrid[x][y].flagged);
  }

  const hasWon = grid => grid.reduce((a, r) => a && r.reduce((a, c) => a && (c.isMine || !c.isCovered), true), true);

  function handleLeftClick(cell) {
    const [x, y] = [cell.x, cell.y];
    props.cellGotClicked();
    if (!grid[x][y].isCovered || grid[x][y].flagged || props.gameOver) return;

    if (grid[x][y].isMine) {
      const newGrid = grid.map(r => r.map(c => ({ ...c,
        isCovered: c.isMine ? false : c.isCovered
      })));
      newGrid[x][y].clickedMine = true;
      setGrid(newGrid);
      props.setGameEnd(gameStatuses.lost);
    } else {
      const newGrid = grid.map(r => r.map(c => ({ ...c
      })));
      newGrid[x][y].isCovered = false;

      if (grid[x][y].neighboringMines === 0) {
        uncoverEmptyGrid(newGrid, cell);
      } else {
        setGrid(newGrid);
      }

      if (hasWon(newGrid)) {
        const flagsSetGrid = newGrid.map(r => r.map(c => ({ ...c,
          flagged: c.isMine
        })));
        setGrid(flagsSetGrid);
        props.setGameEnd(gameStatuses.won);
      }
    }
  }

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

              if (grid[i][j].neighboringMines === 0) {
                queue.push([i, j]);
              }
            }
          }
        }
      }

      setTimeout(newGrid => {
        setGrid(newGrid);
      }, k++ * 50, grid);
    }
  }

  return grid.map((r, i) => /*#__PURE__*/React__default.createElement("div", {
    key: i,
    className: "row"
  }, r.map((c, j) => /*#__PURE__*/React__default.createElement(Cell, {
    key: j,
    data: c,
    handleLeftClick: handleLeftClick,
    handleRightClick: handleRightClick
  }))));
}

function getNewGrid(length, width, minesCount) {
  function getNewCells(length, width) {
    let grid = [];

    for (var i = 0; i < length; i++) {
      grid[i] = [];

      for (var j = 0; j < width; j++) {
        grid[i][j] = {
          isMine: false
        };
      }
    }

    return grid;
  }

  function addMines(grid, minesCount) {
    for (var i = 0; i < grid.length && minesCount; ++i) {
      for (var j = 0; j < grid[i].length && minesCount; ++j, --minesCount) {
        grid[i][j] = {
          isMine: true
        };
      }
    }

    return grid;
  }

  function randomize(grid) {
    const n = grid.length;
    const m = grid[0].length;

    for (let i = 0; i < n; ++i) {
      for (let j = 0; j < m; ++j) {
        const rand = Math.floor(Math.random() * n * m);
        const i1 = Math.floor(rand / m);
        const j1 = rand % m;
        [grid[i][j], grid[i1][j1]] = [grid[i1][j1], grid[i][j]];
      }
    }

    return grid;
  }

  function setneighboringMines(mines) {
    function calcNneighboringMines(x, y) {
      var count = 0;

      for (var i = Math.max(0, x - 1); i < Math.min(mines.length, x + 2); ++i) {
        for (var j = Math.max(0, y - 1); j < Math.min(mines[i].length, y + 2); ++j) {
          if (mines[i][j].isMine) {
            count++;
          }
        }
      }

      return count;
    }

    for (var i = 0; i < mines.length; ++i) {
      for (var j = 0; j < mines[i].length; ++j) {
        mines[i][j].neighboringMines = calcNneighboringMines(i, j);
      }
    }

    return mines;
  }

  return setneighboringMines(randomize(addMines(getNewCells(length, width), minesCount))).map((r, i) => r.map((c, j) => ({
    isCovered: true,
    isMine: c.isMine,
    neighboringMines: c.neighboringMines,
    x: i,
    y: j
  })));
}

function useTimer(isActive, reset) {
  const [timer, setTimer] = React.useState(0);
  React.useEffect(() => {
    let interval = null;

    if (isActive && !interval) {
      interval = setTimeout(() => {
        setTimer(timer => timer + 1);
      }, 1000);
    } else if (interval) {
      clearTimeout(interval);
    }

    if (reset) {
      setTimer(0);
    }

    return () => clearTimeout(interval);
  }, [timer, isActive, reset]);
  return timer;
}

function Minesweeper() {
  var _useState = React.useState(levels[0]),
      level = _useState[0],
      setLevel = _useState[1];

  var _useState2 = React.useState(level.minesCount),
      minesLeft = _useState2[0],
      setMinesLeft = _useState2[1];

  var _useState3 = React.useState(gameStatuses.notStarted),
      gameStatus = _useState3[0],
      setGameStatus = _useState3[1];

  var _useState4 = React.useState(getNewGrid(level.height, level.width, level.minesCount)),
      grid = _useState4[0],
      setGrid = _useState4[1];

  var _useState5 = React.useState(false),
      refresh = _useState5[0],
      setRefresh = _useState5[1];

  var _useState6 = React.useState(false),
      isClicking = _useState6[0],
      setIsClicking = _useState6[1];

  var timer = useTimer(gameStatus === gameStatuses.running, gameStatus === gameStatuses.notStarted);
  React.useEffect(reset, [level]);

  function reset() {
    setGameStatus(gameStatuses.notStarted);
    setMinesLeft(level.minesCount);
    setGrid(getNewGrid(level.height, level.width, level.minesCount));
    setRefresh(function (refresh) {
      return !refresh;
    });
  }

  var isGameOver = function isGameOver() {
    return gameStatus === gameStatuses.won || gameStatus === gameStatuses.lost;
  };

  function cellGotFlagged(flagged) {
    if (flagged) {
      setMinesLeft(minesLeft - 1);
    } else {
      setMinesLeft(minesLeft + 1);
    }
  }

  function cellGotClicked() {
    if (gameStatus === gameStatuses.notStarted) {
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
    if (newLevelId !== level) {
      setLevel(levels[newLevelId]);
    }
  }

  return /*#__PURE__*/React__default.createElement("div", {
    className: "minesweeper"
  }, /*#__PURE__*/React__default.createElement(Scoreboard, {
    minesLeft: minesLeft,
    timer: timer,
    gameStatus: gameStatus,
    level: level.id,
    levelChangeHandler: levelChangeHandler,
    isClicking: isClicking,
    resetHandler: reset
  }), /*#__PURE__*/React__default.createElement("div", {
    className: "grid",
    onMouseDown: function onMouseDown() {
      return setIsClicking(true);
    },
    onMouseUp: function onMouseUp() {
      return setIsClicking(false);
    },
    onMouseLeave: function onMouseLeave() {
      return setIsClicking(false);
    }
  }, /*#__PURE__*/React__default.createElement(MinesweeperGrid, {
    refresh: refresh,
    grid: grid,
    gameOver: isGameOver(),
    cellGotFlagged: cellGotFlagged,
    cellGotClicked: cellGotClicked,
    setGameEnd: setGameEnd
  })));
}

module.exports = Minesweeper;
//# sourceMappingURL=index.js.map
