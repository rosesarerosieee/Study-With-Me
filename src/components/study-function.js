import React, {useState, useEffect, useRef} from "react";
import './study.css'

const Study =() => {

    {/*Time variables */}
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);
    const startTimeRef = useRef(null);

    {/*Task variables S*/}
    const [tasks, setTasks] = useState([]);
    const [taskInput, setTaskInput] = useState('');

    const updateTime = () => {
        if(isRunning){
            const now = Date.now();
            const elapsedTime = now - startTimeRef.current;
            setTime(elapsedTime);
        }
    }

{/*Time function */}
    useEffect(() => {

        if(isRunning){
            startTimeRef.current = Date.now() - time;
            intervalRef.current = setInterval(updateTime, 10);
        }else if (!isRunning && intervalRef.current){
            clearInterval(intervalRef.current);
        }
         
        return () => {
            clearInterval(intervalRef.current);
          
        }

    },[isRunning]);

    useEffect(() => {

        if(tasks.length === 0){
            setIsRunning(false);
        }
        else{
            setIsRunning(true);
        }

    },[tasks]);

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

    {/*Task Functions */}
      const handleSubmit = (e) => {
        e.preventDefault();
        if(taskInput.trim() !== '')
        {
            setTasks([...tasks, {text:taskInput, completed: false}]);
            setTaskInput('');
        }
      };
      
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

                <button onClick={handleStartStop}>{isRunning ? 'Stop' : 'Start'}</button>

                <button onClick={handleReset} disabled={isRunning}>Reset</button>
                <h2>{formatTime(time)}</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={taskInput}
                        onChange={(e) => setTaskInput(e.target.value)}
                        placeholder="Enter task"
                    />

                    <button type="submit">Enter task</button>
                </form>

                <ul>
                    {tasks.map((task, index) => (
                        <li key={index} 
                        className={task.completed ? 'done' : ''}
                        onClick={() => handleCompleted(index)}
                        >   
                            
                            {task.text}
                            <button onClick={(e) => {e.stopPropagation(); handleDelete(index)}}>Delete</button>
                        </li>
                    ))}
                </ul>
                
            </div>
        </div>


        </>
    )

};

export default Study