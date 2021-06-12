import { createSlice } from '@reduxjs/toolkit';

const budgetSlice = createSlice({
  name: 'budget',
  initialState: {
    itemList: []
  },
  reducers: {
    getItems(state, action) {
      state.itemList = action.payload.data;
    }
  }
});

export const budgetActions = budgetSlice.actions;

export default budgetSlice;