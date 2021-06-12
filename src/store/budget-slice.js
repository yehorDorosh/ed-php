import { createSlice } from '@reduxjs/toolkit';

const budgetSlice = createSlice({
  name: 'budget',
  initialState: {
    itemList: [],
    isLoading: false,
  },
  reducers: {
    getItems(state, action) {
      state.itemList = action.payload.data;
    },

    setIsLoading(state, action) {
      state.isLoading = action.payload.isLoading
    },
  }
});

export const budgetActions = budgetSlice.actions;

export default budgetSlice;