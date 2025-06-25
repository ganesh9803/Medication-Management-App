//src/components/features/caretaker/caretakerSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/authAPI';

// Thunks

export const fetchAssignedPatients = createAsyncThunk(
  'caretaker/fetchAssignedPatients',
  async (_, thunkAPI) => {
    try {
      const res = await API.get('/caretaker/patients');
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Failed to fetch patients'
      );
    }
  }
);

export const assignMedication = createAsyncThunk(
  'caretaker/assignMedication',
  async ({ patientId, name, dosage, frequency, durationDays }, thunkAPI) => {
    try {
      const res = await API.post('/caretaker/medications', {
        patientId,
        name,
        dosage,
        frequency,
        durationDays,
      });
      return res.data.medication;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Failed to assign medication'
      );
    }
  }
);

export const updateMedication = createAsyncThunk(
  'caretaker/updateMedication',
  async ({ medicationId, name, dosage, frequency, durationDays, patientId }, thunkAPI) => {
    try {
      const res = await API.patch('/caretaker/medications/update', {
        medicationId,
        name,
        dosage,
        frequency,
        durationDays,
        patientId,
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Failed to update medication'
      );
    }
  }
);


export const deleteMedication = createAsyncThunk(
  'caretaker/deleteMedication',
  async (medicationId, thunkAPI) => {
    try {
      const res = await API.delete(`/caretaker/medications/${medicationId}`);
      return res.data.medicationId;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Failed to delete medication'
      );
    }
  }
);


export const fetchPatientAnalytics = createAsyncThunk(
  'caretaker/fetchPatientAnalytics',
  async (patientId, thunkAPI) => {
    try {
      const res = await API.get(`/caretaker/adherence/analytics?patientId=${patientId}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Failed to fetch analytics'
      );
    }
  }
);

// Slice

const caretakerSlice = createSlice({
  name: 'caretaker',
  initialState: {
    patients: [],
    selectedPatient: null,
    analytics: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedPatient: (state, action) => {
      state.selectedPatient = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignedPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignedPatients.fulfilled, (state, action) => {
        state.patients = action.payload;
        state.loading = false;
      })
      .addCase(fetchAssignedPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(assignMedication.fulfilled, (state, action) => {
        const med = action.payload;
        const patient = state.patients.find((p) => p.patientId === med.patientId);
        if (patient) {
          patient.medications.push(med);
        }
        if (state.selectedPatient?.patientId === med.patientId) {
          state.selectedPatient.medications.push(med);
        }
      })

      .addCase(updateMedication.fulfilled, (state, action) => {
        const updated = action.payload;

        for (let patient of state.patients) {
          const medIndex = patient.medications.findIndex((m) => m.id === updated.id);
          if (medIndex !== -1) {
            patient.medications[medIndex] = updated;
            break;
          }
        }

        if (state.selectedPatient?.patientId === updated.patientId) {
          const medIndex = state.selectedPatient.medications.findIndex(
            (m) => m.id === updated.id
          );
          if (medIndex !== -1) {
            state.selectedPatient.medications[medIndex] = updated;
          }
        }
      })

      .addCase(deleteMedication.fulfilled, (state, action) => {
        const medId = action.payload;

        for (let patient of state.patients) {
          const index = patient.medications.findIndex((m) => m.id === medId);
          if (index !== -1) {
            patient.medications.splice(index, 1);
            break;
          }
        }

        if (state.selectedPatient) {
          const index = state.selectedPatient.medications.findIndex((m) => m.id === medId);
          if (index !== -1) {
            state.selectedPatient.medications.splice(index, 1);
          }
        }
      })

      .addCase(fetchPatientAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload;
      });
  },
});

export const { setSelectedPatient } = caretakerSlice.actions;
export default caretakerSlice.reducer;
