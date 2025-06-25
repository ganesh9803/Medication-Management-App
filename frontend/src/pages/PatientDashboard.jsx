// src/pages/PatientDashboard.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMedications, fetchPatientAnalytics } from '../features/patient/patientSlice';

import TodayMedicationCard from '../components/patient/TodayMedicationCard';
import CaretakerSelector from '../components/patient/CaretakerSelector';
import MedicationHistory from '../components/patient/MedicationHistory';
import MedicationCalendar from '../components/patient/MedicationCalendar/MedicationCalendar';
import AdherenceSummaryCard from '../components/patient/AdherenceSummaryCard';


export default function PatientDashboard() {
  const dispatch = useDispatch();
  const { caretakerId, analytics } = useSelector((state) => state.patient);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    dispatch(fetchMedications());
    dispatch(fetchPatientAnalytics());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6 font-sans relative overflow-hidden">

      {/* Fullscreen overlay for caretaker selection */}
      {!caretakerId && (
        <div className="absolute inset-0 z-50 bg-white/90 dark:bg-zinc-900/95 flex items-center justify-center p-6 overflow-hidden">
          <div className="max-w-xl w-full bg-white dark:bg-zinc-800 p-6 rounded-3xl shadow-xl border border-blue-200 dark:border-zinc-700">
            <h2 className="text-2xl font-bold text-center mb-4 text-blue-700 dark:text-blue-300">
              👨‍⚕️ Choose a Caretaker
            </h2>
            <CaretakerSelector />
          </div>
        </div>
      )}


      {/* Main dashboard content */}
      <div className="max-w-7xl mx-auto space-y-6">
        {analytics && <AdherenceSummaryCard analytics={analytics} />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Today's Medication Section */}
          <div className="bg-white rounded-2xl shadow-md p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">📅 Today's Medication</h2>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded text-sm"
                onClick={() => setShowHistory(!showHistory)}
              >
                {showHistory ? 'Hide History' : 'View History'}
              </button>
            </div>
            {showHistory ? <MedicationHistory /> : <TodayMedicationCard />}
          </div>

          {/* Medication Calendar */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <MedicationCalendar />
          </div>

          {/* Caretaker Status */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-md p-6 text-center">
              <p className="text-green-600 text-lg font-semibold">✅ Caretaker assigned</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}