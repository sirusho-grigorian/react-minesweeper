import { useCallback, useRef, useState } from "react";

function useLongPress (
    onLongPress,
    onClick,
    { shouldPreventDefault = true, delay = 300 } = {}
) {
  
    const [longPressTriggered, setLongPressTriggered] = useState(false);
    const timeout = useRef();
    const target = useRef();

    const start = useCallback(
        event => {
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
        },
        [onLongPress, delay, shouldPreventDefault]
    );

    const clear = useCallback(
        (event, shouldTriggerClick = true) => {
        timeout.current && clearTimeout(timeout.current);
        shouldTriggerClick && !longPressTriggered && onClick();
        setLongPressTriggered(false);
        if (shouldPreventDefault && target.current) {
            target.current.removeEventListener("touchend", preventDefault);
        }
        },
        [shouldPreventDefault, onClick, longPressTriggered]
    );

    return {
        onClick: e => clear(e),
        onContextMenu: e => {
            e.preventDefault();
            onLongPress();
        },
        onTouchStart: e => start(e),
        onTouchEnd: e => clear(e)
    };
};

const isTouchEvent = event => {
    return "touches" in event;
};

const preventDefault = event => {
    if (!isTouchEvent(event)) return;

    if (event.touches.length < 2 && event.preventDefault) {
        event.preventDefault();
    }
};

export default useLongPress;
