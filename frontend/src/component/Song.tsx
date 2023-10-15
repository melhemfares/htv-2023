import React, { useRef, useState } from "react";
import '../styles/Song.css'

interface SongProps {
    selectedImg: string | undefined;
    selectedTitle: string;
    selectedAuthor: string;
    selectedAudioLink: string | undefined;
}

const Song: React.FC<SongProps> = ({ selectedImg, selectedTitle, selectedAuthor, selectedAudioLink }) => {
    const [isPlaying, setIsPlaying] = useState(false);  // State to track if audio is playing
    const audioRef = useRef<HTMLAudioElement | null>(null);  // Reference to the audio element

    function onPlay() {
        if (audioRef.current) {
            audioRef.current.play();
            setIsPlaying(true);
        }
    }

    function onPause() {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    }

    function handleImageClick() {
        if (isPlaying) {
            onPause();
        } else {
            onPlay();
        }
    }

    return (
        <div className="song-item">
            <img id="resize" src={selectedImg} onClick={handleImageClick}/>
            <div className="text">
                <div className="title">{selectedTitle}</div>
                <div className="artist">By: {selectedAuthor}</div>
            </div>
            {selectedAudioLink &&   <audio ref={audioRef} src={selectedAudioLink}></audio>}
        </div>
    );
}

export default Song;
