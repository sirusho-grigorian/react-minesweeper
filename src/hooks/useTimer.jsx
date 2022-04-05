import { useState, useEffect } from 'react';

export function useTimer(isActive, reset) {
    const [timer, setTimer] = useState(0);

    useEffect(() => {
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
