import React from 'react';

interface MoodDropdownProps {
  selectedMood: string;
  onMoodChange: (mood: string) => void;
}

const MoodDropdown: React.FC<MoodDropdownProps> = ({ selectedMood, onMoodChange }) => {
  const moodOptions = ['Happy', 'Sad', 'Calm', 'Energetic', 'Relaxed'];

  const handleMoodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onMoodChange(e.target.value);
  };

  return (
    <div>
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