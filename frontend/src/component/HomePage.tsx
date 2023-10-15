import React, { useEffect, useState } from 'react';
import MoodDropdown from './DropDownMood';
import Song from './Song';
import SpotifyLogo from '../assets/spotify_logo.png'
import '../styles/HomePage.css'

interface SongType {
  artist: string;
  title: string;
  images: string;
  preview: string;
};

interface Temp {
  author: string;
  title: string;
}

const HomePage: React.FC = () => {
  const [playlistID, setPlaylistID] = useState('3M1BqU7ZmQJ6L6zLvaK5o6');
  const [selectedMood, setSelectedMood] = useState('Happy');
  const [songs, setSongs] = useState<SongType[]>([]); // Add state to store the songs

  const handlePlaylistIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlaylistID(e.target.value);
  };

  const handleMoodChange = (mood: string) => {
    setSelectedMood(mood);
  };

  const handleSubmit = async () => {
    console.log("Pressed")
    try {
        // Make the API call and update songs state
        if(playlistID == '') {
            return;
        }
        
        const response = await fetch(`http://localhost:3000/spotify/playlist?id=${playlistID}`);
        
        if (!response.body) {
          throw new Error('Network response was not ok');
        }

        const reader = response.body.getReader();
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const decoder = new TextDecoder('utf-8');
            const text = decoder.decode(value);
            const jsonData = JSON.parse(text);
            console.log(jsonData);
            setSongs(jsonData.songs);
            
            const requestBody: { mood: string; songs: Temp[] } = {
              'mood': selectedMood,
              'songs': [],
            }

            jsonData.songs.map((song : SongType) => {
              const temp = {
                'author': song.artist,
                'title': song.title,
              }
              requestBody['songs'].push(temp);
            });

            const getTopSongs = await fetch(`127.0.0.1:5000/classify/many/`);
        }
        
        
        // console.log(data);
        // Update the songs state with the received data
        // setSongs(data);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
  };

  useEffect(() => {
    console.log(songs);
  }, [songs])

  return (
    <>
      <div className='container'>
        <div className="img-container">
          <img src={SpotifyLogo}/>
        </div>
        
        <h1>PlayMood</h1>
        <div className="playlist">
          <label htmlFor="playlistID">Enter Playlist ID:</label>
          <input
            type="text"
            id="playlistID"
            value={playlistID}
            onChange={handlePlaylistIDChange}
          />
        </div>
        
        <MoodDropdown selectedMood={selectedMood} onMoodChange={handleMoodChange} />
        <button className="submit" onClick={handleSubmit}>Submit</button>        
      </div>

      {songs.length > 0 && (
        <div className="song-container">
          <h2>Songs</h2>
            <div className='song-list'>
            {songs.map((song) => (
              <Song
                selectedAuthor={song.artist}
                selectedTitle={song.title}
                selectedImg={song.images}
                selectedAudioLink={song.preview}
              />
            ))}
            </div>
    
        </div>
      )}
    </>
  );
  
  
};

export default HomePage;