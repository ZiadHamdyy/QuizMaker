import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface Quiz {
  duration: number;
}

export default function SelectDuration({quiz, setQuiz}: {quiz: Quiz; setQuiz: React.Dispatch<React.SetStateAction<Quiz>>}) {

  const handleChange = (event: SelectChangeEvent) => {
    setQuiz({...quiz, duration: parseInt(event.target.value, 10)});
  };

  return (
    <div>
      <FormControl sx={{minWidth: 150 }}>
        <InputLabel id="demo-simple-select-autowidth-label">Duration</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={quiz.duration}
          onChange={handleChange}
          autoWidth
          label="Duration"
        >
          <MenuItem value={5}>5 min</MenuItem>
          <MenuItem value={10}>10 min</MenuItem>
          <MenuItem value={20}>20 min</MenuItem>
          <MenuItem value={30}>30 min</MenuItem>
          <MenuItem value={40}>40 min</MenuItem>
          <MenuItem value={50}>50 min</MenuItem>
          <MenuItem value={60}>60 min</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
