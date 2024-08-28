import { Box } from '@mui/material';
import React from 'react';
import { useGetQuizesQuery } from '../../store/slices/quiz/quizApi';
import Animations from '../../component/skeleton';
const QuizesList = () => {
    const quizes = useGetQuizesQuery()
    return (
        <Box width={990} height={500} ml={4} bgcolor="primary.main" borderRadius={3} p={1} overflow={"hidden"}>
            <Box height={50}>
            </Box>
            {quizes.data ? quizes.data?.map((quiz) => (
                <Box key={quiz.id} bgcolor="secondary.main" height={40} borderRadius={3} my={1} display={"flex"} justifyContent={"space-between"} alignItems={"center"} p={1}>
                    <Box>{quiz.name}</Box>
                    <Box>{quiz.topic || ""}</Box>
                    <Box>{quiz.userId || ""}</Box>
                    <Box>{quiz.duration || ""}</Box>
                </Box>
            )) : <Animations/>}
            </Box>
    );
}

export default QuizesList;
