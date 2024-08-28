import styled from '@emotion/styled';
import { Avatar, Box } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import CreateIcon from "@mui/icons-material/Create";
import React from 'react';
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

export default function InputFileUpload({userRegister, setUserRegister}: {userRegister: any, setUserRegister: (value: any) => void}) {
  const [image, setImage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setUserRegister({...userRegister, photo: image});
  }, [image, setUserRegister ]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === "string") {
          setImage(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      sx={{marginTop:"-60px"}}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: 150,
          height: 150,
          '&:hover .create-icon': {
            opacity: 1,
          },
        }}
      >
        <Avatar
          alt=""
          src={image}
          sx={{
            width: '100%',
            height: '100%',
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
            position: 'absolute',
            color: 'white',
            opacity: 0,
            transition: 'opacity 0.3s',
            pointerEvents: 'none',
          }}
        />
        <VisuallyHiddenInput
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </Box>
    </Box>
  );
}
