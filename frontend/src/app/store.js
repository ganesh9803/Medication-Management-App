//src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import patientReducer from '../features/patient/patientSlice';
import caretakerReducer from '../features/caretaker/caretakerSlice';

const store = configureStore({
reducer: {
auth: authReducer,
patient: patientReducer,
caretaker: caretakerReducer,
},
});

export default store;