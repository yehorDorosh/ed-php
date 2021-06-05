import { configureStore } from '@reduxjs/toolkit';

import categorySlice from './category-slice';

const stroe = configureStore({
  reducer: {category: categorySlice.reducer,}
});

export default stroe;