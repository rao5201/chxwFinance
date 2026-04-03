import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { marketAPI } from '../services/api';

export const getMarketOverview = createAsyncThunk(
  'market/getOverview',
  async (_, { rejectWithValue }) => {
    try {
      const response = await marketAPI.getOverview();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getAssetPrice = createAsyncThunk(
  'market/getAssetPrice',
  async (symbol, { rejectWithValue }) => {
    try {
      const response = await marketAPI.getPrice(symbol);
      return { symbol, data: response };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getKlineData = createAsyncThunk(
  'market/getKlineData',
  async ({ symbol, interval, limit }, { rejectWithValue }) => {
    try {
      const response = await marketAPI.getKline(symbol, interval, limit);
      return { symbol, interval, data: response };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getMarketPairs = createAsyncThunk(
  'market/getPairs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await marketAPI.getPairs();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getOrderbook = createAsyncThunk(
  'market/getOrderbook',
  async ({ symbol, limit }, { rejectWithValue }) => {
    try {
      const response = await marketAPI.getOrderbook(symbol, limit);
      return { symbol, data: response };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getTrades = createAsyncThunk(
  'market/getTrades',
  async ({ symbol, limit }, { rejectWithValue }) => {
    try {
      const response = await marketAPI.getTrades(symbol, limit);
      return { symbol, data: response };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const marketSlice = createSlice({
  name: 'market',
  initialState: {
    overview: null,
    prices: {},
    klineData: {},
    pairs: [],
    orderbooks: {},
    trades: {},
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // 市场概览
    builder
      .addCase(getMarketOverview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMarketOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = action.payload.data;
      })
      .addCase(getMarketOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || '获取市场概览失败';
      });
    
    // 资产价格
    builder
      .addCase(getAssetPrice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAssetPrice.fulfilled, (state, action) => {
        state.loading = false;
        state.prices[action.payload.symbol] = action.payload.data.data;
      })
      .addCase(getAssetPrice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || '获取资产价格失败';
      });
    
    // K线数据
    builder
      .addCase(getKlineData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getKlineData.fulfilled, (state, action) => {
        state.loading = false;
        if (!state.klineData[action.payload.symbol]) {
          state.klineData[action.payload.symbol] = {};
        }
        state.klineData[action.payload.symbol][action.payload.interval] = action.payload.data.data;
      })
      .addCase(getKlineData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || '获取K线数据失败';
      });
    
    // 交易对
    builder
      .addCase(getMarketPairs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMarketPairs.fulfilled, (state, action) => {
        state.loading = false;
        state.pairs = action.payload.data.pairs;
      })
      .addCase(getMarketPairs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || '获取交易对失败';
      });
    
    // 订单簿
    builder
      .addCase(getOrderbook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderbook.fulfilled, (state, action) => {
        state.loading = false;
        state.orderbooks[action.payload.symbol] = action.payload.data.data;
      })
      .addCase(getOrderbook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || '获取订单簿失败';
      });
    
    // 交易历史
    builder
      .addCase(getTrades.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTrades.fulfilled, (state, action) => {
        state.loading = false;
        state.trades[action.payload.symbol] = action.payload.data.data;
      })
      .addCase(getTrades.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || '获取交易历史失败';
      });
  },
});

export const { clearError } = marketSlice.actions;
export default marketSlice.reducer;