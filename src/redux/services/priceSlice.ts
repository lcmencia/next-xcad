import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PriceState {
  averagePrice: number | null;
}

const initialState: PriceState = {
  averagePrice: 0.00,
};

const priceSlice = createSlice({
  name: 'price',
  initialState,
  reducers: {
    setAveragePrice(state, action: PayloadAction<number>) {
      state.averagePrice = action.payload;
    },
  },
});

export const { setAveragePrice } = priceSlice.actions;
export default priceSlice.reducer;