import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface Quiz {
  topic: string;
}

export default function SelectTopic({quiz, setQuiz}: {quiz: Quiz; setQuiz: React.Dispatch<React.SetStateAction<Quiz>>}) {
  const [age, setAge] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setQuiz({...quiz, topic: event.target.value});
  };

  return (
    <div>
      <FormControl sx={{minWidth: 150 }}>
        <InputLabel id="demo-simple-select-autowidth-label">Topic</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={quiz.topic}
          onChange={handleChange}
          autoWidth
          label="Topic"
        >
          <MenuItem value="Math">Math</MenuItem>
          <MenuItem value="Science">Science</MenuItem>
          <MenuItem value="Problem solving">Problem solving</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
