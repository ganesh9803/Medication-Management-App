import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/authAPI';

export const fetchMedications = createAsyncThunk(
  'patient/fetchMedications',
  async (_, thunkAPI) => {
    try {
      const res = await API.get('/patient/medications');
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch');
    }
  }
);

export const fetchPatientAnalytics = createAsyncThunk(
  'patient/fetchPatientAnalytics',
  async (_, thunkAPI) => {
    try {
      const res = await API.get('/patient/adherence/analytics');
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch analytics');
    }
  }
);

export const markAdherenceStatus = createAsyncThunk(
  'patient/markAdherenceStatus',
  async ({ adherenceId, status }, thunkAPI) => {
    try {
      const res = await API.patch('/patient/adherence', { adherenceId, status });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to mark adherence');
    }
  }
);

const patientSlice = createSlice({
  name: 'patient',
  initialState: {
    medications: [],
    caretakerId: null,
    analytics: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedications.fulfilled, (state, action) => {
        state.medications = action.payload.medications || [];
        state.caretakerId = action.payload.caretakerId || null;
        state.loading = false;
      })
      .addCase(fetchMedications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markAdherenceStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        state.medications = state.medications.map((med) => ({
          ...med,
          adherence: med.adherence.map((a) => (a.id === updated.id ? updated : a)),
        }));
      })
      .addCase(fetchPatientAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload;
      });
  },
});

export default patientSlice.reducer;