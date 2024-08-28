import { useState } from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import React from 'react';

const actions = [
  { icon: <TextFieldsIcon />, name: 'Text' },
  { icon: <AddPhotoAlternateIcon />, name: 'Photo' },
];

interface AddAnswersProps {
  setAddAnswer: (type: "Text" | "Photo") => void;
}

export default function AddAnswers({ setAddAnswer }: AddAnswersProps) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box>
      <SpeedDial
        ariaLabel="SpeedDial controlled open example"
        sx={{ marginY: "30px" }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        direction="right"
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => {
              setAddAnswer(action.name as "Text" | "Photo");
              handleClose();
            }}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}
