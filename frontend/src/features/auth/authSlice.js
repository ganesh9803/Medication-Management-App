//src/features/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/authAPI';
import { setToken as persistToken, getToken } from '../../Utility/auth';

const initialToken = getToken();
const initialRole = localStorage.getItem('role');

export const loginOrRegister = createAsyncThunk(
  'auth/loginOrRegister',
  async ({ isLogin, form }, thunkAPI) => {
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/signup';
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : form;

      const res = await API.post(endpoint, payload);
      persistToken(res.data.token);
      localStorage.setItem('role', res.data.role); // Save role too

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Something went wrong'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: initialToken,
    role: initialRole,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginOrRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginOrRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.role = action.payload.role;
      })
      .addCase(loginOrRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
