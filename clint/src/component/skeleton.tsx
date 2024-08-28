import * as React from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

export default function Animations() {
  return (
    <Box sx={{ width: 750, marginLeft: "20px" }}>
      <Skeleton sx={{height:80}}/>
      <Skeleton animation="wave" sx={{height:80}}/>
      <Skeleton animation={false} sx={{height:80}}/>
    </Box>
  );
}