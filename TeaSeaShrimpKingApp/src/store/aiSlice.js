import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { aiAPI } from '../services/api';

export const analyze = createAsyncThunk(
  'ai/analyze',
  async (analysisData, { rejectWithValue }) => {
    try {
      const response = await aiAPI.analyze(analysisData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getAnalysisHistory = createAsyncThunk(
  'ai/getHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await aiAPI.getHistory();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const aiSlice = createSlice({
  name: 'ai',
  initialState: {
    analysisHistory: [],
    currentAnalysis: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentAnalysis: (state) => {
      state.currentAnalysis = null;
    },
  },
  extraReducers: (builder) => {
    // AI分析
    builder
      .addCase(analyze.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(analyze.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAnalysis = action.payload.data;
        state.analysisHistory.unshift(action.payload.data);
      })
      .addCase(analyze.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'AI分析失败';
      });
    
    // 获取分析历史
    builder
      .addCase(getAnalysisHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAnalysisHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.analysisHistory = action.payload.data.analyses;
      })
      .addCase(getAnalysisHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || '获取分析历史失败';
      });
  },
});

export const { clearError, clearCurrentAnalysis } = aiSlice.actions;
export default aiSlice.reducer;