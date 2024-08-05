import React, {useState, useEffect, useRef} from "react";
import './study.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faSquareCaretRight, faSquareCaretLeft, faPause } from '@fortawesome/free-solid-svg-icons';
import lofi1 from '../assets/1lofi.mp3';
import lofi2 from '../assets/2lofi.mp3'
import lofi3 from '../assets/3lofi.mp3'


const Study =() => {

    {/*Time variables */}
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);
    const startTimeRef = useRef(null);

    {/*Task variables S*/}
    const [tasks, setTasks] = useState([]);
    const [taskInput, setTaskInput] = useState('');

    {/*Audio Variables*/}
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentAudio, setCurrentAudio] = useState(0);

    const audioFile = [
        {src: lofi1, name: 'For The Last Time', artis: 'Hoko, Lucie Cravero'},
        {src: lofi2, name: 'Astral Scape', artis: 'Prithvi'},
        {src: lofi3, name: 'Shogun Street', artis:'Prithvi'}

    ]

    const updateTime = () => {
        if(isRunning){
            const now = Date.now();
            const timeElapsed = now - startTimeRef.current;
            setTime(timeElapsed);
        }
    }
 
{/*Time function */}

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

      {/*Audi Functions*/}

      useEffect(() => {
        if(isPlaying){
            audioRef.current.play();
        }
        else{
            audioRef.current.pause();
        }
      },[currentAudio, isPlaying]);

      const handleAudioPlayPause = () => {

        setIsPlaying(!isPlaying)
        
      };

      const hanldeAudioPrevious = () => {
        
        setCurrentAudio((prevAudio) => (prevAudio - 1 + audioFile.length) % audioFile.length);
        setIsPlaying(true)
      }

      const handleAudioNext = () => {

        setCurrentAudio((prevAudio) => (prevAudio  + 1 ) % audioFile.length);
        setIsPlaying(true)
        
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

        <audio ref={audioRef} key={audioFile[currentAudio].src}>
                    <source src={audioFile[currentAudio].src} type="audio/mp3"></source>
        </audio>
        
        <div className="audioplayer">
        <FontAwesomeIcon icon={faSquareCaretLeft} className="arrow-right" onClick={hanldeAudioPrevious}/>                
        <FontAwesomeIcon 
        icon={isPlaying ? faPause : faPlay}
        className="play" 
        onClick={handleAudioPlayPause}/>
        <FontAwesomeIcon icon={faSquareCaretRight} className="arrow-left" onClick={handleAudioNext} />
        <h2>Now playing: {audioFile[currentAudio].name}, by: {audioFile[currentAudio].artis}</h2>
        </div>

        </>
    )

};

export default Study