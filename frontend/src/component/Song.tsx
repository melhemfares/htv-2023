import React from "react";

interface SongProps {
    selectedImg: string;
    selectedTitle: string;
    selectedAuthor: string;
}

const Song: React.FC <SongProps> = ({ selectedImg, selectedTitle, selectedAuthor }) => {


    return (
        <div className="song">
             <h1>hi</h1>
        </div>
       
    )
}


export default Song;