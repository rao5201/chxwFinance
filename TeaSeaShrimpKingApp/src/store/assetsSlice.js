import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { assetsAPI } from '../services/api';

export const getAssets = createAsyncThunk(
  'assets/getAssets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await assetsAPI.getAll();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getAssetById = createAsyncThunk(
  'assets/getAssetById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await assetsAPI.getById(id);
      return { id, data: response };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const assetsSlice = createSlice({
  name: 'assets',
  initialState: {
    assets: [],
    assetDetails: {},
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // 获取所有资产
    builder
      .addCase(getAssets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAssets.fulfilled, (state, action) => {
        state.loading = false;
        state.assets = action.payload.data.assets;
      })
      .addCase(getAssets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || '获取资产列表失败';
      });
    
    // 获取单个资产详情
    builder
      .addCase(getAssetById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAssetById.fulfilled, (state, action) => {
        state.loading = false;
        state.assetDetails[action.payload.id] = action.payload.data.data.asset;
      })
      .addCase(getAssetById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || '获取资产详情失败';
      });
  },
});

export const { clearError } = assetsSlice.actions;
export default assetsSlice.reducer;