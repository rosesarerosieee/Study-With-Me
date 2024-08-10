import { useState } from 'react';
import lofi1 from '../assets/1lofi.mp3';
import lofi2 from '../assets/2lofi.mp3';
import lofi3 from '../assets/3lofi.mp3';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPlay, faPause, faBackward, faForward,} from '@fortawesome/free-solid-svg-icons';
import {useRef, useEffect} from 'react';
import './lofimusic.css'

const Lofimusic = () => {

    
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentAudio, setCurrentAudio] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);



    const audioFile = [
        {src: lofi1, name: 'For The Last Time', artist: 'Hoko, Lucie Cravero'},
        {src: lofi2, name: 'Astral Scape', artist: 'Prithvi'},
        {src: lofi3, name: 'Shogun Street', artist:'Prithvi'}
    
    ]

    useEffect(() => {

        const audio = audioRef.current
        
        const handleAudioEnded = () => {
            handlePlayNext();
        };

        const handleMetaData = () => {
            setDuration(audio.duration);
        };     

        const handleTimeUpdated = () => {
            setCurrentTime(audio.currentTime);
        }

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
        const newTime = parseFloat(e.target.value)
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    }

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time - minutes * 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        
        
    }


    return(
    <>
        <div className='audio-container'>
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

                <input
                    type='range'
                    min='0'
                    max={duration}
                    value={currentTime}                
                    onChange={handleSliderChange}
                    onMouseUp={handleSliderChange}
                    className='audio-slider'
                />

                <div className='audio-time'>
                <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                     
                </div>
            </div>

            <audio ref={audioRef} key={audioFile[currentAudio].src}>
                <source src={audioFile[currentAudio].src} type='audio/mp3'></source>
            </audio>

            <div className='audio-text'>
                <h2>Now playing: {audioFile[currentAudio].name} by: {audioFile[currentAudio].artist}</h2>
            </div>
        </div>
  
    </>
    );

};

export default Lofimusic;