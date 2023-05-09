import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type FiltersState = {
  value: {
    assetName: string,
    category: string,
    riskFactor: string,
  }
}

const initialState = {
  value: {
    assetName: "",
    category: "",
    riskFactor: "",
  }
} as FiltersState;

export const filters = createSlice({
  name: "filters",
  initialState,
  reducers: {
    reset: () => initialState,
    updateAssetName: (state, action: PayloadAction<string>) => {
      state.value.assetName = action.payload;
    },
    updateCategory: (state, action: PayloadAction<string>) => {
      state.value.category = action.payload;
    },
    updateRiskFactor: (state, action: PayloadAction<string>) => {
      state.value.riskFactor = action.payload;
    },
  },
});

export const {
  reset,
  updateAssetName,
  updateCategory,
  updateRiskFactor,
} = filters.actions;
export default filters.reducer;