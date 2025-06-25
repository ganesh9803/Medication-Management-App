// File: src/components/caretaker/PatientList.jsx
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedPatient } from '../../features/caretaker/caretakerSlice';

export default function PatientList({ onSelectPatient }) {
  const dispatch = useDispatch();
  const { patients, selectedPatient } = useSelector((state) => state.caretaker);

  const handleSelect = (patient) => {
    dispatch(setSelectedPatient(patient));
    if (onSelectPatient) {
      onSelectPatient();
    }
  };

  return (
    <div className="space-y-4">
      {patients.map((p) => {
        const hasMedications = p.medications && p.medications.length > 0;
        const medicationStatus = hasMedications ? 'Medications assigned' : 'No medications assigned';
        const statusClass = hasMedications ? 'text-green-600' : 'text-red-500';

        return (
          <div
            key={p.patientId}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${
              selectedPatient?.patientId === p.patientId
                ? 'bg-blue-100 border-blue-400'
                : 'bg-white hover:bg-gray-100'
            }`}
            onClick={() => handleSelect(p)}
          >
            <p className="font-semibold text-gray-800">{p.user.name}</p>
            <p className="text-sm text-gray-500">{p.user.email}</p>
            <p className={`text-xs font-medium mt-1 ${statusClass}`}>{medicationStatus}</p>
          </div>
        );
      })}
    </div>
  );
}
