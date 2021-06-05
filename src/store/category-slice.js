import { createSlice } from '@reduxjs/toolkit';

function moveAllCategoryToStart(elem) {
  if (elem === 'all') {
    return -1;
  } else {
    return 1;
  }
}

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    expense: ['all'],
    income: ['all']
  },
  reducers: {
    fetchedCategoryHandler(state, action) {
      const newCategoryList = JSON.parse(action.payload.data);
      if (Array.isArray(newCategoryList)) {
        if (action.payload.categoryType === 'expense') {
          state.expense = newCategoryList.sort().sort(moveAllCategoryToStart);
        } else if (action.payload.categoryType === 'income') {
          state.income = newCategoryList.sort().sort(moveAllCategoryToStart);
        }
      }
    },

    setCategoryList(state, action) {
      if (action.payload.categoryType === 'expense') {
        state.expense = action.payload.category
      } else if (action.payload.categoryType === 'income') {
        state.income = action.payload.category
      }
    }
  }
});

export const categoryActions = categorySlice.actions;

export default categorySlice;