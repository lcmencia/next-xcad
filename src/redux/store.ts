import { configureStore } from '@reduxjs/toolkit';
import priceReducer from './services/priceSlice';
import { priceApi } from './services/priceApi';
import { setupListeners } from "@reduxjs/toolkit/dist/query";

export const store = configureStore({
  reducer: {
    priceReducer,
    [priceApi.reducerPath]: priceApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(priceApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;