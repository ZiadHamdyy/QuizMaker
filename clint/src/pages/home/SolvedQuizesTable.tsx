import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useGetSolvedQuizesQuery } from "../../store/slices/quiz/quizApi";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";

const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "Quiz Name",
    headerClassName: "super-app-theme--header",
    cellClassName: "super-app-theme--cell",
    width: 200,
  },

  {
    field: "topic",
    headerName: "Topic",
    headerClassName: "super-app-theme--header",
    cellClassName: "super-app-theme--cell",
    width: 200,
  },
  {
    field: "duration",
    headerName: "duration",
    headerClassName: "super-app-theme--header",
    cellClassName: "super-app-theme--cell",
    flex: 1,
    width: 200,
    editable: true,
    renderCell: (params) => `${params.value} minute`,
  },
  {
    field: "score",
    headerName: "Best score",
    headerClassName: "super-app-theme--header",
    cellClassName: "super-app-theme--cell",
    flex: 1,
  },
];

export default function SolvedQuizesTable() {
  const { data: quizes, error, isLoading } = useGetSolvedQuizesQuery();
  const navigate = useNavigate();
  const theme = useTheme();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading quizzes</div>;
  }

  return (
    <div style={{ height: 550, width: "1000px", marginLeft: "15px" }}>
      <DataGrid
        sx={{
          bgcolor: theme.palette.primary.main,
          borderRadius: 3,
          "& .super-app-theme--header": {
            backgroundColor: theme.palette.primary.dark,
          },
          "& .super-app-theme--cell": {
            backgroundColor:
              theme.palette.mode === "light"
                ? theme.palette.primary.main
                : theme.palette.primary.dark,
          },
        }}
        rows={quizes || []}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 20 },
          },
        }}
        pageSizeOptions={[5, 10, 20, 30]}
        onCellClick={(params) => navigate(`/solveQuiz/${params.row.id}`)}
      />
    </div>
  );
}
