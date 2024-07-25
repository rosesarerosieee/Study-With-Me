import React, {useState, useEffect, useRef} from "react";
import './study.css'

const Study =() => {

    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const timeRef = useRef(null);

    const [task, setTaks] = useState([]);
    const [taskInput, settaskInput] = useState('');

    useEffect(() => {
        if(isRunning){
            timeRef.current = setInterval(() => {
                setTime(prevTime => prevTime + 10);
            },10);
        } else if (!isRunning && timeRef.current){
            clearInterval(timeRef.current);
        }

        return () => clearInterval(timeRef.current);
    },[isRunning]);

    const handleStartStop = () => {
        setIsRunning(!isRunning);
    }
    
    const handleReset = () => {
        setIsRunning(false);
        setTime(0);
    }


    const formatTime = (time) => {
        const milliseconds = time % 1000;
        const seconds = Math.floor((time / 1000) % 60);
        const minutes = Math.floor((time / (1000 * 60)) % 60);
        const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
    
        const formattedMilliseconds = String(milliseconds).padStart(3, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedHours = String(hours).padStart(2, '0');
    
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
      };

    return (
        <>
        <div className="container">
            <div className="card">

                <button onClick={handleStartStop}>{isRunning ? 'Stop' : 'Start'}</button>

                <button onClick={handleReset} disabled={isRunning}>Reset</button>
                <h2>{formatTime(time)}</h2>
                
            </div>
        </div>


        </>
    )

};

export default Study