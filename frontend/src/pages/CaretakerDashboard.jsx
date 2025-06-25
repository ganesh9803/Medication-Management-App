import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAssignedPatients,
  setSelectedPatient,
  fetchPatientAnalytics,
} from '../features/caretaker/caretakerSlice';

import PatientList from '../components/caretaker/PatientList';
import AssignMedicationForm from '../components/caretaker/AssignMedicationForm';
import MedicationCard from '../components/caretaker/MedicationCard';
import AdherenceSummaryCard from '../components/caretaker/AdherenceSummaryCard';
import CaretakerMedicationCalendar from '../components/caretaker/CaretakerMedicationCalendar/CaretakerMedicationCalendar';
import SelectedPatientMedicationHistory from '../components/caretaker/SelectedPatientMedicationHistory';
import { motion, AnimatePresence } from 'framer-motion';

export default function CaretakerDashboard() {
  const dispatch = useDispatch();
  const { selectedPatient, analytics } = useSelector((state) => state.caretaker);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    dispatch(fetchAssignedPatients()).then((res) => {
      if (res.payload?.length > 0) {
        dispatch(setSelectedPatient(res.payload[0]));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    if (selectedPatient?.patientId) {
      dispatch(fetchPatientAnalytics(selectedPatient.patientId));
    }
  }, [dispatch, selectedPatient]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-white dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 py-6 px-4 sm:px-8 font-sans text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Summary Card */}
        {analytics && <AdherenceSummaryCard analytics={analytics} />}

        {/* Tab Buttons */}
        <div className="flex justify-center flex-wrap gap-4">
          {['overview', 'recent', 'calendar', 'patientList'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm sm:text-base px-4 py-2 rounded-full font-medium shadow transition-all duration-200 hover:scale-105 ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 text-gray-800 dark:text-gray-100'
              }`}
            >
              {tab === 'overview' && '📋 Overview'}
              {tab === 'recent' && '🧾 Recent Activity'}
              {tab === 'calendar' && '🗓️ Calendar View'}
              {tab === 'patientList' && '👥 Patient List'}
            </button>
          ))}
        </div>

        {/* Animated Tabs */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && selectedPatient && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-zinc-800 p-6 rounded-3xl shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Assign Medication Panel */}
              <div className="space-y-4 bg-blue-50 dark:bg-blue-900 p-5 rounded-xl shadow-inner">
                <div className="border-b border-blue-200 dark:border-blue-700 pb-4 mb-4">
                  <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-1">
                    👤 {selectedPatient.user?.name}
                  </h2>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Email: {selectedPatient.user?.email}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Patient ID: {selectedPatient.patientId}</p>
                  <p className={`text-xs font-medium mt-1 ${selectedPatient.medications?.length > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {selectedPatient.medications?.length > 0 ? 'Medication Assigned' : 'No Medications Assigned'}
                  </p>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-blue-800 dark:text-blue-200">
                    💊 Assign New Medication
                  </h2>
                  <AssignMedicationForm />
                </div>
              </div>

              {/* Existing Medications Panel */}
              <div className="space-y-4 bg-gray-50 dark:bg-zinc-700 p-5 rounded-xl shadow-inner">
                <h2 className="text-xl sm:text-2xl font-semibold">📝 Existing Medications</h2>
                {selectedPatient.medications?.length > 0 ? (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 sm:pr-2">
                    {selectedPatient.medications.map((med) => (
                      <MedicationCard key={med.id} medication={med} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-300">No medications assigned yet.</p>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'recent' && selectedPatient && (
            <motion.div
              key="recent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-zinc-800 p-6 rounded-3xl shadow-2xl"
            >
              <SelectedPatientMedicationHistory />
            </motion.div>
          )}

          {activeTab === 'calendar' && selectedPatient && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-zinc-800 p-6 rounded-3xl shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <CaretakerMedicationCalendar />
              <div>
                <h2 className="text-xl font-bold mb-4">🩺 Today's Medication</h2>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 sm:pr-2">
                  {selectedPatient.medications?.map((med) => (
                    <div key={med.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md bg-white dark:bg-zinc-700">
                      <p className="font-semibold text-blue-800 dark:text-blue-200">💊 {med.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Dosage: {med.dosage}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Frequency: {med.frequency}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'patientList' && (
            <motion.div
              key="patientList"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-zinc-800 p-6 rounded-3xl shadow-2xl"
            >
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">👥 Assigned Patients</h2>
              <PatientList onSelectPatient={() => setActiveTab('overview')} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
