// src/components/patient/MedicationCalendar.jsx
// src/components/patient/MedicationCalendar.jsx
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useSelector } from 'react-redux';
import './MedicationCalendar.css';

export default function MedicationCalendar() {
  const { medications } = useSelector((state) => state.patient);

  const adherence = medications?.flatMap((m) =>
    (m.adherence || []).map((entry) => ({
      ...entry,
      medName: m.name,
      dosage: m.dosage,
      dateStr: new Date(entry.date).toDateString(),
    }))
  ) || [];

  const getTileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const dateStr = date.toDateString();
    const matches = adherence.filter((a) => a.dateStr === dateStr);
    if (matches.length === 0) return null;

    return (
      <div className="mt-1 flex flex-wrap gap-1 justify-center">
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
      <h2 className="text-xl font-bold mb-6 text-gray-800">🗓️ Medication Calendar</h2>
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
