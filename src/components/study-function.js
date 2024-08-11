import React, {useState, useEffect, useRef} from "react";
import './study.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPlay, faStop, faRotateLeft, faTrash} from '@fortawesome/free-solid-svg-icons';



const Study =() => {

    {/*Time variables */}
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);
    const startTimeRef = useRef(null);

    {/*Task variables S*/}
    const [tasks, setTasks] = useState([]);
    const [taskInput, setTaskInput] = useState('');
        
    {/*Time function */}

    const updateTime = () => {
        if(isRunning){
            const now = Date.now();
            const timeElapsed = now - startTimeRef.current;
            setTime(timeElapsed);
        }
    }

    useEffect(() => {
        if(isRunning){
            startTimeRef.current = Date.now() - time;
            intervalRef.current = setInterval(updateTime, 10);
        
        } else if (!isRunning && intervalRef.current){
            clearInterval(intervalRef.current);
        }

        return () => {
            clearInterval(intervalRef.current);
        }
    });
  
    const handleStartStop = () => {
       if(tasks.length === 0){
        alert('Please Enter a task first so you can start the timer.');
        return;
       }
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

    {/*Task Functions */}
     const handleSubmit = (e) => {
        e.preventDefault();
        if(taskInput.trim() !== ''){
            setTasks([...tasks, {text: taskInput, completed: false}])
            setTaskInput('')
        }
     }
      
      const handleCompleted = (id) => {
        const updatedTasks = tasks.map((task, index) => 
        index === id ? {...task, completed: !task.completed} : task
        );
        setTasks(updatedTasks);
      };

      const handleDelete = (index) => {

        const deletedTasks = tasks.filter((_, i) => i !== index);

        setTasks(deletedTasks);
      };

    return (
        <>
        <div className="container">
            <div className="card">

                <div className="timer-container">
                    <div className="timer-buttons">
                            <FontAwesomeIcon
                                icon={isRunning ? faStop : faPlay}
                                className="start-time"
                                onClick={handleStartStop}
                            />

                            <FontAwesomeIcon
                                icon={faRotateLeft}
                                className="reset"
                                onClick={handleReset}
                            />
                    </div>

                    <div className="timer-format">
                        <h2>{formatTime(time)}</h2>
                    </div>

                </div>

                <form onSubmit={handleSubmit}>
                <div className="task-container">
                    <div className="task-input-container">
                    <input
                        type="text"
                        value={taskInput}
                        className="task-input"
                        onChange={(e) => setTaskInput(e.target.value)}
                        placeholder="Enter task"
                    />
                    </div>

                    <div className="enter-task">
                    <button type="submit">Enter task</button>
                    </div>
                    </div>
                    
                </form>
                
               
                    <ul className="ul-task">
                        {tasks.map((task, index) => (
                            <li key={index} 
                                className={`list-task ${task.completed ? 'done' : ''}`}
                                onClick={() => handleCompleted(index)}
                            >   
                            <div className="task-text-container">
                                {task.text}
                            </div>
                                <FontAwesomeIcon
                                    icon={faTrash}
                                    className="delete-task"
                                    onClick={(e) => {e.stopPropagation(); handleDelete(index);}}
                                />
                            </li>
                        ))}

                    </ul>

            </div>
        </div>
    
        </>
    )

};

export default Study