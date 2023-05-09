import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type DecadeIndexState = {
  value: number;
}

const initialState : DecadeIndexState = {
  value: 0,
}

export const decadeIndex = createSlice({
  name: "decadeIndex",
  initialState,
  reducers: {
    set: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
  },
});

export const { set } = decadeIndex.actions;
export default decadeIndex.reducer;