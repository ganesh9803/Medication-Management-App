//src/components/MedicationList.jsx
import { useSelector } from 'react-redux';
import MedicationCard from '../MedicationCard';

export default function MedicationsList() {
  const { medications } = useSelector((state) => state.patient);

  if (!Array.isArray(medications)) {
    return (
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-2">Your Medications</h2>
        <p className="text-gray-500">Loading or invalid medication data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-2">Your Medications</h2>
      {medications.length === 0 ? (
        <p className="text-gray-500">No medications assigned yet.</p>
      ) : (
        medications.map((med) => <MedicationCard key={med.id} medication={med} />)
      )}
    </div>
  );
}
