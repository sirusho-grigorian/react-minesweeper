import React from 'react';
import './Scoreboard.component.css';


export function DigitalCounter(props) {
    const str = "" + props.value
    return (<div className="digital-counter">{str.padStart(3, '0')}</div>);
}

export default DigitalCounter;