import { Box } from "@mui/material";
import { useState, useRef } from "react";
import CreateIcon from "@mui/icons-material/Create";
import styled from "@emotion/styled";
import React from "react";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

interface InputFileUploadProps {
  onImageChange: (photo: string, context: "question" | "answer", index?: number) => void;
  context: "question" | "answer";
  index?: number;
  photo?: string;
}

export default function InputFileUpload({ onImageChange, context, index, photo }: InputFileUploadProps) {
  const [imagePreview, setImagePreview] = useState<string>(photo || "");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSizeInMB = 2;
      if (file.size > maxSizeInMB * 1024 * 1024) {
        setError(`File size exceeds ${maxSizeInMB}MB. Please upload a smaller file.`);
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === "string") {
          setImagePreview(e.target.result);
          onImageChange(e.target.result, context, index);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: 150,
          height: 150,
          "&:hover .create-icon": {
            opacity: 1,
          },
        }}
        bgcolor="secondary.light"
      >
        <Box
          component="img"
          alt="Selected photo"
          src={imagePreview || "No photo"}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            "&:hover": {
              cursor: "pointer",
              opacity: 0.5,
              bgcolor: "black",
            },
          }}
          onClick={handleAvatarClick}
        />
        <CreateIcon
          className="create-icon"
          sx={{
            position: "absolute",
            color: "white",
            opacity: 0,
            transition: "opacity 0.3s",
            pointerEvents: "none",
          }}
        />
        <VisuallyHiddenInput
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </Box>
      {error && (
        <Box sx={{ color: "red", mt: 1, textAlign: "center" }}>
          {error}
        </Box>
      )}
    </Box>
  );
}
