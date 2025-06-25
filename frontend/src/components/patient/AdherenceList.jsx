// src/components/patient/AdherenceList.jsx
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { markAdherenceStatus } from '../../features/patient/patientSlice';

export default function AdherenceList() {
  const dispatch = useDispatch();
  const { medications } = useSelector((state) => state.patient);
  const [selectedDate, setSelectedDate] = useState(new Date());

  if (!Array.isArray(medications)) {
    return (
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-2">Adherence Records</h2>
        <p className="text-gray-500">Loading medication data...</p>
      </div>
    );
  }

  // Flatten all adherence records with medication names
  const adherenceRecords = medications.flatMap((med) =>
    med.adherence.map((ad) => ({
      ...ad,
      medName: med.name,
      dateStr: new Date(ad.date).toDateString(),
    }))
  );

  // Calendar tile content
  const getTileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const record = adherenceRecords.find((r) => new Date(r.date).toDateString() === date.toDateString());
    if (!record) return null;

    const color =
      record.status === 'complete'
        ? 'text-green-600'
        : record.status === 'missed'
        ? 'text-red-500'
        : 'text-yellow-500';

    const icon =
      record.status === 'complete'
        ? '✅'
        : record.status === 'missed'
        ? '❌'
        : '⏳';

    return <span className={`${color} text-xs ml-1`}>{icon}</span>;
  };

  // Adherence details for selected date
  const recordsForDate = adherenceRecords.filter(
    (r) => new Date(r.date).toDateString() === selectedDate.toDateString()
  );

  const handleMark = (adherenceId, status) => {
    dispatch(markAdherenceStatus({ adherenceId, status }));
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Adherence Records</h2>

      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileContent={getTileContent}
        className="mb-4"
      />

      <ul className="text-sm text-gray-700 mb-4">
        <li><span className="text-green-600">✅</span> Complete</li>
        <li><span className="text-yellow-500">⏳</span> Pending</li>
        <li><span className="text-red-500">❌</span> Missed</li>
      </ul>

      {recordsForDate.length === 0 ? (
        <p className="text-gray-500">No records for {selectedDate.toDateString()}</p>
      ) : (
        recordsForDate.map((record) => (
          <div
            key={record.id}
            className="flex justify-between items-center p-2 border rounded mb-2"
          >
            <div>
              <p>
                <strong>{record.medName}</strong> —{' '}
                <span
                  className={`font-semibold ${
                    record.status === 'complete'
                      ? 'text-green-600'
                      : record.status === 'missed'
                      ? 'text-red-500'
                      : 'text-yellow-500'
                  }`}
                >
                  {record.status}
                </span>
              </p>
            </div>
            {record.status === 'pending' && (
              <div className="space-x-2">
                <button
                  className="px-3 py-1 bg-green-600 text-white rounded"
                  onClick={() => handleMark(record.id, 'complete')}
                >
                  Complete
                </button>
                <button
                  className="px-3 py-1 bg-red-600 text-white rounded"
                  onClick={() => handleMark(record.id, 'missed')}
                >
                  Missed
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
