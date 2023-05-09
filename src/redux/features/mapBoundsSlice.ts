import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BoundsLatLng } from "@/app/types";

type MapBoundsState = {
  value: BoundsLatLng | any;
}

const initialState: MapBoundsState = {
  value: null,
} as MapBoundsState;

export const mapBounds = createSlice({
  name: "mapBounds",
  initialState,
  reducers: {
    update: (state, action: PayloadAction<BoundsLatLng>) => {
      state.value = action.payload;
    },
  },
});

export const {
  update,
} = mapBounds.actions;
export default mapBounds.reducer;