import React from 'react';
import '../styles/DropdownMood.css'

interface MoodDropdownProps {
  selectedMood: string;
  onMoodChange: (mood: string) => void;
}

const MoodDropdown: React.FC<MoodDropdownProps> = ({ selectedMood, onMoodChange }) => {
  const moodOptions = ['Happy', 'Sad', 'Love', 'Excited'];

  const handleMoodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onMoodChange(e.target.value);
  };

  return (
    <div className="moodmenu">
      <label htmlFor="mood">Select Mood:</label>
      <select id="mood" value={selectedMood} onChange={handleMoodChange}>
        {moodOptions.map((mood) => (
          <option key={mood} value={mood}>
            {mood}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MoodDropdown;