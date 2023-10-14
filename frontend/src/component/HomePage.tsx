import React, { useState } from 'react';
import MoodDropdown from './DropDownMood';
import Song from './Song';

const HomePage: React.FC = () => {
  const [playlistID, setPlaylistID] = useState('');
  const [selectedMood, setSelectedMood] = useState('Happy');
  const [songs, setSongs] = useState([
    {img: '', title: '', author: ''},
    {img: '', title: '', author: ''}
  ]); // Add state to store the songs

  const handlePlaylistIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlaylistID(e.target.value);
  };

  const handleMoodChange = (mood: string) => {
    setSelectedMood(mood);
  };

  const handleSubmit = async () => {
    // Implement your logic for handling the playlist ID and selected mood here
    //make api call, wait for response, then navigate to
    /*
    sad: [

    ],
    happy: [

    ],
    exciting: [

    ],
    calm: [

    ]
    */
    try {
        // Make the API call and update songs state
        const response = await fetch(`your_api_endpoint?playlistID=${playlistID}&mood=${selectedMood}`);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const data = await response.json();
        
        // Update the songs state with the received data
        setSongs(data.songs);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
  };

  return (
    <div>
      <h1>Playlist Mood Selector</h1>
      <div>
        <label htmlFor="playlistID">Enter Playlist ID:</label>
        <input
          type="text"
          id="playlistID"
          value={playlistID}
          onChange={handlePlaylistIDChange}
        />
      </div>
      <MoodDropdown selectedMood={selectedMood} onMoodChange={handleMoodChange} />
      <button onClick={handleSubmit}>Submit</button>
      {songs.length > 0 && (
        <div>
          <h2>Songs</h2>
            <div className='song-container'>
            {songs.map((song, index) => (
              <Song
                key={index}
                selectedImg={song.img}
                selectedTitle={song.title}
                selectedAuthor={song.author}
              />
            ))}
            </div>
    
        </div>
      )}
    </div>
  );
  
  
};

export default HomePage;