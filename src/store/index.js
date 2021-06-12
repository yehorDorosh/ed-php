import { configureStore } from '@reduxjs/toolkit';

import categorySlice from './category-slice';
import budgetSlice from './budget-slice';

const store = configureStore({
  reducer: {
    category: categorySlice.reducer,
    budget: budgetSlice.reducer
  }
});

export default store;