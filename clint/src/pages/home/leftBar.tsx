import { Box, Button } from "@mui/material";
import React from "react";
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useSolvedPercentageQuery } from "../../store/slices/quiz/quizApi";
import { useTheme } from "@emotion/react";



interface LeftBarProps {
  setTable: (table: string) => void;
}

const LeftBar: React.FC<LeftBarProps> = ({setTable}) => {
  const { data } = useSolvedPercentageQuery();
  
  const navigate = useNavigate();
  const theme = useTheme();
  return (
    <Box width={300} height={550} bgcolor={theme.palette.primary.main} borderRadius={3} display={"flex"} flexDirection={"column"} justifyContent={"space-between"}>
      <Box display={"flex"} flexDirection={"column"} mt={5} mx={3} height={200} gap={5} alignItems={"center"}>
        <Button variant="contained" fullWidth sx={{ textTransform: "none", bgcolor: "secondary.main", "&:hover":{bgcolor:"secondary.light"} }} onClick={() => setTable("all")}>
          All quizes
        </Button>
        <Button variant="contained" fullWidth sx={{ textTransform: "none", bgcolor: "secondary.main", "&:hover":{bgcolor:"secondary.light"} }} onClick={() => setTable("my")}>
          My quizes
        </Button>
        <Button variant="contained" fullWidth sx={{ textTransform: "none", bgcolor: "secondary.main", "&:hover":{bgcolor:"secondary.light"} }} onClick={() => setTable("solved")}>
          solved quizes
        </Button>
      <Box width={100} mt={5}>
      <CircularProgressbar
      value={Math.floor(data)}
      text={`${Math.floor(data)}%`}
      styles={{
        path: {
          stroke: theme.palette.divider,
        },
        text: {
          fill: theme.palette.divider,
          fontSize: '16px',
        },
        trail: {
          stroke: theme.palette.secondary.main,
        },
      }}
    />
      </Box>
      </Box>
      <Box mb={3} mx={3}>
        <Button variant="contained" fullWidth sx={{ textTransform: "none", bgcolor: "secondary.main", "&:hover":{bgcolor:"secondary.light"}}} onClick={() => navigate("/createquiz3")}>
        Craete Quiz<AddIcon sx={{ml:1}} fontSize="small"/>
        </Button>
      </Box>
    </Box>
  );
};

export default LeftBar;
