import React, { useEffect, useState } from 'react';
import MoodDropdown from './DropDownMood';
import Song from './Song';
import SpotifyLogo from '../assets/spotify_logo.png'
import '../styles/HomePage.css'

interface SongType {
  artist: string;
  title: string;
  images?: string;
  preview?: string;
};

interface Temp {
  author: string;
  title: string;
}

const HomePage: React.FC = () => {
  const [playlistID, setPlaylistID] = useState('3M1BqU7ZmQJ6L6zLvaK5o6');
  const [selectedMood, setSelectedMood] = useState('Sad');
  const [songs, setSongs] = useState([]); // Add state to store the songs
  const store: Map<string, SongType> = new Map<string,SongType >();
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
        console.log(response)
        const reader = response.body.getReader();
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const decoder = new TextDecoder('utf-8');
            const text = decoder.decode(value);
            const jsonData = JSON.parse(text);
            console.log(jsonData);
            
            
            const requestBody: { mood: string; songs: Temp[] } = {
              'mood': selectedMood,
              'songs': [],
            }

            
            jsonData.songs.map((song : SongType) => {
              store.set(`${song.artist}-${song.title}`, song)
              const temp = {
                'author': song.artist,
                'title': song.title,
              }
              requestBody['songs'].push(temp);
            });

            const getTopSongs = await fetch(`http://127.0.0.1:5000/classify/many/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(requestBody)
            });

            const data = await getTopSongs.json();
            for(var old of jsonData.songs) {
              for(var newD of data) {
                if (old['artist'] == newD[1] && old['title'] == newD[0]) {
                  newD.push(old['images'])
                  newD.push(old['preview'])
                }
              }
            }
            setSongs(data);
          }
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
                selectedAuthor={song[1]}
                selectedTitle={song[0]}
                selectedImg={song[3]}
                selectedAudioLink={song[4]}
              />
            ))}
            </div>
    
        </div>
      )}
    </>
  );
  
  
};

export default HomePage;