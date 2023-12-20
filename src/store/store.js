import { configureStore } from '@reduxjs/toolkit'

import companiesSlice from './slices/companiesSlice';
import workersSlice from './slices/workersSlice';

export const store = configureStore({
  reducer: {
    companies: companiesSlice,
    workers: workersSlice,
  },
})