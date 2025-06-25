// src/components/caretaker/CaretakerMedicationCalendar.jsx
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useSelector } from 'react-redux';
import './CaretakerMedicationCalendar.css';

export default function CaretakerMedicationCalendar() {
  const { selectedPatient } = useSelector((state) => state.caretaker);

  if (!selectedPatient) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">🗓️ Medication Calendar</h2>
        <p className="text-gray-500">Please select a patient to view their calendar.</p>
      </div>
    );
  }

  const adherence = selectedPatient.medications?.flatMap((m) =>
    (m.adherence || []).map((entry) => ({
      ...entry,
      medName: m.name,
      dosage: m.dosage,
      frequency: m.frequency,
      dateStr: new Date(entry.date).toDateString(),
    }))
  ) || [];

  const getTileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const dateStr = date.toDateString();

    const matches = adherence.filter((a) => a.dateStr === dateStr);
    if (matches.length === 0) return null;

    // Group multiple entries per day
    return (
      <div className="mt-1 flex gap-1 justify-center flex-wrap">
        {matches.map((match, idx) => {
          const { status, medName, dosage } = match;
          const tooltip = `${medName} – ${dosage} – ${status}`;
          let color = 'bg-gray-400';
          if (status === 'complete') color = 'bg-green-500';
          else if (status === 'pending') color = 'bg-yellow-400';
          else if (status === 'missed') color = 'bg-red-500';

          return (
            <span
              key={idx}
              title={tooltip}
              className={`inline-block ${color} text-white text-xs px-1.5 py-0.5 rounded`}
            >
              {status === 'complete' ? '✓' : status === 'pending' ? '...' : '✕'}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-6 text-gray-800">
        🗓️ {selectedPatient.user?.name || 'Patient'}'s Medication Calendar
      </h2>
      <Calendar
        tileContent={getTileContent}
        className="mx-auto rounded-lg calendar-custom"
      />
      <div className="flex justify-center gap-6 mt-6 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 rounded bg-green-500"></span> Taken
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 rounded bg-yellow-400"></span> Pending
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 rounded bg-red-500"></span> Missed
        </div>
      </div>
    </div>
  );
}
