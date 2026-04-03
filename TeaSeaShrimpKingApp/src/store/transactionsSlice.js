import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { transactionsAPI } from '../services/api';

export const createTransaction = createAsyncThunk(
  'transactions/create',
  async (transactionData, { rejectWithValue }) => {
    try {
      const response = await transactionsAPI.create(transactionData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getTransactionHistory = createAsyncThunk(
  'transactions/getHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await transactionsAPI.getHistory();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: {
    transactions: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // 创建交易
    builder
      .addCase(createTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions.unshift(action.payload.data.transaction);
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || '创建交易失败';
      });
    
    // 获取交易历史
    builder
      .addCase(getTransactionHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransactionHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.data.transactions;
      })
      .addCase(getTransactionHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || '获取交易历史失败';
      });
  },
});

export const { clearError } = transactionsSlice.actions;
export default transactionsSlice.reducer;