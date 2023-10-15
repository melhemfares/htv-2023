import React from "react";
import '../styles/Song.css'

interface SongProps {
    selectedImg: string;
    selectedTitle: string;
    selectedAuthor: string;
    selectedAudioLink: string;
}

function onPlay() {

}

function onPause() {

}


const Song: React.FC <SongProps> = ({ selectedImg, selectedTitle, selectedAuthor, selectedAudioLink }) => {
    return (
        <div className="song-item">
            <img id="resize" src={selectedImg}/>
            <div className="text">
                <div className="title">{selectedTitle}</div>
                <div className="artist">By: {selectedAuthor}</div>
            </div>
        </div>
    )
}


export default Song;