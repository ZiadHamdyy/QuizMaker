import { createSlice } from "@reduxjs/toolkit";

interface UserState {
    id: string | null,
    name: string | null,
    email: string | null,
    password: string | null,
    photo: string | null;
    dayOfBirth: number | null;
  }
  
  const initialState: UserState = {
    id: null,
    name: null,
    email: null,
    password: null,
    photo: null,
    dayOfBirth: null,
  };

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        getUserById: (state, action) => {
            const user = action.payload as UserState;
            state.id = user.id;
            state.name = user.name;
            state.email = user.email;
            state.dayOfBirth = user.dayOfBirth;
            state.photo = user.photo;
        },
    }
});
export const { getUserById } = userSlice.actions;
export default userSlice.reducer;
export const selectCurrentUserId = (state: any) => state.user?.id;
export const selectCurrentUserName = (state: any) => state.user?.name;
