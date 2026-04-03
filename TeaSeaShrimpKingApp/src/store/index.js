import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import marketReducer from './marketSlice';
import assetsReducer from './assetsSlice';
import transactionsReducer from './transactionsSlice';
import aiReducer from './aiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    market: marketReducer,
    assets: assetsReducer,
    transactions: transactionsReducer,
    ai: aiReducer,
  },
});

export default store;