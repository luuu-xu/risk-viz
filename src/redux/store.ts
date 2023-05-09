import { configureStore } from "@reduxjs/toolkit";
import mapBoundsReducer from "./features/mapBoundsSlice";
import filtersReducer from "./features/filtersSlice";
import decadeIndexReducer from "./features/decadeIndexSlice";
import { dataApi } from "./services/dataApi";
import { setupListeners } from "@reduxjs/toolkit/dist/query";

export const store = configureStore({
  reducer: {
    mapBoundsReducer,
    filtersReducer,
    decadeIndexReducer,
    [dataApi.reducerPath]: dataApi.reducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(dataApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;