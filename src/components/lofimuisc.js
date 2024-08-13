import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPlay, faPause, faBackward, faForward,} from '@fortawesome/free-solid-svg-icons';
import {useRef, useEffect} from 'react';
import './lofimusic.css';
import { audioFile } from './audiofile';

const Lofimusic = () => {

    
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentAudio, setCurrentAudio] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);





    useEffect(() => {

        const audio = audioRef.current
        
        const handleAudioEnded = () => {
            handlePlayNext();
        };

        const handleMetaData = () => {
            setDuration(audio.duration);
        };     

        const handleTimeUpdated = () => {
            const audio = audioRef.current;
            setCurrentTime(audio.currentTime);
            
            const percentage = (audio.currentTime / duration) * 100;
            document.querySelector('.audio-slider').style.background = `linear-gradient(to right, #1DB954 ${percentage}%, black ${percentage}%)`;
        };
        

        audio.addEventListener("timeupdate", handleTimeUpdated)
        audio.addEventListener("loadedmetadata", handleMetaData)
        audio.addEventListener('ended', handleAudioEnded)
   
        if(isPlaying){
            audioRef.current.play();
        }
        else{
            audioRef.current.pause();
        }

        return () => {
            audio.removeEventListener('ended', handleAudioEnded);
            audio.removeEventListener("loadedmetadata", handleMetaData)
            audio.removeEventListener('ended', handleAudioEnded)
        }

    },[currentAudio, isPlaying]);


    const handlePlayPause = () => {
        setIsPlaying(!isPlaying)
    };

    const handlePlayNext = () => {

        setCurrentAudio(prevAudio => (prevAudio + 1) % audioFile.length);
        setIsPlaying(true);
    };

    const handlePlayPrevious = () => {

        setCurrentAudio(prevAudio => (prevAudio -1 + audioFile.length) % audioFile.length);
        setIsPlaying(true);
    };

    const handleSliderChange = (e) => {
        const newTime = parseFloat(e.target.value);
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    
        const percentage = (newTime / duration) * 100;
        e.target.style.background = `linear-gradient(to right, #1DB954 ${percentage}%, black ${percentage}%)`;
    };
    

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time - minutes * 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; 
    }


    return(
    <>
        <div className='audio-container'>
            <div className='audio-text'>
                <h2 className='audioname'>{audioFile[currentAudio].name}</h2>
                <span className='artisname'>{audioFile[currentAudio].artist}</span>
            </div>
            <div className='audio-icons-container'>
                
                <div className='audio-icons'>
                    <FontAwesomeIcon
                        icon={faBackward}
                        className='play-previous'
                        onClick={handlePlayPrevious}

                    />

                    <FontAwesomeIcon
                        icon={isPlaying ? faPause : faPlay}
                        className='pause-play'
                        onClick={handlePlayPause}
                    />

                    <FontAwesomeIcon
                        icon={faForward}
                        className='play-next'
                        onClick={handlePlayNext}
                    />
                </div>
                <div className='range-container'>
                        <span className='starting-audio-time'>{formatTime(currentTime)}</span>
                        <input
                            type='range'
                            min='0'
                            max={duration}
                            value={currentTime}                
                            onChange={handleSliderChange}
                            onMouseUp={handleSliderChange}
                            className='audio-slider'
                        />
                        <span className='end-audio-time'>{formatTime(duration)}</span>
                </div>

                  
                
            </div>
            

            <audio ref={audioRef} key={audioFile[currentAudio].src}>
                <source src={audioFile[currentAudio].src} type='audio/mp3'></source>
            </audio>

            
             

        </div>
  
    </>
    );

};

export default Lofimusic;