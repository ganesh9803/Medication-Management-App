//src/services/patientAPI.js

import API from './authAPI';

const patientAPI = {
getMedications: () => API.get('/patient/medications'),
markAdherence: (data) => API.patch('/patient/adherence', data),
assignCaretaker: (data) => API.patch('/patient/select-caretaker', data),
};

export default patientAPI;