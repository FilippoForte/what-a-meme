import React, { useState, useEffect } from 'react';
import "./Timer.css"; // Import CSS file for Timer component styling

export function Timer(props) {
    const [timeLeft, setTimeLeft] = useState(30);

    useEffect(() => {
        let timerId; // timer identifier

        // Start countdown if status is 'running' and timeLeft is greater than 0
        if (props.status === "running" && timeLeft > 0) {
            timerId = setTimeout(() => {
                setTimeLeft(prevTime => prevTime - 1); // Decrease timeLeft by 1 second
            }, 1000); // Timer interval set to 1000ms (1 second)
        } else if (timeLeft === 0) {
            // If timeLeft reaches 0 and status is still 'running', update status to 'lost'
            if (props.status === "running") {
                props.setStatus("lost");
                props.onTimeUp(); // Call onTimeUp callback function when time is up
            }
        }

        // Cleanup function to clear the timeout when component unmounts or when conditions change
        return () => clearTimeout(timerId);
    }, [timeLeft, props.status, props.onTimeUp]);

    // Effect to handle status changes
    useEffect(() => {
        // Reset timer and update status to 'running' when status changes to 'newGame'
        if (props.status === "newGame") {
            setTimeLeft(30);
            props.setStatus("running"); 
        } else if (props.status === "win" || props.status === "lost") {
            setTimeLeft(0); 
        }
    }, [props.status, props.setStatus]); // Dependency array for useEffect hook

    // Dynamically set timerClass based on remaining timeLeft
    let timerClass = "timer";
    if (timeLeft <= 10) {
        timerClass += " danger"; 
    } else if (timeLeft <= 20) {
        timerClass += " warning"; 
    }

    return (
        <>
            {props.status === "running" && <div className={timerClass}>{timeLeft}</div>}
        </>
    );
}

export default Timer;
